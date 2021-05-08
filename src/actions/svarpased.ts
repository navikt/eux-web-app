import * as types from 'constants/actionTypes'
import * as urls from 'constants/urls'
import { ReplySed } from 'declarations/sed'
import { Arbeidsgiver, OldFamilieRelasjon, ConnectedSed, Validation } from 'declarations/types'
import { ActionWithPayload, call, ThunkResult } from 'js-fetch-api'
import mockArbeidsperioder from 'mocks/arbeidsperioder'
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
      url = sprintf(urls.API_RINASAKER_OVERSIKT_FNR_QUERY_URL, { fnr: saksnummerOrFnr })
    } else {
      url = sprintf(urls.API_RINASAKER_OVERSIKT_DNR_QUERY_URL, { fnr: saksnummerOrFnr })
    }
  } else {
    type = 'saksnummer'
    url = sprintf(urls.API_RINASAKER_OVERSIKT_SAKID_QUERY_URL, { rinaSakId: saksnummerOrFnr })
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
  const mockSed = mockReplySed(connectedSed.svarsedType)
  return call({
    url: sprintf(urls.API_RINASAK_SVARSED_QUERY_URL, {
      rinaSakId: saksnummerOrFnr,
      sedId: connectedSed.sedId,
      sedType: connectedSed.svarsedType
    }),
    expectedPayload: {
      ...mockSed,
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
    url: sprintf(urls.API_PERSONER_URL, { fnr: fnr }),
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
    url: sprintf(urls.API_PERSONER_URL, { fnr: fnr }),
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
  payload: OldFamilieRelasjon
): ActionWithPayload => ({
  type: types.SVARPASED_FAMILIERELASJONER_ADD,
  payload: payload
})

export const removeFamilierelasjoner: ActionCreator<ActionWithPayload> = (
  payload: OldFamilieRelasjon
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

export const setAllValidation: ActionCreator<ActionWithPayload<Validation>> = (
  newValidation: Validation
): ActionWithPayload<Validation> => ({
  type: types.SVARPASED_VALIDATION_ALL_SET,
  payload: newValidation
})

export const resetValidation: ActionCreator<ActionWithPayload> = (
  key?: string
): ActionWithPayload => ({
  type: types.SVARPASED_VALIDATION_SET,
  payload: {
    key: key,
    value: undefined
  }
})

export const createSed: ActionCreator<ThunkResult<
  ActionWithPayload
>> = (rinaSakId: string, sedId: string, sedType: string, payload: SvarpasedState): ThunkResult<ActionWithPayload> => {
  return call({
    method: 'POST',
    url: sprintf(urls.API_SED_CREATE_URL, { rinaSakId: rinaSakId }),
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

export const getArbeidsperioder: ActionCreator<ThunkResult<
  ActionWithPayload
>> = (fnr: string): ThunkResult<ActionWithPayload> => {
  return call({
    url: sprintf(urls.API_ARBEIDSPERIODER_QUERY_URL, { fnr: fnr }),
    expectedPayload: mockArbeidsperioder(fnr),
    type: {
      request: types.SVARPASED_ARBEIDSPERIODER_GET_REQUEST,
      success: types.SVARPASED_ARBEIDSPERIODER_GET_SUCCESS,
      failure: types.SVARPASED_ARBEIDSPERIODER_GET_FAILURE
    }
  })
}

export const addArbeidsgiver: ActionCreator<ActionWithPayload> = (
  payload: Arbeidsgiver
): ActionWithPayload => ({
  type: types.SVARPASED_ARBEIDSGIVER_ADD,
  payload: payload
})

export const removeArbeidsgiver: ActionCreator<ActionWithPayload> = (
  payload: Arbeidsgiver
): ActionWithPayload => ({
  type: types.SVARPASED_ARBEIDSGIVER_REMOVE,
  payload: payload
})

export const fetchInntekt: ActionCreator<ThunkResult<ActionWithPayload>> = (
  fnr: string, fom?: string, tom?: string
): ThunkResult<ActionWithPayload> => {
  return call({
    url: fom ? sprintf(urls.API_INNTEKT_FOM_TOM_URL, { fnr, fom, tom }) : sprintf(urls.API_INNTEKT_URL, { fnr }),
    method: 'GET',
    expectedPayload: mockInntekt,
    type: {
      request: types.SVARPASED_INNTEKT_GET_REQUEST,
      success: types.SVARPASED_INNTEKT_GET_SUCCESS,
      failure: types.SVARPASED_INNTEKT_GET_FAILURE
    }
  })
}
