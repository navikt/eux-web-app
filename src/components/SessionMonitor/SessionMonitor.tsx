import { closeModal, openModal } from 'actions/ui'
import { logMeAgain } from 'actions/app'
import PT from 'prop-types'
import React, { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import styled from 'styled-components'

const SessionMonitorDiv = styled.div`
font-size: 80%;
`

export interface SessionMonitorProps {
  checkInterval?: number;
  expirationTime?: Date;
  millisecondsForWarning?: number;
  sessionExpiredReload?: number;
  now?: Date;
}

const SessionMonitor: React.FC<SessionMonitorProps> = ({
  /* check every minute */
  checkInterval = 1000 * 60,
  /* When session will expire */
  expirationTime,
  /* Warnings should start under 5 minutes */
  millisecondsForWarning = 5 * 1000 * 60,
  /* Reload under a minute */
  sessionExpiredReload = 1000,
  now
}: SessionMonitorProps): JSX.Element => {
  const [mounted, setMounted] = useState<boolean>(false)
  const [diffHtml, setDiffHtml] = useState<string>('')
  const { t } = useTranslation()
  const dispatch = useDispatch()

  const logMe = useCallback(() => {
    dispatch(logMeAgain())
  }, [dispatch])

  useEffect(() => {
    const getDiff = (expirationTime: any, now: any) => {
      const _now: Date = now || new Date()
      const diff: number = expirationTime.getTime() - _now.getTime()
      console.log('minutes left', Math.ceil(diff / 1000 / 60))
      setDiffHtml(Math.ceil(diff / 1000 / 60) + ' min')
      return diff
    }

    const checkTimeout = () => {
      if (!expirationTime) {
        return
      }
      setTimeout(() => {
        const diff = getDiff(expirationTime, now)
        if (diff < sessionExpiredReload) {
          window.location.reload()
        }
        if (diff < millisecondsForWarning) {
          dispatch(openModal({
            modalTitle: t('app:session-expire-title'),
            modalText: t('app:session-expire', { minutes: Math.ceil(Math.abs(diff / 1000 / 60)) }),
            modalButtons: [{
              main: true,
              text: t('app:ok-got-it'),
              onClick: dispatch(closeModal)
            }, {
              main: false,
              text: t('app:log-me-again'),
              onClick: logMe
            }]
          }))
        }
        checkTimeout()
      }, checkInterval)
    }

    if (!mounted && expirationTime !== undefined) {
      getDiff(expirationTime, now)
      checkTimeout()
      setMounted(true)
    }
  }, [checkInterval, dispatch, expirationTime, logMe, millisecondsForWarning, mounted, now, sessionExpiredReload, t])

  return (
    <SessionMonitorDiv>
      Sesjon utløper om {diffHtml}
    </SessionMonitorDiv>
  )
}

SessionMonitor.propTypes = {
  checkInterval: PT.number,
  expirationTime: PT.instanceOf(Date),
  millisecondsForWarning: PT.number,
  sessionExpiredReload: PT.number,
  now: PT.instanceOf(Date)
}
export default SessionMonitor
