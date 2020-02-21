import * as types from 'constants/actionTypes'
import * as urls from 'constants/urls'
import * as api from 'eessi-pensjon-ui/dist/api'
import { ActionWithPayload, ThunkResult } from 'eessi-pensjon-ui/dist/declarations/types'
import { ActionCreator } from 'redux'

export const getSaksbehandler: ActionCreator<ThunkResult<ActionWithPayload>> = (): ThunkResult<ActionWithPayload> => {
  return api.realCall({
    url: urls.API_SAKSBEHANDLER_URL,
    type: {
      request: types.APP_SAKSBEHANDLER_GET_REQUEST,
      success: types.APP_SAKSBEHANDLER_GET_SUCCESS,
      failure: types.APP_SAKSBEHANDLER_GET_FAILURE
    }
  })
}

export const getServerinfo: ActionCreator<ThunkResult<ActionWithPayload>> = (): ThunkResult<ActionWithPayload> => {
  return api.realCall({
    url: urls.API_SERVERINFO_URL,
    type: {
      request: types.APP_SERVERINFO_GET_REQUEST,
      success: types.APP_SERVERINFO_GET_SUCCESS,
      failure: types.APP_SERVERINFO_GET_FAILURE
    }
  })
}
