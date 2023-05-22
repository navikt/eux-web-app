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

export const copyToClipboard = (text?: string) => ({
  type: types.APP_CLIPBOARD_COPY,
  payload: text
})

export const getEnheter = (): ActionWithPayload<Enheter> => {
  return call({
    url: urls.API_ENHETER_URL,
    expectedPayload: mockEnhet,
    type: {
      request: types.APP_ENHETER_REQUEST,
      success: types.APP_ENHETER_SUCCESS,
      failure: types.APP_ENHETER_FAILURE
    }
  })
}

export const logMeAgain = (name ?: string): ActionWithPayload<LogMeAgainPayload> => {
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

export const setStatusParam: ActionCreator<ActionWithPayload<ParamPayload>> = (
  key: string,
  value: any
): ActionWithPayload<ParamPayload> => ({
  type: types.APP_PARAM_SET,
  payload: {
    key,
    value
  } as ParamPayload
})

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

export const appReset: ActionCreator<Action> = (): Action => ({
  type: types.APP_RESET
})

export const getSaksbehandler = (): ActionWithPayload<Saksbehandler> => {
  return call({
    url: urls.API_SAKSBEHANDLER_URL,
    expectedPayload: mockSaksbehandler(),
    type: {
      request: types.APP_SAKSBEHANDLER_REQUEST,
      success: types.APP_SAKSBEHANDLER_SUCCESS,
      failure: types.APP_SAKSBEHANDLER_FAILURE
    }
  })
}

export const getServerinfo = (): ActionWithPayload<ServerInfo> => {
  return call({
    url: urls.API_SERVERINFO_URL,
    expectedPayload: mockServerInfo(),
    type: {
      request: types.APP_SERVERINFO_REQUEST,
      success: types.APP_SERVERINFO_SUCCESS,
      failure: types.APP_SERVERINFO_FAILURE
    }
  })
}

export const getUtgaarDato = (): ActionWithPayload<UtgaarDatoPayload> => {
  return call({
    url: urls.API_UTGAARDATO_URL,
    expectedPayload: mockUtgaarDato,
    type: {
      request: types.APP_UTGAARDATO_REQUEST,
      success: types.APP_UTGAARDATO_SUCCESS,
      failure: types.APP_UTGAARDATO_FAILURE
    }
  })
}

export const reduceSessionTime: ActionCreator<ActionWithPayload> = (): ActionWithPayload => ({
  type: types.APP_SESSION_SET,
  payload: {
    minutes: 6
  }
})
