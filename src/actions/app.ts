import * as types from 'constants/actionTypes'
import * as urls from 'constants/urls'
import { ParamPayload } from 'declarations/app'
import {Enhet, Enheter, LogMeAgainPayload, Saksbehandler, ServerInfo} from 'declarations/types'
import EKV from '@navikt/eessi-kodeverk'
import { ActionWithPayload, call } from '@navikt/fetch'
import mockEnhet from 'mocks/app/enhet'
import mockReautorisering from 'mocks/app/reautorisering'
import mockSaksbehandler from 'mocks/app/saksbehandler'
import mockServerInfo from 'mocks/app/serverinfo'
import mockUtgaarDato from 'mocks/app/utgaarDato'
import mockCountryCodes from 'mocks/app/countryCodes'
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

export const setSelectedEnhet = (enhet: Enhet) => ({
  type: types.APP_SELECTED_ENHET_SET,
  payload: enhet
})

export const setFavouriteEnhet = (enhet: Enhet | undefined | null): ActionWithPayload => {
  return call({
    url: urls.API_FAVORITTENHET_URL,
    expectedPayload: {favorittEnhetNr: enhet ? '123' : undefined},
    method: "PUT",
    context: {
      enhet: enhet ? enhet : undefined
    },
    body: {
      favorittEnhetNr: enhet ? enhet.enhetNr : ""
    },
    type: {
      request: types.APP_FAVORITTENHET_REQUEST,
      success: types.APP_FAVORITTENHET_SUCCESS,
      failure: types.APP_FAVORITTENHET_FAILURE
    }
  })
}

function utlogging()  {
  fetch(urls.API_UTLOGGING_URL,  {
    method: "GET"
  }).catch((error) => {
    console.error('Failed to log out:', error);
  });
}

export const logMeAgain = (name ?: string): ActionWithPayload<LogMeAgainPayload> => {
  utlogging()
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

export const getCDMVersjon = (): Action => {
  return call({
    url: urls.API_CDMVERSJON_RINA_URL,
    cascadeFailureError: true,
    expectedPayload: "4.4",
    type: {
      request: types.APP_CDMVERSJON_REQUEST,
      success: types.APP_CDMVERSJON_SUCCESS,
      failure: types.APP_CDMVERSJON_FAILURE,
    }
  })
}


export const getCountryCodes = (): Action => {
  return call({
    url: urls.API_LANDKODER_RINA_URL,
    cascadeFailureError: true,
    expectedPayload: mockCountryCodes,
    type: {
      request: types.APP_COUNTRYCODES_REQUEST,
      success: types.APP_COUNTRYCODES_SUCCESS,
      failure: types.APP_COUNTRYCODES_FAILURE,
    }
  })
}

export const getUtgaarDato = (): ActionWithPayload<any> => {
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

export const resetLoginRedirect: ActionCreator<Action> = (): Action => ({
  type: types.APP_LOGINREDIRECT_RESET
})

export const setExpirationTime: ActionCreator<ActionWithPayload> = (expirationTime: number): ActionWithPayload => ({
  type: types.APP_EXPIRATION_TIME_SET,
  payload: expirationTime
})

export const setSessionEndsAt: ActionCreator<ActionWithPayload> = (sessionEndsAt: number): ActionWithPayload => ({
  type: types.APP_SESSIONEXPIRATION_SET,
  payload: sessionEndsAt
})
