import * as urls from 'constants/urls'
import {logMeAgain, reduceSessionTime, setExpirationTime, setSessionEndsAt} from 'actions/app'
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
      const expirationTime = new Date(tokens.expire_at).getTime()
      const session = wonderwallResponse?.session
      const sessionEndsAt: number = (session) ? new Date(session.ends_at).getTime()  : -1

      timeTuple = [expirationTime, sessionEndsAt];
/*
      if (state && state.app) {
        state.app.expirationTime = expirationTime
        state.app.sessionEndsAt = sessionEndsAt
      }
*/

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
  const { pdu1, replySed, state }: SessionMonitorSelector = useAppSelector(mapState)

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

  const calculateDiff = (endTime: number | undefined) => {
    if (endTime) {
      const _now: Date = new Date()
      return endTime - _now.getTime()
    } else {
      return 0
    }
  }

  const triggerReload = () => {
    window.location.reload()
  }

  async function fetchWonderwallTimeout() {
    const response = await fetch(urls.API_UTGAARDATO_URL,  {
      method: "GET"
    })
    const wonderwallResponse: WonderwallResponse = await response.json()
    return extractTime(response, wonderwallResponse, state)
  }

  async function refreshWonderwallTimeout() {
    const response = await fetch(urls.API_REAUTENTISERING_URL,  {
      method: "POST"
    })
    const wonderwallResponse: WonderwallResponse = await response.json()
    return extractTime(response, wonderwallResponse, state);
  }

  async function checkTimeout () {
    let wonderwallTimeout = await fetchWonderwallTimeout()
    let tokenExpirationTime = wonderwallTimeout[0];
    let sessionEndTime = wonderwallTimeout[1];
    if (!_.isNumber(tokenExpirationTime)) {
      return
    }
    console.log('checkTimeout expirationtime', tokenExpirationTime)
    console.log('checkTimeout old diff', diff)

//    const diff1 = updateTokenDiff(tokenExpirationTime)
//    const sessionDiff1 = updateSessionDiff(sessionEndTime)
    const tokenDiff = calculateDiff(tokenExpirationTime)
    const sessionDiff = calculateDiff(sessionEndTime)

    console.log('checkTimeout new diff', diff)
    if (tokenDiff < sessionExpiredReload || sessionDiff < sessionExpiredReload) {
      triggerReload()
    }
    if (sessionDiff < millisecondsForWarning) {
      setModal(true)
    }
    if (expirationTime != undefined && tokenExpirationTime != expirationTime) {
      dispatch(setExpirationTime(tokenExpirationTime))
    }
    if (sessionEndTime != undefined && sessionEndsAt != undefined && sessionEndTime != sessionEndsAt) {
      dispatch(setSessionEndsAt(sessionEndTime))
    }

    if (tokenDiff < tokenAutoRenew) {
      const tuple = await refreshWonderwallTimeout()
      let tokenExpiration = tuple[0];
      let sessionEnd = tuple[1];
      if (_.isNumber(tokenExpiration) && tokenExpiration > 0) {
        dispatch(setExpirationTime(tokenExpiration))
        dispatch(setSessionEndsAt(sessionEnd))
        console.log('checkTimeout new expirationTime local', tokenExpiration)
        console.log('checkTimeout new expirationTime state', state?.app.expirationTime)
      }
    }

  }

  useEffect(() => {
    let intervalId: number = -1
    if (expirationTime !== undefined) {
      console.log('useEffect expirationtime', expirationTime )
      console.log('useEffect diff', diff )

//      if (diff > 0) {
//        setDiff(diff)
//      } else {
//        updateTokenDiff(expirationTime)
//      }
  //    if (sessionEndsAt !== undefined) {
  //      updateSessionDiff(sessionEndsAt)
  //    }
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
    Token utløper om {Math.ceil(calculateDiff(expirationTime) / 1000 / 60)} min.
    </Button>
  )
  const sessionButton = (
    <Button variant='tertiary' size='small' onClick={() => setModal(true)}  style={{color: 'red'}}>
      Sesjon utløper om {Math.ceil(calculateDiff(sessionEndsAt) / 1000 / 60)} min
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
