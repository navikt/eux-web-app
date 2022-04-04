import * as types from 'constants/actionTypes'
import * as urls from 'constants/urls'
import { ParamPayload } from 'declarations/app'
import { Enheter, LogMeAgainPayload, Saksbehandler, ServerInfo, UtgaarDatoPayload } from 'declarations/types'
import EKV from '@navikt/eessi-kodeverk'
import { ActionWithPayload, call } from '@navikt/fetch'
import mockEnhet from 'mocks/app/enhet'
import mockReautorisering from 'mocks/app/reautorisering'
import mockSaksbehandler from 'mocks/app/saksbehandler'
import mockServerInfo from 'mocks/app/serverinfo'
import mockUtgaarDato from 'mocks/app/utgaarDato'
import { Action, ActionCreator } from 'redux'

export const cleanData: ActionCreator<Action> = (): Action => ({
  type: types.APP_CLEAN
})

export const copyToClipboard = (text: string) => ({
  type: types.APP_CLIPBOARD_COPY,
  payload: text
})

export const getEnheter = (): Promise<ActionWithPayload<Enheter>> => {
  return call({
    url: urls.API_ENHETER_URL,
    expectedPayload: mockEnhet,
    type: {
      request: types.APP_ENHETER_GET_REQUEST,
      success: types.APP_ENHETER_GET_SUCCESS,
      failure: types.APP_ENHETER_GET_FAILURE
    }
  })
}

export const getSaksbehandler = (): Promise<ActionWithPayload<Saksbehandler>> => {
  return call({
    url: urls.API_SAKSBEHANDLER_URL,
    expectedPayload: mockSaksbehandler(),
    type: {
      request: types.APP_SAKSBEHANDLER_GET_REQUEST,
      success: types.APP_SAKSBEHANDLER_GET_SUCCESS,
      failure: types.APP_SAKSBEHANDLER_GET_FAILURE
    }
  })
}

export const getServerinfo = (): Promise<ActionWithPayload<ServerInfo>> => {
  return call({
    url: urls.API_SERVERINFO_URL,
    expectedPayload: mockServerInfo(),
    type: {
      request: types.APP_SERVERINFO_GET_REQUEST,
      success: types.APP_SERVERINFO_GET_SUCCESS,
      failure: types.APP_SERVERINFO_GET_FAILURE
    }
  })
}

export const getUtgaarDato = (): Promise<ActionWithPayload<UtgaarDatoPayload>> => {
  return call({
    url: urls.API_UTGAARDATO_URL,
    expectedPayload: mockUtgaarDato,
    type: {
      request: types.APP_UTGAARDATO_GET_REQUEST,
      success: types.APP_UTGAARDATO_GET_SUCCESS,
      failure: types.APP_UTGAARDATO_GET_FAILURE
    }
  })
}

export const logMeAgain = (name ?: string): Promise<ActionWithPayload<LogMeAgainPayload>> => {
  // origin: http://{host:port} pathname: /pdu1, no hash
  let redirectUrl = (window.location as any).origin + (window.location as any).pathname
  if (name) {
    redirectUrl += '?name=' + name
  }

  return call({
    url: urls.API_REAUTENTISERING_URL,
    expectedPayload: mockReautorisering,
    context: {
      redirectUrl
    },
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
export const preload: ActionCreator<ActionWithPayload<any>> = (
): ActionWithPayload<any> => ({
  type: types.APP_PRELOAD,
  payload: {
    ...(EKV as any).KTObjects,
    kodemaps: {
      ...(EKV as any).Kodemaps
    }
  } // kodemaps: { BUC2SEDS, SEKTOR2FAGSAK, SEKTOR2BUC }
})

export const reduceSessionTime: ActionCreator<ActionWithPayload> = (): ActionWithPayload => ({
  type: types.APP_SESSION_SET,
  payload: {
    minutes: 6
  }
})

export const setStatusParam: ActionCreator<ActionWithPayload<ParamPayload>> = (
  key: string,
  value: any
): ActionWithPayload<ParamPayload> => ({
  type: types.APP_PARAM_SET,
  payload: {
    key: key,
    value: value
  } as ParamPayload
})
