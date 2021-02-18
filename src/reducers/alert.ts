import * as types from 'constants/actionTypes'
import { ActionWithPayload } from 'js-fetch-api'
import _ from 'lodash'
import { Action } from 'redux'

export interface AlertState {
  clientErrorStatus: string | undefined;
  clientErrorMessage: string | undefined;
  serverErrorMessage: string | undefined;
  uuid: string | undefined;
  error: any | undefined;
  type: string | undefined;
}

export const initialAlertState: AlertState = {
  clientErrorStatus: undefined,
  clientErrorMessage: undefined,
  serverErrorMessage: undefined,
  uuid: undefined,
  error: undefined,
  type: undefined
}

const alertReducer = (state: AlertState = initialAlertState, action: Action | ActionWithPayload = { type: '' }) => {
  let clientErrorMessage: string | undefined, serverErrorMessage: string, clientErrorStatus: string

  if (
    action.type === types.ALERT_CLIENT_CLEAR ||
    action.type === types.APP_CLEAN_DATA ||
    action.type === types.SAK_PERSON_RELATERT_RESET ||
    action.type === types.SAK_PERSON_GET_REQUEST ||
    action.type === types.SAK_PERSON_RELATERT_GET_REQUEST ||
    action.type === types.SAK_ABROADPERSON_ADD_SUCCESS ||
    action.type === types.SAK_TPSPERSON_ADD_SUCCESS) {
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

      default:
        serverErrorMessage = (action as ActionWithPayload).payload.message || 'ui:serverInternalError'
        break
    }

    return {
      ...state,
      type: action.type,
      serverErrorMessage: serverErrorMessage,
      error: (action as ActionWithPayload).payload ? (action as ActionWithPayload).payload.error : undefined,
      uuid: (action as ActionWithPayload).payload ? (action as ActionWithPayload).payload.uuid : undefined
    }
  }

  if (_.endsWith(action.type, '/FAILURE')) {
    clientErrorStatus = 'ERROR'

    switch (action.type) {
      case types.SAK_PERSON_GET_FAILURE:
        clientErrorMessage = 'ui:error-person-notFound'
        break

      case types.SAK_PERSON_RELATERT_GET_FAILURE:
        clientErrorMessage = 'ui:error-personRelated-notFound'
        break

      case types.SAK_ABROADPERSON_ADD_FAILURE:
        clientErrorMessage = 'ui:error-abroadperson-exists'
        break

      case types.SAK_TPSPERSON_ADD_FAILURE:
        clientErrorMessage = 'ui:error-tpsperson-exists'
        break

      case types.SVARPASED_SENDSVARPASEDDATA_POST_FAILURE:
        clientErrorMessage = 'ui:error-svarPaSed-failure'
        break

      default:
        if (action.payload && action.payload.error) {
          clientErrorMessage = action.payload.error
        } else {
          clientErrorMessage = 'ui:error'
        }
        break
    }

    return {
      ...state,
      type: action.type,
      clientErrorStatus: clientErrorMessage ? clientErrorStatus : undefined,
      clientErrorMessage: clientErrorMessage,
      error: (action as ActionWithPayload).payload ? (action as ActionWithPayload).payload.error : undefined,
      uuid: (action as ActionWithPayload).payload ? (action as ActionWithPayload).payload.uuid : undefined
    }
  }

  if (!clientErrorMessage) {
    return state
  }

  return {
    ...state,
    type: action.type,
    clientErrorStatus: 'OK',
    clientErrorMessage: clientErrorMessage,
    uuid: undefined,
    error: undefined
  }
}

export default alertReducer
