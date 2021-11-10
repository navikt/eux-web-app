import {
  Arbeidsgiver,
  FagSaker,
  OldFamilieRelasjon,
  Institusjoner,
  Kodeverk,
  Person
} from 'declarations/types'
import { ActionWithPayload, call, ThunkResult } from 'js-fetch-api'
import mockSendSak from 'mocks/sak/sendSak'
import mockFagsakerList from 'mocks/fagsakerList'
import { mockInstitusjon, mockLandkode } from 'mocks/institutionList'
import mockPerson from 'mocks/person'
import moment from 'moment'
import { Action, ActionCreator } from 'redux'
import * as types from 'constants/actionTypes'
import * as urls from 'constants/urls'

const sprintf = require('sprintf-js').sprintf

export const addArbeidsgiver: ActionCreator<ActionWithPayload<Arbeidsgiver>> = (
  payload: Arbeidsgiver
): ActionWithPayload<Arbeidsgiver> => ({
  type: types.SAK_ARBEIDSGIVER_ADD,
  payload: payload
})

export const addFamilierelasjoner: ActionCreator<ActionWithPayload<OldFamilieRelasjon>> = (
  payload: OldFamilieRelasjon
): ActionWithPayload<OldFamilieRelasjon> => ({
  type: types.SAK_FAMILIERELASJONER_ADD,
  payload: payload
})

export const cleanData: ActionCreator<Action> = (): Action => ({
  type: types.SAK_CLEAN_DATA
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
  if (data.arbeidsgivere && data.arbeidsgivere.length > 0) {
    payload.tilleggsopplysninger.arbeidsforhold = data.arbeidsgivere
  }
  if (data.familierelasjoner && data.familierelasjoner.length > 0) {
    payload.tilleggsopplysninger.familierelasjoner = data.familierelasjoner.map((relasjon: any) => ({
      ...relasjon,
      fdato: relasjon.fdato.indexOf('-') > 0
        ? relasjon.fdato
        : moment(relasjon.fdato, ['DD.MM.YYYY HH:mm', 'DD.MM.YYYY']).format('YYYY-MM-DD')
    }))
  }

  return call({
    url: urls.API_SAK_SEND_URL,
    method: 'POST',
    payload: payload,
    expectedPayload: mockSendSak,
    type: {
      request: types.SAK_SEND_REQUEST,
      success: types.SAK_SEND_SUCCESS,
      failure: types.SAK_SEND_FAILURE
    }
  })
}

export const getFagsaker: ActionCreator<ThunkResult<ActionWithPayload<FagSaker>>> = (
  fnr: string, sektor: string, tema: string
): ThunkResult<ActionWithPayload<FagSaker>> => {
  return call({
    url: sprintf(urls.API_FAGSAKER_QUERY_URL, { fnr: fnr, sektor: sektor, tema: tema }),
    expectedPayload: mockFagsakerList({ fnr: fnr, sektor: sektor, tema: tema }),
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
  return call({
    url: sprintf(urls.API_INSTITUSJONER_URL, { buctype: buctype, landkode: landkode }),
    expectedPayload: mockInstitusjon({ landkode: landkode }),
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
  return call({
    url: sprintf(urls.API_LANDKODER_URL, { buctype: buctype }),
    expectedPayload: mockLandkode(),
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
  return call({
    url: sprintf(urls.API_PERSONER_URL, { fnr: fnr }),
    expectedPayload: mockPerson,
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
  return call({
    url: sprintf(urls.API_PERSONER_URL, { fnr: fnr }),
    expectedPayload: mockPerson,
    cascadeFailureError: true,
    context: {
      fnr: fnr
    },
    type: {
      request: types.SAK_PERSON_RELATERT_SEARCH_REQUEST,
      success: types.SAK_PERSON_RELATERT_SEARCH_SUCCESS,
      failure: types.SAK_PERSON_RELATERT_SEARCH_FAILURE
    }
  })
}

export const removeArbeidsgiver: ActionCreator<ActionWithPayload<Arbeidsgiver>> = (
  payload: Arbeidsgiver
): ActionWithPayload<Arbeidsgiver> => ({
  type: types.SAK_ARBEIDSGIVER_REMOVE,
  payload: payload
})

export const removeFamilierelasjoner: ActionCreator<ActionWithPayload<OldFamilieRelasjon>> = (
  payload: OldFamilieRelasjon
): ActionWithPayload<OldFamilieRelasjon> => ({
  type: types.SAK_FAMILIERELASJONER_REMOVE,
  payload: payload
})

export const resetFagsaker: ActionCreator<Action> = (): Action => ({
  type: types.SAK_FAGSAKER_RESET
})

export const resetPerson: ActionCreator<Action> = (): Action => ({
  type: types.SAK_PERSON_RESET
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
