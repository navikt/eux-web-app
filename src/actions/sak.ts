import * as EKV from 'eessi-kodeverk'
import { ActionWithPayload, ThunkResult } from 'eessi-pensjon-ui/dist/declarations/types'
import { Action, ActionCreator } from 'redux'
import * as api from 'eessi-pensjon-ui/dist/api'
import * as types from 'constants/actionTypes'
import * as urls from 'constants/urls'
import { formatterDatoTilISO } from 'utils/dato'
const sprintf = require('sprintf-js').sprintf

export const getArbeidsforhold: ActionCreator<ThunkResult<ActionWithPayload>> = (fnr: string): ThunkResult<ActionWithPayload> => {
  return api.realCall({
    url: sprintf(urls.API_SAK_ARBEIDSFORHOLD_URL, { fnr: fnr }),
    type: {
      request: types.SAK_ARBEIDSFORHOLD_GET_REQUEST,
      success: types.SAK_ARBEIDSFORHOLD_GET_SUCCESS,
      failure: types.SAK_ARBEIDSFORHOLD_GET_FAILURE
    }
  })
}

export const getFagsaker: ActionCreator<ThunkResult<ActionWithPayload>> = (fnr: string, sektor: string, tema: string): ThunkResult<ActionWithPayload> => {
  return api.realCall({
    url: sprintf(urls.API_SAK_FAGSAKER_URL, { fnr: fnr, sektor: sektor, tema: tema }),
    type: {
      request: types.SAK_FAGSAKER_GET_REQUEST,
      success: types.SAK_FAGSAKER_GET_SUCCESS,
      failure: types.SAK_FAGSAKER_GET_FAILURE
    }
  })
}

export const getInstitusjoner: ActionCreator<ThunkResult<ActionWithPayload>> = (buctype: string, landkode: string): ThunkResult<ActionWithPayload> => {
  return api.realCall({
    url: sprintf(urls.API_SAK_INSTITUSJONER_URL, { buctype: buctype, landkode: landkode }),
    type: {
      request: types.SAK_INSTITUSJONER_GET_REQUEST,
      success: types.SAK_INSTITUSJONER_GET_SUCCESS,
      failure: types.SAK_INSTITUSJONER_GET_FAILURE
    }
  })
}

export const getKodeverk: ActionCreator<ThunkResult<ActionWithPayload>> = (): ThunkResult<ActionWithPayload> => {
  return api.realCall({
    url: urls.API_SAK_KODEVERK_URL,
    type: {
      request: types.SAK_KODEVERK_GET_REQUEST,
      success: types.SAK_KODEVERK_GET_SUCCESS,
      failure: types.SAK_KODEVERK_GET_FAILURE
    }
  })
}

export const getLandkoder: ActionCreator<ThunkResult<ActionWithPayload>> = (buctype: string): ThunkResult<ActionWithPayload> => {
  return api.realCall({
    url: sprintf(urls.API_SAK_LANDKODER_URL, { buctype: buctype }),
    type: {
      request: types.SAK_LANDKODER_GET_REQUEST,
      success: types.SAK_LANDKODER_GET_SUCCESS,
      failure: types.SAK_LANDKODER_GET_FAILURE
    }
  })
}

export const getPersoner: ActionCreator<ThunkResult<ActionWithPayload>> = (fnr: string): ThunkResult<ActionWithPayload> => {
  return api.realCall({
    url: sprintf(urls.API_SAK_PERSONER_URL, { fnr: fnr }),
    cascadeFailureError: true,
    type: {
      request: types.SAK_PERSONER_GET_REQUEST,
      success: types.SAK_PERSONER_GET_SUCCESS,
      failure: types.SAK_PERSONER_GET_FAILURE
    }
  })
}

export const getPersonerRelated: ActionCreator<ThunkResult<ActionWithPayload>> = (fnr: string): ThunkResult<ActionWithPayload> => {
  return api.realCall({
    url: sprintf(urls.API_SAK_PERSONER_URL, { fnr: fnr }),
    cascadeFailureError: true,
    context: {
      fnr: fnr
    },
    type: {
      request: types.SAK_PERSONER_RELATERT_GET_REQUEST,
      success: types.SAK_PERSONER_RELATERT_GET_SUCCESS,
      failure: types.SAK_PERSONER_RELATERT_GET_FAILURE
    }
  })
}

export const resetPersoner: ActionCreator<Action> = (): Action => ({
  type: types.SAK_PERSONER_RESET
})

export const createSak: ActionCreator<ThunkResult<ActionWithPayload>> = (data: any): ThunkResult<ActionWithPayload> => {
  const transformData = (data: any) => {
    if (data.tilleggsopplysninger.familierelasjoner.length > 0) {
      const {
        buctype, fnr, landKode, institusjonsID, sedtype, sektor, saksID,
        tilleggsopplysninger
      } = data
      const { arbeidsforhold } = tilleggsopplysninger
      const familierelasjoner = tilleggsopplysninger.familierelasjoner.map((relasjon: any) => ({
        ...relasjon,
        fdato: relasjon.fdato.indexOf('-') > 0 ? relasjon.fdato : formatterDatoTilISO(relasjon.fdato)
      }))
      return {
        buctype,
        fnr,
        landKode,
        institusjonsID,
        sedtype,
        sektor,
        saksID,
        tilleggsopplysninger: {
          familierelasjoner,
          arbeidsforhold
        }
      }
    }
    return data
  }
  const payload = transformData(data)

  return api.realCall({
    url: urls.API_SAK_SEND_POST_URL,
    method: 'POST',
    payload: payload,
    type: {
      request: types.SAK_SEND_POST_REQUEST,
      success: types.SAK_SEND_POST_SUCCESS,
      failure: types.SAK_SEND_POST_FAILURE
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
  type: types.SAK_PRELOAD,
  payload: {
    ...EKV.KTObjects,
    kodemaps: {
      ...EKV.Kodemaps
    }
  } // kodemaps: { BUC2SEDS, SEKTOR2FAGSAK, SEKTOR2BUC }
})
