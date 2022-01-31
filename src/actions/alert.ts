import * as types from 'constants/actionTypes'
import { ActionWithPayload, ErrorPayload } from 'js-fetch-api'
import { Action, ActionCreator } from 'redux'

export const alertClear: ActionCreator<Action> = (): Action => ({
  type: types.ALERT_CLEAR
})

export const setAlertError: ActionCreator<ActionWithPayload<ErrorPayload>> = (
  payload: ErrorPayload
): ActionWithPayload<ErrorPayload> => ({
  type: types.ALERT_ERROR_SET,
  payload: payload
})

export const setAlertSuccess: ActionCreator<ActionWithPayload<any>> = (
  message: string
): ActionWithPayload<any> => ({
  type: types.ALERT_SUCCESS_SET,
  payload: {
    message
  }
})
