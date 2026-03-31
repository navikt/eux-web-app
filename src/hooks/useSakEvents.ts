import { useEffect, useRef, useState } from 'react'
import { fetchEventSource } from '@microsoft/fetch-event-source'
import { useAppDispatch } from 'store'
import { querySaks } from 'actions/svarsed'

type SseConnectionStatus = 'connecting' | 'connected' | 'disconnected' | 'error'

const useSakEvents = (rinaSakId: string | undefined): SseConnectionStatus => {
  const dispatch = useAppDispatch()
  const [status, setStatus] = useState<SseConnectionStatus>('disconnected')
  const retryCountRef = useRef(0)
  const isMountedRef = useRef(true)
  const maxRetries = 5

  useEffect(() => {
    if (!rinaSakId) return

    const controller = new AbortController()
    isMountedRef.current = true
    setStatus('connecting')
    retryCountRef.current = 0

    fetchEventSource(`/api/sse/rinasak/${rinaSakId}`, {
      signal: controller.signal,

      onopen: async (response) => {
        if (response.ok) {
          if (isMountedRef.current) setStatus('connected')
          retryCountRef.current = 0
        } else {
          if (isMountedRef.current) setStatus('error')
          throw new Error(`SSE connection failed: ${response.status}`)
        }
      },

      onmessage: (event) => {
        if (event.event === 'sak-update') {
          dispatch(querySaks(rinaSakId, 'timer'))
        }
      },

      onclose: () => {
        if (isMountedRef.current) setStatus('disconnected')
      },

      onerror: (err) => {
        retryCountRef.current += 1
        if (retryCountRef.current >= maxRetries) {
          if (isMountedRef.current) setStatus('error')
          throw err // stop retrying
        }
        if (isMountedRef.current) setStatus('connecting')
        return Math.min(1000 * Math.pow(2, retryCountRef.current), 30000)
      },
    })

    return () => {
      isMountedRef.current = false
      controller.abort()
    }
  }, [rinaSakId, dispatch])

  return status
}

export default useSakEvents
