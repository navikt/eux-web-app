import * as types from 'constants/actionTypes'
import { ActionWithPayload } from 'js-fetch-api'
import { Action, ActionCreator } from 'redux'

export const alertClear: ActionCreator<Action> = (): Action => ({
  type: types.ALERT_CLEAR
})

export const alertFailure = (message: string): ActionWithPayload<any> => ({
  type: types.ALERT_FAILURE,
  payload: {
    message
  }
})

export const alertSuccess: ActionCreator<ActionWithPayload<any>> = (
  message:  JSX.Element | string
): ActionWithPayload<any> => ({
  type: types.ALERT_SUCCESS,
  payload: {
    message
  }
})
