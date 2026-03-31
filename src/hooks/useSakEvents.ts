import { useEffect, useRef, useState } from 'react'
import { fetchEventSource } from '@microsoft/fetch-event-source'
import { useAppDispatch } from 'store'
import * as types from 'constants/actionTypes'

type SseConnectionStatus = 'connecting' | 'connected' | 'disconnected' | 'error'

const useSakEvents = (rinaSakId: string | undefined): SseConnectionStatus => {
  const dispatch = useAppDispatch()
  const [status, setStatus] = useState<SseConnectionStatus>('disconnected')
  const retryCountRef = useRef(0)
  const maxRetries = 5

  useEffect(() => {
    if (!rinaSakId) return

    const controller = new AbortController()
    setStatus('connecting')
    retryCountRef.current = 0

    fetchEventSource(`/api/sse/rinasak/${rinaSakId}`, {
      signal: controller.signal,

      onopen: async (response) => {
        if (response.ok) {
          setStatus('connected')
          retryCountRef.current = 0
        } else {
          setStatus('error')
          throw new Error(`SSE connection failed: ${response.status}`)
        }
      },

      onmessage: (event) => {
        if (event.event === 'sak-update') {
          try {
            const payload = JSON.parse(event.data)
            dispatch({
              type: types.SVARSED_SAKS_TIMER_REFRESH_SUCCESS,
              payload: payload.data,
              context: { searchedFromFrontpage: false }
            })
          } catch (e) {
            console.error('Failed to parse SSE event:', e)
          }
        }
        // heartbeat events are handled automatically (keep-alive)
      },

      onclose: () => {
        setStatus('disconnected')
      },

      onerror: (err) => {
        retryCountRef.current += 1
        if (retryCountRef.current >= maxRetries) {
          setStatus('error')
          throw err // stop retrying
        }
        setStatus('connecting')
        // Return retry interval in ms (exponential backoff)
        return Math.min(1000 * Math.pow(2, retryCountRef.current), 30000)
      },
    })

    return () => {
      controller.abort()
      setStatus('disconnected')
    }
  }, [rinaSakId, dispatch])

  return status
}

export default useSakEvents
