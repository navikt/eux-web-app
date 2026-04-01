import { useEffect, useRef, useState } from 'react'
import { fetchEventSource } from '@microsoft/fetch-event-source'
import { useAppDispatch } from 'store'
import { querySaks } from 'actions/svarsed'

type SseConnectionStatus = 'connecting' | 'connected' | 'disconnected' | 'error'

export type JournalfoeringStatus =
  | 'SED_MOTTATT'
  | 'SED_SENDT'
  | 'UNDER_JOURNALFOERING'
  | 'JOURNALFOERT'
  | 'MANUELL_JOURNALFOERING'
  | 'FERDIGSTILT'

export type SedJournalstatus = JournalfoeringStatus | 'IKKE_JOURNALFOERT'

interface SakEventData {
  eventType: string
  rinaSakId: string
  status?: string
  sedId?: string
}

export type SedStatuses = Record<string, JournalfoeringStatus>

export interface UseSakEventsResult {
  connectionStatus: SseConnectionStatus
  sedStatuses: SedStatuses
  completedSedIds: ReadonlySet<string>
}

const STATUSES_TRIGGERING_REFRESH: ReadonlyArray<JournalfoeringStatus> = [
  'JOURNALFOERT', 'MANUELL_JOURNALFOERING', 'FERDIGSTILT'
]

const DISPLAY_STATUSES: ReadonlyArray<JournalfoeringStatus> = [
  'UNDER_JOURNALFOERING', 'MANUELL_JOURNALFOERING',
  'JOURNALFOERT', 'FERDIGSTILT'
]

const VALID_STATUSES: ReadonlyArray<string> = [
  'SED_MOTTATT', 'SED_SENDT', 'UNDER_JOURNALFOERING',
  'JOURNALFOERT', 'MANUELL_JOURNALFOERING', 'FERDIGSTILT'
]

const COMPLETION_STATUSES: ReadonlyArray<JournalfoeringStatus> = [
  'JOURNALFOERT', 'FERDIGSTILT'
]

const AUTO_CLEAR_DELAY = 5000
const POST_CLEAR_REFRESH_DELAY = 2000

// SSE sedId format: "rinaSakId_documentId_version" (e.g. "1455997_3426b91a..._1")
// API sedId format: "documentId" (e.g. "3426b91a...")
const extractDocumentId = (sseSedId: string): string => {
  const parts = sseSedId.split('_')
  return parts.length >= 3 ? parts.slice(1, -1).join('_') : sseSedId
}

const useSakEvents = (rinaSakId: string | undefined): UseSakEventsResult => {
  const dispatch = useAppDispatch()
  const [connectionStatus, setConnectionStatus] = useState<SseConnectionStatus>('disconnected')
  const [sedStatuses, setSedStatuses] = useState<SedStatuses>({})
  const [completedSedIds, setCompletedSedIds] = useState<Set<string>>(new Set())
  const retryCountRef = useRef(0)
  const isMountedRef = useRef(true)
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const clearTimersRef = useRef<Record<string, ReturnType<typeof setTimeout>>>({})
  const postClearRefreshTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const maxRetries = 5

  useEffect(() => {
    if (!rinaSakId) return

    const controller = new AbortController()
    isMountedRef.current = true
    setConnectionStatus('connecting')
    setSedStatuses({})
    setCompletedSedIds(new Set())
    retryCountRef.current = 0

    fetchEventSource(`/api/sse/rinasak/${rinaSakId}`, {
      signal: controller.signal,

      onopen: async (response) => {
        if (response.ok) {
          if (isMountedRef.current) setConnectionStatus('connected')
          retryCountRef.current = 0
        } else {
          if (isMountedRef.current) setConnectionStatus('error')
          throw new Error(`SSE connection failed: ${response.status}`)
        }
      },

      onmessage: (event) => {
        if (event.event === 'sak-update' && isMountedRef.current) {
          let status: JournalfoeringStatus | undefined
          let documentId: string | undefined

          try {
            const data: SakEventData = JSON.parse(event.data)
            if (data.sedId?.trim()) {
              documentId = extractDocumentId(data.sedId)
            }
            if (data.status && VALID_STATUSES.includes(data.status)) {
              status = data.status as JournalfoeringStatus
            }
          } catch {
            // data not parseable — fall through to trigger refresh
          }

          if (status && documentId) {
            if (DISPLAY_STATUSES.includes(status)) {
              setSedStatuses(prev => ({ ...prev, [documentId!]: status! }))

              if (clearTimersRef.current[documentId]) {
                clearTimeout(clearTimersRef.current[documentId])
                delete clearTimersRef.current[documentId]
              }

              // Auto-clear completion statuses after delay
              if (STATUSES_TRIGGERING_REFRESH.includes(status)) {
                // Track completed SEDs so we don't fall back to stale API data
                if (COMPLETION_STATUSES.includes(status)) {
                  setCompletedSedIds(prev => new Set(prev).add(documentId!))
                }

                clearTimersRef.current[documentId] = setTimeout(() => {
                  if (isMountedRef.current) {
                    setSedStatuses(prev => {
                      const next = { ...prev }
                      delete next[documentId!]
                      return next
                    })
                    // Schedule a delayed refresh after clearing to get fresh API data
                    postClearRefreshTimerRef.current = setTimeout(() => {
                      if (isMountedRef.current) {
                        dispatch(querySaks(rinaSakId, 'timer'))
                      }
                      postClearRefreshTimerRef.current = null
                    }, POST_CLEAR_REFRESH_DELAY)
                  }
                  delete clearTimersRef.current[documentId!]
                }, AUTO_CLEAR_DELAY)
              }
            }
          }

          if (!status || STATUSES_TRIGGERING_REFRESH.includes(status)) {
            if (debounceTimerRef.current) {
              clearTimeout(debounceTimerRef.current)
            }
            debounceTimerRef.current = setTimeout(() => {
              if (isMountedRef.current) {
                dispatch(querySaks(rinaSakId, 'timer'))
              }
            }, 500)
          }
        }
      },

      onclose: () => {
        if (isMountedRef.current) setConnectionStatus('disconnected')
      },

      onerror: (err) => {
        retryCountRef.current += 1
        if (retryCountRef.current >= maxRetries) {
          if (isMountedRef.current) setConnectionStatus('error')
          throw err
        }
        if (isMountedRef.current) setConnectionStatus('connecting')
        return Math.min(1000 * Math.pow(2, retryCountRef.current), 30000)
      },
    })

    return () => {
      isMountedRef.current = false
      controller.abort()
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current)
      if (postClearRefreshTimerRef.current) clearTimeout(postClearRefreshTimerRef.current)
      Object.values(clearTimersRef.current).forEach(clearTimeout)
    }
  }, [rinaSakId, dispatch])

  return { connectionStatus, sedStatuses, completedSedIds }
}

export default useSakEvents
