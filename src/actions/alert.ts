import * as types from 'constants/actionTypes'
import { ActionWithPayload } from '@navikt/fetch'
import { Action, ActionCreator } from 'redux'

import { JSX } from "react";

export const alertReset: ActionCreator<Action> = (): Action => ({
  type: types.ALERT_RESET
})

export const alertFailure: ActionCreator<ActionWithPayload<{message: JSX.Element | string}>> = (
  message: JSX.Element | string
): ActionWithPayload<{message: JSX.Element | string}> => ({
  type: types.ALERT_FAILURE,
  payload: {
    message
  }
})

export const alertSuccess: ActionCreator<ActionWithPayload<{message: JSX.Element | string}>> = (
  message: JSX.Element | string
): ActionWithPayload<{message: JSX.Element | string}> => ({
  type: types.ALERT_SUCCESS,
  payload: {
    message
  }
})

export const alertWarning: ActionCreator<ActionWithPayload<{message: JSX.Element | string}>> = (
  message: JSX.Element | string
): ActionWithPayload<{message: JSX.Element | string}> => ({
  type: types.ALERT_WARNING,
  payload: {
    message
  }
})
