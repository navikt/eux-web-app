import {
  Arbeidsforhold,
  Arbeidsforholdet,
  FagSaker,
  FamilieRelasjon,
  Institusjoner,
  Kodeverk, Person
} from 'declarations/types'
import { ActionWithPayload, realCall, ThunkResult } from 'js-fetch-api'
import moment from 'moment'
import { Action, ActionCreator } from 'redux'
import * as types from 'constants/actionTypes'
import * as urls from 'constants/urls'

const sprintf = require('sprintf-js').sprintf

export const sakCleanData: ActionCreator<Action> = (): Action => ({
  type: types.SAK_CLEAN_DATA
})

export const addArbeidsforhold: ActionCreator<ActionWithPayload<Arbeidsforholdet>> = (
  payload: Arbeidsforholdet
): ActionWithPayload<Arbeidsforholdet> => ({
  type: types.SAK_ARBEIDSFORHOLD_ADD,
  payload: payload
})

export const addFamilierelasjoner: ActionCreator<ActionWithPayload<FamilieRelasjon>> = (
  payload: FamilieRelasjon
): ActionWithPayload<FamilieRelasjon> => ({
  type: types.SAK_FAMILIERELASJONER_ADD,
  payload: payload
})

export const createSak: ActionCreator<ThunkResult<ActionWithPayload<any>>> = (
  data: any
): ThunkResult<ActionWithPayload<any>> => {
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
  if (data.arbeidsforhold && data.arbeidsforhold.length > 0) {
    payload.tilleggsopplysninger.arbeidsforhold = data.arbeidsforhold
  }
  if (data.familierelasjoner && data.familierelasjoner.length > 0) {
    payload.tilleggsopplysninger.familierelasjoner = data.familierelasjoner.map((relasjon: any) => ({
      ...relasjon,
      fdato: relasjon.fdato.indexOf('-') > 0
        ? relasjon.fdato
        : moment(relasjon.fdato, ['DD.MM.YYYY HH:mm', 'DD.MM.YYYY']).format('YYYY-MM-DD')
    }))
  }

  return realCall({
    url: urls.API_SAK_SEND_URL,
    method: 'POST',
    payload: payload,
    type: {
      request: types.SAK_SEND_REQUEST,
      success: types.SAK_SEND_SUCCESS,
      failure: types.SAK_SEND_FAILURE
    }
  })
}

export const getArbeidsforholdList: ActionCreator<ThunkResult<ActionWithPayload<Arbeidsforhold>>> = (
  fnr: string
): ThunkResult<ActionWithPayload<Arbeidsforhold>> => {
  return realCall({
    url: sprintf(urls.API_SAK_ARBEIDSFORHOLD_URL, { fnr: fnr }),
    type: {
      request: types.SAK_ARBEIDSFORHOLDLIST_GET_REQUEST,
      success: types.SAK_ARBEIDSFORHOLDLIST_GET_SUCCESS,
      failure: types.SAK_ARBEIDSFORHOLDLIST_GET_FAILURE
    }
  })
}

export const getFagsaker: ActionCreator<ThunkResult<ActionWithPayload<FagSaker>>> = (
  fnr: string, sektor: string, tema: string
): ThunkResult<ActionWithPayload<FagSaker>> => {
  return realCall({
    url: sprintf(urls.API_SAK_FAGSAKER_URL, { fnr: fnr, sektor: sektor, tema: tema }),
    type: {
      request: types.SAK_FAGSAKER_GET_REQUEST,
      success: types.SAK_FAGSAKER_GET_SUCCESS,
      failure: types.SAK_FAGSAKER_GET_FAILURE
    }
  })
}

export const getInstitusjoner: ActionCreator<ThunkResult<ActionWithPayload<Institusjoner>>> = (
  buctype: string, landkode: string
): ThunkResult<ActionWithPayload<Institusjoner>> => {
  return realCall({
    url: sprintf(urls.API_SAK_INSTITUSJONER_URL, { buctype: buctype, landkode: landkode }),
    type: {
      request: types.SAK_INSTITUSJONER_GET_REQUEST,
      success: types.SAK_INSTITUSJONER_GET_SUCCESS,
      failure: types.SAK_INSTITUSJONER_GET_FAILURE
    }
  })
}

export const getLandkoder: ActionCreator<ThunkResult<ActionWithPayload<Array<Kodeverk>>>> = (
  buctype: string
): ThunkResult<ActionWithPayload<Array<Kodeverk>>> => {
  return realCall({
    url: sprintf(urls.API_SAK_LANDKODER_URL, { buctype: buctype }),
    type: {
      request: types.SAK_LANDKODER_GET_REQUEST,
      success: types.SAK_LANDKODER_GET_SUCCESS,
      failure: types.SAK_LANDKODER_GET_FAILURE
    }
  })
}

export const getPerson: ActionCreator<ThunkResult<ActionWithPayload<Person>>> = (
  fnr: string
): ThunkResult<ActionWithPayload<Person>> => {
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

export const getPersonRelated: ActionCreator<ThunkResult<ActionWithPayload<Person>>> = (
  fnr: string
): ThunkResult<ActionWithPayload<Person>> => {
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

export const removeArbeidsforhold: ActionCreator<ActionWithPayload<Arbeidsforholdet>> = (
  payload: Arbeidsforholdet
): ActionWithPayload<Arbeidsforholdet> => ({
  type: types.SAK_ARBEIDSFORHOLD_REMOVE,
  payload: payload
})

export const removeFamilierelasjoner: ActionCreator<ActionWithPayload<FamilieRelasjon>> = (
  payload: FamilieRelasjon
): ActionWithPayload<FamilieRelasjon> => ({
  type: types.SAK_FAMILIERELASJONER_REMOVE,
  payload: payload
})

export const resetPerson: ActionCreator<Action> = (): Action => ({
  type: types.SAK_PERSON_RESET
})

export const resetFagsaker: ActionCreator<Action> = (): Action => ({
  type: types.SAK_FAGSAKER_RESET
})

export const resetPersonRelatert: ActionCreator<Action> = (): Action => ({
  type: types.SAK_PERSON_RELATERT_RESET
})

export const setProperty = (key: string, value: string | undefined) => ({
  type: types.SAK_PROPERTY_SET,
  payload: {
    key: key,
    value: value
  }
})
