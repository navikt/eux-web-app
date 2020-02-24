import * as types from 'constants/actionTypes'
import { ActionWithPayload } from 'eessi-pensjon-ui/dist/declarations/types'
import _ from 'lodash'
import { Action } from 'redux'

export interface AlertState {
  clientErrorStatus: string | undefined;
  clientErrorMessage: string | undefined;
  serverErrorMessage: string | undefined;
  uuid: string | undefined;
  error: any |undefined;
}

export const initialAlertState: AlertState = {
  clientErrorStatus: undefined,
  clientErrorMessage: undefined,
  serverErrorMessage: undefined,
  uuid: undefined,
  error: undefined
}

const alertReducer = (state: AlertState = initialAlertState, action: Action | ActionWithPayload) => {
  let clientErrorMessage: string | undefined, serverErrorMessage: string, clientErrorStatus: string

  if (action.type === types.ALERT_CLIENT_CLEAR) {
    return initialAlertState
  }

  if (action.type === types.SAK_PERSONER_GET_REQUEST) {
    return initialAlertState
  }

  if (_.endsWith(action.type, '/ERROR')) {
    switch (action.type) {
      case types.SERVER_INTERNAL_ERROR:
        serverErrorMessage = 'ui:serverInternalError'
        break

      case types.SERVER_UNAUTHORIZED_ERROR:
        serverErrorMessage = 'ui:serverAuthenticationError'
        break

      case types.APP_CLEAN_DATA:
        return initialAlertState

      default:
        serverErrorMessage = (action as ActionWithPayload).payload.message || 'ui:serverInternalError'
        break
    }

    return {
      ...state,
      serverErrorMessage: serverErrorMessage,
      error: (action as ActionWithPayload).payload ? (action as ActionWithPayload).payload.error : undefined,
      uuid: (action as ActionWithPayload).payload ? (action as ActionWithPayload).payload.uuid : undefined
    }
  }

  if (_.endsWith(action.type, '/FAILURE')) {
    clientErrorStatus = 'ERROR'

    switch (action.type) {

      case types.SAK_PERSONER_GET_FAILURE:
        clientErrorMessage = 'ui:validation-invalidFnr'
        break

      default:

        clientErrorMessage = 'ui:error'
        break
    }

    return {
      ...state,
      clientErrorStatus: clientErrorMessage ? clientErrorStatus : undefined,
      clientErrorMessage: clientErrorMessage,
      error: (action as ActionWithPayload).payload ? (action as ActionWithPayload).payload.error : undefined,
      uuid: (action as ActionWithPayload).payload ? (action as ActionWithPayload).payload.uuid : undefined
    }
  }

  switch (action.type) {
    default:
      break
  }

  if (!clientErrorMessage) {
    return state
  }

  return {
    ...state,
    clientErrorStatus: 'OK',
    clientErrorMessage: clientErrorMessage,
    uuid: undefined,
    error: undefined
  }
}

export default alertReducer
