
import { realCall, ActionWithPayload, ThunkResult } from 'js-fetch-api'
import moment from 'moment'
import { Action, ActionCreator } from 'redux'
import * as types from '../constants/actionTypes'
import * as urls from '../constants/urls'
const sprintf = require('sprintf-js').sprintf

export const getArbeidsforhold: ActionCreator<ThunkResult<ActionWithPayload>> = (fnr: string): ThunkResult<ActionWithPayload> => {
  return realCall({
    url: sprintf(urls.API_SAK_ARBEIDSFORHOLD_URL, { fnr: fnr }),
    type: {
      request: types.SAK_ARBEIDSFORHOLD_GET_REQUEST,
      success: types.SAK_ARBEIDSFORHOLD_GET_SUCCESS,
      failure: types.SAK_ARBEIDSFORHOLD_GET_FAILURE
    }
  })
}

export const getFagsaker: ActionCreator<ThunkResult<ActionWithPayload>> = (fnr: string, sektor: string, tema: string): ThunkResult<ActionWithPayload> => {
  return realCall({
    url: sprintf(urls.API_SAK_FAGSAKER_URL, { fnr: fnr, sektor: sektor, tema: tema }),
    type: {
      request: types.SAK_FAGSAKER_GET_REQUEST,
      success: types.SAK_FAGSAKER_GET_SUCCESS,
      failure: types.SAK_FAGSAKER_GET_FAILURE
    }
  })
}

export const getInstitusjoner: ActionCreator<ThunkResult<ActionWithPayload>> = (buctype: string, landkode: string): ThunkResult<ActionWithPayload> => {
  return realCall({
    url: sprintf(urls.API_SAK_INSTITUSJONER_URL, { buctype: buctype, landkode: landkode }),
    type: {
      request: types.SAK_INSTITUSJONER_GET_REQUEST,
      success: types.SAK_INSTITUSJONER_GET_SUCCESS,
      failure: types.SAK_INSTITUSJONER_GET_FAILURE
    }
  })
}

export const getLandkoder: ActionCreator<ThunkResult<ActionWithPayload>> = (buctype: string): ThunkResult<ActionWithPayload> => {
  return realCall({
    url: sprintf(urls.API_SAK_LANDKODER_URL, { buctype: buctype }),
    type: {
      request: types.SAK_LANDKODER_GET_REQUEST,
      success: types.SAK_LANDKODER_GET_SUCCESS,
      failure: types.SAK_LANDKODER_GET_FAILURE
    }
  })
}

export const getPerson: ActionCreator<ThunkResult<ActionWithPayload>> = (fnr: string): ThunkResult<ActionWithPayload> => {
  return realCall({
    url: sprintf(urls.API_SAK_PERSON_URL, { fnr: fnr }),
    cascadeFailureError: true,
    type: {
      request: types.SAK_PERSON_GET_REQUEST,
      success: types.SAK_PERSON_GET_SUCCESS,
      failure: types.SAK_PERSON_GET_FAILURE
    }
  })
}

export const getPersonRelated: ActionCreator<ThunkResult<ActionWithPayload>> = (fnr: string): ThunkResult<ActionWithPayload> => {
  return realCall({
    url: sprintf(urls.API_SAK_PERSON_URL, { fnr: fnr }),
    cascadeFailureError: true,
    context: {
      fnr: fnr
    },
    type: {
      request: types.SAK_PERSON_RELATERT_GET_REQUEST,
      success: types.SAK_PERSON_RELATERT_GET_SUCCESS,
      failure: types.SAK_PERSON_RELATERT_GET_FAILURE
    }
  })
}

export const resetPerson: ActionCreator<Action> = (): Action => ({
  type: types.SAK_PERSON_RESET
})

export const resetFagsaker: ActionCreator<Action> = (): Action => ({
  type: types.SAK_FAGSAKER_RESET
})

export const resetPersonRelatert: ActionCreator<Action> = (): Action => ({
  type: types.SAK_PERSON_RELATERT_RESET
})

export const createSak: ActionCreator<ThunkResult<ActionWithPayload>> = (data: any): ThunkResult<ActionWithPayload> => {
  const payload = {
    buctype: data.buctype,
    fnr: data.fnr,
    landKode: data.landKode,
    institusjonsID: data.institusjonsID,
    saksID: data.saksID,
    sedtype: data.sedtype,
    sektor: data.sektor,
    tilleggsopplysninger: {
      arbeidsforhold: [],
      familierelasjoner: []
    } as any
  } as any
  if (data.enhet) {
    payload.enhet = data.enhet
  }
  if (data.arbeidsforhold.length > 0) {
    payload.tilleggsopplysninger.arbeidsforhold = data.arbeidsforhold
  }
  if (data.familierelasjoner.length > 0) {
    payload.tilleggsopplysninger.familierelasjoner = data.familierelasjoner.map((relasjon: any) => ({
      ...relasjon,
      fdato: relasjon.fdato.indexOf('-') > 0
        ? relasjon.fdato
        : moment(relasjon.fdato, ['DD.MM.YYYY HH:mm', 'DD.MM.YYYY']).format('YYYY-MM-DD')
    }))
  }

  return realCall({
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

