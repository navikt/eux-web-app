import { logMeAgain, reduceSessionTime } from 'actions/app'
import { PDU1 } from 'declarations/pd'
import { ReplySed } from 'declarations/sed'
import PT from 'prop-types'
import React, {CSSProperties, useEffect, useState} from 'react'
import { useTranslation } from 'react-i18next'
import { useAppDispatch, useAppSelector } from 'store'
import styled from 'styled-components'
import Modal from 'components/Modal/Modal'
import { BodyLong, Button } from '@navikt/ds-react'
import { State } from 'declarations/reducers'
import _ from 'lodash'
import { IS_DEVELOPMENT, IS_Q } from 'constants/environment'
import {API_REAUTENTISERING_URL, API_UTGAARDATO_URL} from 'constants/urls'
import app, {initialAppState} from "../../reducers/app";
import * as types from "../../constants/actionTypes";
import { setTimeout, setInterval } from 'worker-timers';

const SessionMonitorDiv = styled.div`
font-size: 80%;
`

export interface SessionMonitorProps {
  checkInterval?: number
  expirationTime?: number
  sessionEndsAt?: number
  millisecondsForWarning?: number
  sessionExpiredReload?: number
  sessionAutoRenew?: number
  now?: Date
}

export interface SessionMonitorSelector {
  pdu1: PDU1 | null | undefined
  replySed: ReplySed | null | undefined
  state: State | null | undefined
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
  replySed: state.svarsed.replySed,
  state: state
})

function extractTime(response: Response, wonderwallResponse: WonderwallResponse, state: State | null | undefined) {
  let timeTuple: [number, number];
  timeTuple = [-1, -1]
  if (response.ok) {
    const tokens = wonderwallResponse?.tokens
    if (tokens) {
      const nowDate: Date = new Date()
      const diffMillis: number = new Date(tokens.expire_at).getTime() - nowDate.getTime()
      const expirationTime = new Date(tokens.expire_at).getTime()

      const session = wonderwallResponse?.session

      const sessionEndsAt: number = (session) ? new Date(session.ends_at).getTime()  : 0;
//      const expirationTime = new Date().setTime(new Date().getTime() + diffMillis)

      timeTuple = [expirationTime, sessionEndsAt];

      const diffMinutes: number = Math.ceil(diffMillis / 1000 / 60);
      console.log('Wonderwall minutes left', diffMinutes)

      if (state && state.app) {
        console.log('Wonderwall setting', diffMinutes)
        console.log('Wonderwall expirationTime', expirationTime)

        state.app.expirationTime = expirationTime
        state.app.sessionEndsAt = sessionEndsAt;
      }
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
  /* Automatically try to renew session in background under 30 minutes */
  sessionAutoRenew = 70 * 1000 * 60,
  now
}: SessionMonitorProps): JSX.Element => {
  const [diff, setDiff] = useState<number>(0)
  const [sessionDiff, setSessionDiff] = useState<number>(0)
  const [modal, setModal] = useState<boolean>(false)
  const { pdu1, replySed, state }: SessionMonitorSelector = useAppSelector(mapState)

  const { t } = useTranslation()
  const dispatch = useAppDispatch()

  const getDiff = (expirationTime: number, now: any) => {
    const _now: Date = new Date()
    console.log('expirationTime', expirationTime)
    console.log('now', _now.getTime())
    const diff: number = expirationTime - _now.getTime()
    console.log('minutes left', Math.ceil(diff / 1000 / 60))
    setDiff(diff)
    return diff
  }

  const getSessionDiff = (expirationTime: number, now: any) => {
    const _now: Date = new Date()
    console.log('sessionEndsAt', expirationTime)
    console.log('now', _now.getTime())
    const diff: number = expirationTime - _now.getTime()
    console.log('minutes left', Math.ceil(diff / 1000 / 60))
    setSessionDiff(diff)
    return diff
  }

  const triggerReload = () => {
    window.location.reload()
  }

  async function checkTimeout () {
    let wonderwallTimeout = await currentWonderwallTimeout()
    console.log('currentWonderwallTimeout', wonderwallTimeout)
    let tokenExpirationTime = wonderwallTimeout[0];
    let sessionEndTime = wonderwallTimeout[1];
    if (!_.isNumber(tokenExpirationTime)) {
      return
    }
    const diff = getDiff(tokenExpirationTime, now)
    console.log('diff', diff)
    const sessionDiff = getSessionDiff(sessionEndTime, now)
    console.log('sessionDiff', sessionDiff)

    if (diff < sessionExpiredReload) {
      console.log('trigger reload')
      triggerReload()
    }
    if (diff < millisecondsForWarning) {
      console.log('trigger modal')
      setModal(true)
    }
    if (diff < sessionAutoRenew) {
      if (tokenExpirationTime < (sessionEndTime - 1000)) {
        console.log('trigger checkWonderwallTimeout')
        checkWonderwallTimeout()
      } else {
        console.log('trigger nothing. session max')
      }
    }
  }

  function checkTimeoutWrapper() {
    checkTimeout()
    return 0
  }

  async function checkWonderwallTimeout() {
    const response = await fetch(API_REAUTENTISERING_URL,  {
      method: "POST"
    })
    const wonderwallResponse: WonderwallResponse = await response.json()
    return extractTime(response, wonderwallResponse, state);

  }

  async function currentWonderwallTimeout() { // return tuple
    const response = await fetch(API_UTGAARDATO_URL,  {
      method: "GET"
    })
    const wonderwallResponse: WonderwallResponse = await response.json()
    return extractTime(response, wonderwallResponse, state)
  }

  useEffect(() => {
    if (expirationTime !== undefined) {
      getDiff(expirationTime, now)
      if (sessionEndsAt !== undefined) {
        getSessionDiff(sessionEndsAt, now)
      }
      setInterval(checkTimeout, checkInterval)
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
        Token utløper om {Math.ceil(diff / 1000 / 60)} min.
        { sessionDiff != null && (sessionDiff < 380) ? <span color="red">Sesjon utløper om {Math.ceil(sessionDiff / 1000 / 60)} min</span> : ''}

      </Button>
    </SessionMonitorDiv>
  )
}

SessionMonitor.propTypes = {
  checkInterval: PT.number,
  expirationTime: PT.number,
  sessionEndsAt: PT.number,
  millisecondsForWarning: PT.number,
  sessionExpiredReload: PT.number,
  sessionAutoRenew: PT.number,
  now: PT.instanceOf(Date)
}
export default SessionMonitor
