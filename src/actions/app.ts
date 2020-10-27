import * as types from '../constants/actionTypes'
import * as urls from '../constants/urls'
import { realCall, ActionWithPayload, ThunkResult } from 'js-fetch-api'
import { Action, ActionCreator } from 'redux'

export const cleanData: ActionCreator<Action> = (): Action => ({
  type: types.APP_CLEAN_DATA
})

export const getSaksbehandler: ActionCreator<ThunkResult<ActionWithPayload>> = (): ThunkResult<ActionWithPayload> => {
  return realCall({
    url: urls.API_SAKSBEHANDLER_URL,
    type: {
      request: types.APP_SAKSBEHANDLER_GET_REQUEST,
      success: types.APP_SAKSBEHANDLER_GET_SUCCESS,
      failure: types.APP_SAKSBEHANDLER_GET_FAILURE
    }
  })
}

export const getServerinfo: ActionCreator<ThunkResult<ActionWithPayload>> = (): ThunkResult<ActionWithPayload> => {
  return realCall({
    url: urls.API_SERVERINFO_URL,
    type: {
      request: types.APP_SERVERINFO_GET_REQUEST,
      success: types.APP_SERVERINFO_GET_SUCCESS,
      failure: types.APP_SERVERINFO_GET_FAILURE
    }
  })
}

export const getEnheter: ActionCreator<ThunkResult<ActionWithPayload>> = (): ThunkResult<ActionWithPayload> => {
  return realCall({
    url: urls.API_ENHETER_URL,
    type: {
      request: types.APP_ENHETER_GET_REQUEST,
      success: types.APP_ENHETER_GET_SUCCESS,
      failure: types.APP_ENHETER_GET_FAILURE
    }
  })
}

export const getUtgaarDato: ActionCreator<ThunkResult<ActionWithPayload>> = (): ThunkResult<ActionWithPayload> => {
  return realCall({
    url: urls.API_UTGAARDATO_URL,
    type: {
      request: types.APP_UTGAARDATO_GET_REQUEST,
      success: types.APP_UTGAARDATO_GET_SUCCESS,
      failure: types.APP_UTGAARDATO_GET_FAILURE
    }
  })
}

export const logMeAgain: ActionCreator<ThunkResult<ActionWithPayload>> = (): ThunkResult<ActionWithPayload> => {
  return realCall({
    url: urls.API_REAUTENTISERING_URL,
    type: {
      request: types.APP_LOGMEAGAIN_GET_REQUEST,
      success: types.APP_LOGMEAGAIN_GET_SUCCESS,
      failure: types.APP_LOGMEAGAIN_GET_FAILURE
    }
  })
}
