import * as types from 'constants/actionTypes'
import * as urls from 'constants/urls'
import { Enheter, LogMeAgainPayload, Saksbehandler, ServerInfo, UtgaarDatoPayload } from 'declarations/types'
import EKV from 'eessi-kodeverk'
import { ActionWithPayload, realCall, ThunkResult } from 'js-fetch-api'
import { Action, ActionCreator } from 'redux'

export const cleanData: ActionCreator<Action> = (): Action => ({
  type: types.APP_CLEAN_DATA
})

export const getEnheter: ActionCreator<ThunkResult<ActionWithPayload<Enheter>>> = (
): ThunkResult<ActionWithPayload<Enheter>> => {
  return realCall({
    url: urls.API_ENHETER_URL,
    type: {
      request: types.APP_ENHETER_GET_REQUEST,
      success: types.APP_ENHETER_GET_SUCCESS,
      failure: types.APP_ENHETER_GET_FAILURE
    }
  })
}

export const getSaksbehandler: ActionCreator<ThunkResult<ActionWithPayload<Saksbehandler>>> = (
): ThunkResult<ActionWithPayload<Saksbehandler>> => {
  return realCall({
    url: urls.API_SAKSBEHANDLER_URL,
    type: {
      request: types.APP_SAKSBEHANDLER_GET_REQUEST,
      success: types.APP_SAKSBEHANDLER_GET_SUCCESS,
      failure: types.APP_SAKSBEHANDLER_GET_FAILURE
    }
  })
}

export const getServerinfo: ActionCreator<ThunkResult<ActionWithPayload<ServerInfo>>> = (
): ThunkResult<ActionWithPayload<ServerInfo>> => {
  return realCall({
    url: urls.API_SERVERINFO_URL,
    type: {
      request: types.APP_SERVERINFO_GET_REQUEST,
      success: types.APP_SERVERINFO_GET_SUCCESS,
      failure: types.APP_SERVERINFO_GET_FAILURE
    }
  })
}

export const getUtgaarDato: ActionCreator<ThunkResult<ActionWithPayload<UtgaarDatoPayload>>> = (
): ThunkResult<ActionWithPayload<UtgaarDatoPayload>> => {
  return realCall({
    url: urls.API_UTGAARDATO_URL,
    type: {
      request: types.APP_UTGAARDATO_GET_REQUEST,
      success: types.APP_UTGAARDATO_GET_SUCCESS,
      failure: types.APP_UTGAARDATO_GET_FAILURE
    }
  })
}

export const logMeAgain: ActionCreator<ThunkResult<ActionWithPayload<LogMeAgainPayload>>> = (
): ThunkResult<ActionWithPayload<LogMeAgainPayload>> => {
  return realCall({
    url: urls.API_REAUTENTISERING_URL,
    type: {
      request: types.APP_LOGMEAGAIN_REQUEST,
      success: types.APP_LOGMEAGAIN_SUCCESS,
      failure: types.APP_LOGMEAGAIN_FAILURE
    }
  })
}

/*
KTObjects: {
  buctyper: buctyper,
  familierelasjoner: familierelasjoner,
  kjoenn: kjoenn,
  landkoder: landkoder,
  sektor: sektor,
  sedtyper: sedtyper,
  tema: tema
};
*/
export const preload = () => ({
  type: types.APP_PRELOAD,
  payload: {
    ...EKV.KTObjects,
    kodemaps: {
      ...EKV.Kodemaps
    }
  } // kodemaps: { BUC2SEDS, SEKTOR2FAGSAK, SEKTOR2BUC }
})
