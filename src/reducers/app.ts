import * as types from 'constants/actionTypes'
import { Saksbehandler, ServerInfo } from 'declarations/types'
import { ActionWithPayload } from 'eessi-pensjon-ui/dist/declarations/types'

export interface AppState {
  saksbehandler: Saksbehandler | undefined;
  serverinfo: ServerInfo | undefined;
}

export const initialAppState: AppState = {
  saksbehandler: undefined,
  serverinfo: undefined
}

const appReducer = (state: AppState = initialAppState, action: ActionWithPayload) => {
  switch (action.type) {
    case types.APP_SAKSBEHANDLER_GET_SUCCESS:
      return {
        ...state,
        saksbehandler: action.payload
      }

    case types.APP_SERVERINFO_GET_SUCCESS:
      return {
        ...state,
        serverinfo: action.payload
      }

    default:
      return state
  }
}

export default appReducer

