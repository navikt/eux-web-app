import { closeModal, openModal } from 'actions/ui'
import { logMeAgain } from 'actions/app'
import PT from 'prop-types'
import React, { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import styled from 'styled-components'

export interface SessionMonitorProps {
  checkInterval?: number;
  expirationTime?: Date;
  millisecondsForWarning?: number;
  sessionExpiredReload?: number;
  now?: Date;
}

const SessionMonitorDiv = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  color: #3e3832;
  overflow: hidden;
  max-height: 2.3em;
  margin: 2px;
  padding: 0em 0.5em;
  z-index: 99999;
`
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
  },[dispatch])

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
            modalTitle: t('ui:session-expire-title'),
            modalText: t('ui:session-expire-text', { minutes: Math.ceil(Math.abs(diff / 1000 / 60)) }),
            modalButtons: [{
              main: true,
              text: t('ui:ok-got-it'),
              onClick: dispatch(closeModal)
            }, {
              main: false,
              text: t('ui:log-me-again'),
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
      {diffHtml}
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
