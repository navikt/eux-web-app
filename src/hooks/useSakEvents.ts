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

interface SakEventData {
  eventType: string
  rinaSakId: string
  status?: string
}

export interface UseSakEventsResult {
  connectionStatus: SseConnectionStatus
  journalfoeringStatus: JournalfoeringStatus | undefined
}

const STATUSES_TRIGGERING_REFRESH: ReadonlyArray<JournalfoeringStatus> = [
  'JOURNALFOERT', 'MANUELL_JOURNALFOERING', 'FERDIGSTILT'
]

const VALID_STATUSES: ReadonlyArray<string> = [
  'SED_MOTTATT', 'SED_SENDT', 'UNDER_JOURNALFOERING',
  'JOURNALFOERT', 'MANUELL_JOURNALFOERING', 'FERDIGSTILT'
]

const useSakEvents = (rinaSakId: string | undefined): UseSakEventsResult => {
  const dispatch = useAppDispatch()
  const [connectionStatus, setConnectionStatus] = useState<SseConnectionStatus>('disconnected')
  const [journalfoeringStatus, setJournalfoeringStatus] = useState<JournalfoeringStatus | undefined>(undefined)
  const retryCountRef = useRef(0)
  const isMountedRef = useRef(true)
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const statusClearTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const maxRetries = 5

  useEffect(() => {
    if (!rinaSakId) return

    const controller = new AbortController()
    isMountedRef.current = true
    setConnectionStatus('connecting')
    setJournalfoeringStatus(undefined)
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

          try {
            const data: SakEventData = JSON.parse(event.data)
            if (data.status && VALID_STATUSES.includes(data.status)) {
              status = data.status as JournalfoeringStatus
            }
          } catch {
            // data not parseable — fall through to trigger refresh
          }

          if (status) {
            setJournalfoeringStatus(status)

            if (statusClearTimerRef.current) {
              clearTimeout(statusClearTimerRef.current)
            }
            if (STATUSES_TRIGGERING_REFRESH.includes(status)) {
              statusClearTimerRef.current = setTimeout(() => {
                if (isMountedRef.current) setJournalfoeringStatus(undefined)
              }, 8000)
            }
          }

          // Only fetch new data for statuses that actually change the oversikt
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
      if (statusClearTimerRef.current) clearTimeout(statusClearTimerRef.current)
    }
  }, [rinaSakId, dispatch])

  return { connectionStatus, journalfoeringStatus }
}

export default useSakEvents
