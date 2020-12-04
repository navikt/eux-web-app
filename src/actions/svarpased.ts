import * as types from 'constants/actionTypes'
import * as urls from 'constants/urls'
import { Arbeidsforholdet, FamilieRelasjon, Inntekter, SedOversikt } from 'declarations/types'
import { ActionWithPayload, call, ThunkResult } from 'js-fetch-api'
import mockArbeidsforholdList from 'mocks/arbeidsforholdList'
import mockInntekt from 'mocks/inntekt'
import mockPerson from 'mocks/person'
import mockSvarpased from 'mocks/svarpased'
import mockSvarpasedTyper from 'mocks/svarpasedTyper'
import mockSvarSedOversikt from 'mocks/svarSedOversikt'
import { SvarpasedState } from 'reducers/svarpased'
import { Action, ActionCreator } from 'redux'
import validator from '@navikt/fnrvalidator'
const sprintf = require('sprintf-js').sprintf

// OBSOLETE
export const getSeds: ActionCreator<ThunkResult<ActionWithPayload>> = (
  saksnummerOrFnr: string
): ThunkResult<ActionWithPayload> => {
  return call({
    url: sprintf(urls.API_SVARPASED_TYPER_URL, { rinasaksnummer: saksnummerOrFnr }),
    expectedPayload: mockSvarpasedTyper,
    type: {
      request: types.SVARPASED_SEDS_GET_REQUEST,
      success: types.SVARPASED_SEDS_GET_SUCCESS,
      failure: types.SVARPASED_SEDS_GET_FAILURE
    }
  })
}

export const querySaksnummerOrFnr: ActionCreator<ThunkResult<ActionWithPayload>> = (
  saksnummerOrFnr: string
): ThunkResult<ActionWithPayload> => {

  let url, type
  const result = validator.idnr(saksnummerOrFnr)

  if (result.status === 'valid') {
    type = result.type
    if (result.type === 'fnr') {
      url = sprintf(urls.API_SVARPASED_FNR_QUERY_URL, { rinasaksnummer: saksnummerOrFnr })
    } else {
      url = sprintf(urls.API_SVARPASED_DNR_QUERY_URL, { rinasaksnummer: saksnummerOrFnr })
    }
  } else {
    type = 'saksnummer'
    url = sprintf(urls.API_SVARPASED_SAKSNUMMER_QUERY_URL, { rinasaksnummer: saksnummerOrFnr })
  }

  return call({
    url: url,
    expectedPayload: mockSvarSedOversikt,
    context: {
      type: type
    },
    type: {
      request: types.SVARPASED_SAKSNUMMERORFNR_QUERY_REQUEST,
      success: types.SVARPASED_SAKSNUMMERORFNR_QUERY_SUCCESS,
      failure: types.SVARPASED_SAKSNUMMERORFNR_QUERY_FAILURE
    }
  })
}

export const querySvarSed: ActionCreator<ThunkResult<ActionWithPayload>> = (
  saksnummer: string, sedOversikt: SedOversikt
): ThunkResult<ActionWithPayload> => {
  return call({
    url: sprintf(urls.API_SVARPASED_SVARSED_QUERY_URL, {
      rinaSakId: saksnummer,
      sedId: sedOversikt.queryDocumentId,
      sedType: sedOversikt.replySedType
    }),
    expectedPayload: mockSvarpased,
    context: {
      sedOversikt: sedOversikt
    },
    type: {
      request: types.SVARPASED_SVARSED_QUERY_REQUEST,
      success: types.SVARPASED_SVARSED_QUERY_SUCCESS,
      failure: types.SVARPASED_SVARSED_QUERY_FAILURE
    }
  })
}

export const setSvarSed: ActionCreator<ActionWithPayload> = (
  payload: SedOversikt
): ActionWithPayload => ({
  type: types.SVARPASED_SVARSED_SET,
  payload: payload
})

export const setSpørreSed: ActionCreator<ActionWithPayload> = (
  payload: string
): ActionWithPayload => ({
  type: types.SVARPASED_SPØRRESED_SET,
  payload: payload
})

export const getPerson: ActionCreator<ThunkResult<ActionWithPayload>> = (
  fnr: string
): ThunkResult<ActionWithPayload> => {
  return call({
    url: sprintf(urls.API_SVARPASED_PERSON_URL, { fnr: fnr }),
    expectedPerson: mockPerson({ fnr: fnr }),
    cascadeFailureError: true,
    type: {
      request: types.SVARPASED_PERSON_GET_REQUEST,
      success: types.SVARPASED_PERSON_GET_SUCCESS,
      failure: types.SVARPASED_PERSON_GET_FAILURE
    }
  })
}

