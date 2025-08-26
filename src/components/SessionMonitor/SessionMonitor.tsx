import * as urls from 'constants/urls'
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
import { setInterval } from 'worker-timers';

const SessionMonitorDiv = styled.div`
font-size: 80%;
`

export interface SessionMonitorProps {
  checkInterval?: number
  expirationTime?: number
  sessionEndsAt?: number
  millisecondsForWarning?: number
  sessionExpiredReload?: number
  sessionStatusWarning?: number
  tokenAutoRenew?: number
  now?: Date
}

export interface SessionMonitorSelector {
  pdu1: PDU1 | null | undefined
  replySed: ReplySed | null | undefined
}

export interface WonderwallResponse {
  session: {
    created_at: string
    ends_at: string
    timeout_at: string
    ends_in_seconds: number
    active: true
    timeout_in_seconds: number
  }
  tokens: {
    expire_at: string
    refreshed_at: string
    expire_in_seconds: number
    next_auto_refresh_in_seconds: number
    refresh_cooldown: boolean
    refresh_cooldown_seconds: number
  }
}

const mapState = (state: State): SessionMonitorSelector => ({
  pdu1: state.pdu1.pdu1,
  replySed: state.svarsed.replySed
})

function extractTime(response: Response, wonderwallResponse: WonderwallResponse) {
  let timeTuple: [number, number];
  timeTuple = [-1, -1]
  if (response.ok) {
    const tokens = wonderwallResponse?.tokens
    if (tokens) {
      const expirationTime = new Date(tokens.expire_at).getTime()
      const session = wonderwallResponse?.session
      const sessionEndsAt: number = (session) ? new Date(session.ends_at).getTime()  : -1

      timeTuple = [expirationTime, sessionEndsAt];
    } else {
      console.log('No content')
    }
  } else {
    console.log('Failed call')
  }
  return timeTuple
}

const SessionMonitor: React.FC<SessionMonitorProps> = ({
  /* check every minute */
  checkInterval = 1000 * 60,
  /* When token will expire */
  expirationTime,
  /* When session will expire */
  sessionEndsAt,
  /* Warnings should start under 5 minutes */
  millisecondsForWarning = 5 * 1000 * 60,
  /* Reload under a minute */
  sessionExpiredReload = 1000,
  /* Display session expiration warning under 30 minutes */
  sessionStatusWarning = 595 * 1000 * 60,
  /* Automatically try to renew token in background under 30 minutes */
  tokenAutoRenew = 70 * 1000 * 60,
  now
}: SessionMonitorProps): JSX.Element => {
  const [diff, setDiff] = useState<number>(0)
  const [sessionDiff, setSessionDiff] = useState<number>(0)
  const [modal, setModal] = useState<boolean>(false)
  const { pdu1, replySed }: SessionMonitorSelector = useAppSelector(mapState)

  const { t } = useTranslation()
  const dispatch = useAppDispatch()

  const updateTokenDiff = (expirationTime: number) => {
    const _now: Date = new Date()
    const diff: number = expirationTime - _now.getTime()
    console.log('minutes left', Math.ceil(diff / 1000 / 60))
    setDiff(diff)
    return diff
  }

  const updateSessionDiff = (sessionEndsAt: number) => {
    const _now: Date = new Date()
    const diff: number = sessionEndsAt - _now.getTime()
    setSessionDiff(diff)
    return diff
  }

  const triggerReload = () => {
    window.location.reload()
  }

  async function checkTimeout () {
    let wonderwallTimeout = await currentWonderwallTimeout()
    let tokenExpirationTime = wonderwallTimeout[0];
    let sessionEndTime = wonderwallTimeout[1];
    if (!_.isNumber(tokenExpirationTime)) {
      return
    }
    const diff = updateTokenDiff(tokenExpirationTime)
    const sessionDiff = updateSessionDiff(sessionEndTime)

    if (diff < sessionExpiredReload || sessionDiff < sessionExpiredReload) {
      triggerReload()
    }
    if (diff < millisecondsForWarning) {
      setModal(true)
    }
  }

  async function currentWonderwallTimeout() {
    const response = await fetch(urls.API_UTGAARDATO_URL,  {
      method: "GET"
    })
    const wonderwallResponse: WonderwallResponse = await response.json()
    return extractTime(response, wonderwallResponse)
  }

  useEffect(() => {
    let intervalId: number = -1
    if (expirationTime !== undefined) {
      updateTokenDiff(expirationTime)
      if (sessionEndsAt !== undefined) {
        updateSessionDiff(sessionEndsAt)
      }
      intervalId = setInterval(checkTimeout, checkInterval)
    }
    return () => {
      if (intervalId !== -1) {
        clearInterval(intervalId)
      }
    }
  }, [expirationTime, sessionEndsAt])

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

  const tokenButton = (
    <Button variant='tertiary' size='small' onClick={() => setModal(true)}>
    Token utløper om {Math.ceil(diff / 1000 / 60)} min.
    </Button>
  )
  const sessionButton = (
    <Button variant='tertiary' size='small' onClick={() => setModal(true)}  style={{color: 'red'}}>
      Sesjon utløper om {Math.ceil(sessionDiff / 1000 / 60)} min
    </Button>
  )
  const modalButton = (
    <Modal
      open={modal}
      onModalClose={() => setModal(false)}
      modal={{
        modalTitle: title,
        modalText: (<>{text.map(t => <BodyLong key={t}>{t}</BodyLong>)}</>),
        modalButtons
      }}
    />
  )
  if ( sessionDiff !== undefined && sessionStatusWarning !== undefined && sessionDiff < sessionStatusWarning) {
    return (
      <SessionMonitorDiv>
        {modalButton}
        {tokenButton}
        {sessionButton}
      </SessionMonitorDiv>
    )
  } else {
    return (
      <SessionMonitorDiv>
        {modalButton}
        {tokenButton}
      </SessionMonitorDiv>
    )
  }
}

SessionMonitor.propTypes = {
  checkInterval: PT.number,
  expirationTime: PT.number,
  sessionEndsAt: PT.number,
  millisecondsForWarning: PT.number,
  sessionExpiredReload: PT.number,
  sessionStatusWarning: PT.number,
  tokenAutoRenew: PT.number,
  now: PT.instanceOf(Date)
}
export default SessionMonitor
