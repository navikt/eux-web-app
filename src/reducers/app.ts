import * as types from 'constants/actionTypes'
import { Enheter, Saksbehandler, ServerInfo } from 'declarations/types'
import { ActionWithPayload } from 'js-fetch-api'

export interface AppState {
  saksbehandler: Saksbehandler | undefined;
  serverinfo: ServerInfo | undefined;
  enheter: Enheter | undefined;
  expirationTime: Date | undefined;
}

export const initialAppState: AppState = {
  saksbehandler: undefined,
  serverinfo: undefined,
  enheter: undefined,
  expirationTime: undefined
}

const appReducer = (state: AppState = initialAppState, action: ActionWithPayload) => {
  switch (action.type) {
    case types.APP_SAKSBEHANDLER_GET_SUCCESS:
      try {
        (window as any).frontendlogger.info(action.payload)
      } catch (e) {}
      return {
        ...state,
        saksbehandler: action.payload
      }

    case types.APP_SERVERINFO_GET_SUCCESS:
      return {
        ...state,
        serverinfo: action.payload
      }

    case types.APP_ENHETER_GET_SUCCESS:
      return {
        ...state,
        enheter: action.payload
      }

    case types.APP_UTGAARDATO_GET_SUCCESS: {
      const now = action.payload.naa ? new Date(action.payload.naa) : new Date()
      const expirationTime = action.payload.utgaarDato
        ? new Date(action.payload.utgaarDato)
        : new Date(new Date().setMinutes(now.getMinutes() + 60))
      return {
        ...state,
        expirationTime: expirationTime
      }
    }

    default:
      return state
  }
}

export default appReducer
