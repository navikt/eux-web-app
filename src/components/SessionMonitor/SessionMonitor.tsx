import { logMeAgain, reduceSessionTime } from 'actions/app'
import { PDU1 } from 'declarations/pd'
import { ReplySed } from 'declarations/sed'
import PT from 'prop-types'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAppDispatch, useAppSelector } from 'store'
import styled from 'styled-components'
import Modal from 'components/Modal/Modal'
import { BodyLong, Button } from '@navikt/ds-react'
import { State } from 'declarations/reducers'
import _ from 'lodash'
import { IS_DEVELOPMENT, IS_Q } from 'constants/environment'

const SessionMonitorDiv = styled.div`
font-size: 80%;
`

export interface SessionMonitorProps {
  checkInterval?: number
  expirationTime?: number
  millisecondsForWarning?: number
  sessionExpiredReload?: number
  now?: Date
}

export interface SessionMonitorSelector {
  pdu1: PDU1 | null | undefined
  replySed: ReplySed | null | undefined
}

const mapState = (state: State): SessionMonitorSelector => ({
  pdu1: state.pdu1.pdu1,
  replySed: state.svarsed.replySed
})

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
  const [diff, setDiff] = useState<number>(0)
  const [modal, setModal] = useState<boolean>(false)
  const { pdu1, replySed }: SessionMonitorSelector = useAppSelector(mapState)

  const { t } = useTranslation()
  const dispatch = useAppDispatch()

  const getDiff = (expirationTime: number, now: any) => {
    const _now: Date = now || new Date()
    const diff: number = expirationTime - _now.getTime()
    console.log('minutes left', Math.ceil(diff / 1000 / 60))
    setDiff(diff)
    return diff
  }

  const triggerReload = () => {
    window.location.reload()
  }

  const checkTimeout = () => {
    if (!_.isNumber(expirationTime)) {
      return
    }
    setTimeout(() => {
      const diff = getDiff(expirationTime, now)
      if (diff < sessionExpiredReload) {
        triggerReload()
      }
      if (diff < millisecondsForWarning) {
        setModal(true)
      }
      checkTimeout()
    }, checkInterval)
  }

  useEffect(() => {
    if (expirationTime !== undefined) {
      getDiff(expirationTime, now)
      checkTimeout()
    }
  }, [expirationTime])

  const title = t(diff > millisecondsForWarning ? 'app:session-ok-title' : 'app:session-expire-title')
  const text = []
  text.push(t(diff > millisecondsForWarning ? 'app:session-ok-text' : 'app:session-expire-text', { minutes: Math.ceil(diff / 1000 / 60) }))
  const hasDraft = !_.isNil(pdu1) || !_.isNil(replySed)

  if (hasDraft) {
    text.push(t('app:session-you-have-draft', { utkast: !_.isNil(pdu1) ? 'PD U1' : 'Svar SED' }))
  }

  const modalButtons = [
    {
      main: true,
      text: t('el:button-ok-got-it'),
      onClick: () => setModal(false)
    }, {
      main: false,
      text: t('el:button-log-me-again'),
      onClick: () => dispatch(logMeAgain())
    }
  ]

  if (IS_Q || IS_DEVELOPMENT) {
    modalButtons.splice(2, 0, {
      main: false,
      text: t('app:session-reduce-to-6-min'),
      onClick: () => dispatch(reduceSessionTime())
    })
  }

  return (
    <SessionMonitorDiv>
      <Modal
        open={modal}
        onModalClose={() => setModal(false)}
        modal={{
          modalTitle: title,
          modalText: (<>{text.map(t => <BodyLong key={t}>{t}</BodyLong>)}</>),
          modalButtons
        }}
      />
      <Button variant='tertiary' size='small' onClick={() => setModal(true)}>
        Sesjon utløper om {Math.ceil(diff / 1000 / 60)} min
      </Button>
    </SessionMonitorDiv>
  )
}

SessionMonitor.propTypes = {
  checkInterval: PT.number,
  expirationTime: PT.number,
  millisecondsForWarning: PT.number,
  sessionExpiredReload: PT.number,
  now: PT.instanceOf(Date)
}
export default SessionMonitor
