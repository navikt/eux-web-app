import * as types from 'constants/actionTypes'
import * as urls from 'constants/urls'
import { ReplySed } from 'declarations/sed'
import { Arbeidsforholdet, FamilieRelasjon, Inntekter, ConnectedSed, Validation } from 'declarations/types'
import { ActionWithPayload, call, ThunkResult } from 'js-fetch-api'
import mockArbeidsforholdList from 'mocks/arbeidsforholdList'
import mockInntekt from 'mocks/inntekt'
import mockPerson from 'mocks/person'
import mockReplySed from 'mocks/replySed'
import mockConnectedReplySeds from 'mocks/connectedReplySeds'
import { SvarpasedState } from 'reducers/svarpased'
import { Action, ActionCreator } from 'redux'
import validator from '@navikt/fnrvalidator'
import mockPreview from 'mocks/previewFile'
const sprintf = require('sprintf-js').sprintf

export const getPreviewFile = () => {
  return call({
    url: urls.API_PREVIEW_URL,
    expectedPayload: mockPreview,
    type: {
      request: types.SVARPASED_PREVIEW_REQUEST,
      success: types.SVARPASED_PREVIEW_SUCCESS,
      failure: types.SVARPASED_PREVIEW_FAILURE
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
    expectedPayload: mockConnectedReplySeds,
    context: {
      type: type,
      saksnummerOrFnr: saksnummerOrFnr
    },
    type: {
      request: types.SVARPASED_SAKSNUMMERORFNR_QUERY_REQUEST,
      success: types.SVARPASED_SAKSNUMMERORFNR_QUERY_SUCCESS,
      failure: types.SVARPASED_SAKSNUMMERORFNR_QUERY_FAILURE
    }
  })
}

export const queryReplySed: ActionCreator<ThunkResult<ActionWithPayload>> = (
  saksnummerOrFnr: string, connectedSed: ConnectedSed, saksnummer: string
): ThunkResult<ActionWithPayload> => {
  const mockSed = mockReplySed(connectedSed.replySedType)
  return call({
    url: sprintf(urls.API_SVARPASED_REPLYSED_QUERY_URL, {
      rinaSakId: saksnummerOrFnr,
      sedId: connectedSed.querySedDocumentId,
      sedType: connectedSed.replySedType
    }),
    expectedPayload: {
      ...mockSed,
      ...connectedSed,
      saksnummer: saksnummer
    },
    context: {
      saksnummer: saksnummer
    },
    type: {
      request: types.SVARPASED_REPLYSED_QUERY_REQUEST,
      success: types.SVARPASED_REPLYSED_QUERY_SUCCESS,
      failure: types.SVARPASED_REPLYSED_QUERY_FAILURE
    }
  })
}

export const resetReplySed: ActionCreator<Action> = (): Action => ({
  type: types.SVARPASED_REPLYSED_RESET
})

export const setReplySed: ActionCreator<ActionWithPayload> = (
  replySed: ReplySed
): ActionWithPayload => ({
  type: types.SVARPASED_REPLYSED_SET,
  payload: replySed
})

export const setParentSed: ActionCreator<ActionWithPayload> = (
  payload: string
): ActionWithPayload => ({
  type: types.SVARPASED_PARENTSED_SET,
  payload: payload
})

export const searchPerson: ActionCreator<ThunkResult<ActionWithPayload>> = (
  fnr: string
): ThunkResult<ActionWithPayload> => {
  return call({
    url: sprintf(urls.API_SVARPASED_PERSON_URL, { fnr: fnr }),
    expectedPayload: mockPerson({ fnr: fnr }),
    cascadeFailureError: true,
    type: {
      request: types.SVARPASED_PERSON_SEARCH_REQUEST,
      success: types.SVARPASED_PERSON_SEARCH_SUCCESS,
      failure: types.SVARPASED_PERSON_SEARCH_FAILURE
    }
  })
}

export const getPersonRelated: ActionCreator<ThunkResult<ActionWithPayload>> = (
  fnr: string
): ThunkResult<ActionWithPayload> => {
  return call({
    url: sprintf(urls.API_SVARPASED_PERSON_URL, { fnr: fnr }),
    expectedPayload: mockPerson({ fnr: fnr }),
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

export const createSed: ActionCreator<ThunkResult<
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
      sedId: '123'
    },
    type: {
      request: types.SVARPASED_SED_CREATE_REQUEST,
      success: types.SVARPASED_SED_CREATE_SUCCESS,
      failure: types.SVARPASED_SED_CREATE_FAILURE
    },
    body: payload
  })
}

export const getArbeidsforholdList: ActionCreator<ThunkResult<
  ActionWithPayload
>> = (fnr: string): ThunkResult<ActionWithPayload> => {
  console.log(mockArbeidsforholdList(fnr))
  return call({
    url: sprintf(urls.API_SAK_ARBEIDSFORHOLD_URL, { fnr: fnr }),
    expectedPayload: mockArbeidsforholdList(fnr),
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

export const setAllValidation = (
  newValidation: Validation
): ActionWithPayload => ({
  type: types.SVARPASED_VALIDATION_ALL_SET,
  payload: newValidation
})

export const setSingleValidation = (
  key: any, value: any
): ActionWithPayload => ({
  type: types.SVARPASED_VALIDATION_ALL_SET,
  payload: {
    key: key,
    value: value
  }
})
