import * as types from 'constants/actionTypes'
import { Enheter, Saksbehandler, ServerInfo } from 'declarations/types'
import { ActionWithPayload } from 'eessi-pensjon-ui/dist/declarations/types'

export interface AppState {
  saksbehandler: Saksbehandler | undefined;
  serverinfo: ServerInfo | undefined;
  enheter: Enheter | undefined;
}

export const initialAppState: AppState = {
  saksbehandler: undefined,
  serverinfo: undefined,
  enheter: undefined
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

    default:
      return state
  }
}

export default appReducer
