import { ParamPayload } from 'declarations/app'
import {
  ArbeidsperiodeFraAA,
  FagSaker,
  OldFamilieRelasjon,
  Institusjoner,
  Kodeverk
} from 'declarations/types'
import { ActionWithPayload, call } from '@navikt/fetch'
import mockSendSak from 'mocks/sak/sendSak'
import mockFagsakerList from 'mocks/fagsakerList'
import { mockInstitusjon, mockLandkode } from 'mocks/institutionList'
import moment from 'moment'
import { Action, ActionCreator } from 'redux'
import * as types from 'constants/actionTypes'
import * as urls from 'constants/urls'

const sprintf = require('sprintf-js').sprintf

export const addArbeidsperiode: ActionCreator<ActionWithPayload<ArbeidsperiodeFraAA>> = (
  payload: ArbeidsperiodeFraAA
): ActionWithPayload<ArbeidsperiodeFraAA> => ({
  type: types.SAK_ARBEIDSPERIODER_ADD,
  payload
})

export const addFamilierelasjoner: ActionCreator<ActionWithPayload<OldFamilieRelasjon>> = (
  payload: OldFamilieRelasjon
): ActionWithPayload<OldFamilieRelasjon> => ({
  type: types.SAK_FAMILIERELASJONER_ADD,
  payload
})

export const cleanData: ActionCreator<Action> = (): Action => ({
  type: types.SAK_CLEAN_DATA
})

export const createSak = (data: any): ActionWithPayload<any> => {
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
  if (data.arbeidsperioder && data.arbeidsperioder.length > 0) {
    payload.tilleggsopplysninger.arbeidsforhold = data.arbeidsperioder
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
    payload,
    expectedPayload: mockSendSak,
    type: {
      request: types.SAK_SEND_REQUEST,
      success: types.SAK_SEND_SUCCESS,
      failure: types.SAK_SEND_FAILURE
    }
  })
}

export const getFagsaker = (
  fnr: string, sektor: string, tema: string
): ActionWithPayload<FagSaker> => {
  return call({
    url: sprintf(urls.API_FAGSAKER_QUERY_URL, { fnr, sektor, tema }),
    expectedPayload: mockFagsakerList({ fnr, sektor, tema }),
    type: {
      request: types.SAK_FAGSAKER_GET_REQUEST,
      success: types.SAK_FAGSAKER_GET_SUCCESS,
      failure: types.SAK_FAGSAKER_GET_FAILURE
    }
  })
}

export const getInstitusjoner = (
  buctype: string, landkode: string
): ActionWithPayload<Institusjoner> => {
  return call({
    url: sprintf(urls.API_INSTITUSJONER_URL, { buctype, landkode }),
    expectedPayload: mockInstitusjon({ landkode }),
    type: {
      request: types.SAK_INSTITUSJONER_GET_REQUEST,
      success: types.SAK_INSTITUSJONER_GET_SUCCESS,
      failure: types.SAK_INSTITUSJONER_GET_FAILURE
    }
  })
}

export const getLandkoder = (
  buctype: string
): ActionWithPayload<Array<Kodeverk>> => {
  return call({
    url: sprintf(urls.API_LANDKODER_URL, { buctype }),
    expectedPayload: mockLandkode(),
    type: {
      request: types.SAK_LANDKODER_GET_REQUEST,
      success: types.SAK_LANDKODER_GET_SUCCESS,
      failure: types.SAK_LANDKODER_GET_FAILURE
    }
  })
}

export const removeArbeidsperiode: ActionCreator<ActionWithPayload<ArbeidsperiodeFraAA>> = (
  payload: ArbeidsperiodeFraAA
): ActionWithPayload<ArbeidsperiodeFraAA> => ({
  type: types.SAK_ARBEIDSPERIODER_REMOVE,
  payload
})

export const removeFamilierelasjoner: ActionCreator<ActionWithPayload<OldFamilieRelasjon>> = (
  payload: OldFamilieRelasjon
): ActionWithPayload<OldFamilieRelasjon> => ({
  type: types.SAK_FAMILIERELASJONER_REMOVE,
  payload
})

export const resetFagsaker: ActionCreator<Action> = (): Action => ({
  type: types.SAK_FAGSAKER_RESET
})

export const resetSentSed: ActionCreator<Action> = (): Action => ({
  type: types.SAK_SEND_RESET
})

export const setProperty: ActionCreator<ActionWithPayload<ParamPayload>> = (
  key: string, value: string | undefined
): ActionWithPayload<ParamPayload> => ({
  type: types.SAK_PROPERTY_SET,
  payload: { key, value }
})