export const getPersonRelated: ActionCreator<ThunkResult<ActionWithPayload>> = (
  fnr: string
): ThunkResult<ActionWithPayload> => {
  return call({
    url: sprintf(urls.API_SVARPASED_PERSON_URL, { fnr: fnr }),
    expectedPerson: mockPerson({ fnr: fnr }),
    cascadeFailureError: true,
    context: {
      fnr: fnr
    },
    type: {
      request: types.SVARPASED_PERSON_RELATERT_GET_REQUEST,
      success: types.SVARPASED_PERSON_RELATERT_GET_SUCCESS,
      failure: types.SVARPASED_PERSON_RELATERT_GET_FAILURE
    }
  })
}

export const addFamilierelasjoner: ActionCreator<ActionWithPayload> = (
  payload: FamilieRelasjon
): ActionWithPayload => ({
  type: types.SVARPASED_FAMILIERELASJONER_ADD,
  payload: payload
})

export const removeFamilierelasjoner: ActionCreator<ActionWithPayload> = (
  payload: FamilieRelasjon
): ActionWithPayload => ({
  type: types.SVARPASED_FAMILIERELASJONER_REMOVE,
  payload: payload
})

export const resetPerson: ActionCreator<Action> = (): Action => ({
  type: types.SVARPASED_PERSON_RESET
})

export const resetPersonRelatert: ActionCreator<Action> = (): Action => ({
  type: types.SVARPASED_PERSON_RELATERT_RESET
})

export const sendSvarPaSedData: ActionCreator<ThunkResult<
  ActionWithPayload
>> = (rinaSakId: string, sedId: string, sedType: string, payload: SvarpasedState): ThunkResult<ActionWithPayload> => {
  return call({
    method: 'POST',
    url: sprintf(urls.API_SVARPASED_SEND_POST_URL, {
      rinaSakId: rinaSakId,
      sedId: sedId,
      sedType: sedType
    }),
    expectedPayload: {
      foo: 'bar'
    },
    type: {
      request: types.SVARPASED_SENDSVARPASEDDATA_POST_REQUEST,
      success: types.SVARPASED_SENDSVARPASEDDATA_POST_SUCCESS,
      failure: types.SVARPASED_SENDSVARPASEDDATA_POST_FAILURE
    },
    body: payload
  })
}

export const getArbeidsforholdList: ActionCreator<ThunkResult<
  ActionWithPayload
>> = (fnr: string): ThunkResult<ActionWithPayload> => {
  return call({
    url: sprintf(urls.API_SAK_ARBEIDSFORHOLD_URL, { fnr: fnr }),
    expectedPayload: mockArbeidsforholdList({ fnr: fnr }),
    type: {
      request: types.SVARPASED_ARBEIDSFORHOLDLIST_GET_REQUEST,
      success: types.SVARPASED_ARBEIDSFORHOLDLIST_GET_SUCCESS,
      failure: types.SVARPASED_ARBEIDSFORHOLDLIST_GET_FAILURE
    }
  })
}

export const addArbeidsforhold: ActionCreator<ActionWithPayload> = (
  payload: Arbeidsforholdet
): ActionWithPayload => ({
  type: types.SVARPASED_ARBEIDSFORHOLD_ADD,
  payload: payload
})

export const removeArbeidsforhold: ActionCreator<ActionWithPayload> = (
  payload: Arbeidsforholdet
): ActionWithPayload => ({
  type: types.SVARPASED_ARBEIDSFORHOLD_REMOVE,
  payload: payload
})

export const fetchInntekt: ActionCreator<ThunkResult<ActionWithPayload>> = (
  data: any
): ThunkResult<ActionWithPayload> => {
  return call({
    url: sprintf(urls.API_SAK_INNTEKT_URL, {
      fnr: data.fnr,
      fraDato: data.fraDato,
      tilDato: data.tilDato,
      tema: data.tema
    }),
    method: 'GET',
    expectedPayload: mockInntekt,
    type: {
      request: types.SVARPASED_INNTEKT_GET_REQUEST,
      success: types.SVARPASED_INNTEKT_GET_SUCCESS,
      failure: types.SVARPASED_INNTEKT_GET_FAILURE
    }
  })
}

export const sendSeletedInntekt: ActionCreator<ActionWithPayload> = (
  payload: Inntekter
): ActionWithPayload => ({
  type: types.SVARPASED_SELECTED_INNTEKT_SUCCESS,
  payload: payload
})
