import * as types from 'constants/actionTypes'
import * as urls from 'constants/urls'
import { SvarPaSedMode } from 'declarations/app'
import { ReplySed } from 'declarations/sed'
import { ConnectedSed, FagSaker, UpdateReplySedPayload } from 'declarations/types'
import { ActionWithPayload, call, ThunkResult } from 'js-fetch-api'
import mockFagsakerList from 'mocks/fagsakerList'
import mockReplySed from 'mocks/replySed'
import mockConnectedReplySeds from 'mocks/connectedReplySeds'
import { Action, ActionCreator } from 'redux'
import validator from '@navikt/fnrvalidator'
import mockPreview from 'mocks/previewFile'
import _ from 'lodash'
const sprintf = require('sprintf-js').sprintf

export const createSed: ActionCreator<ThunkResult<ActionWithPayload>> = (
  replySed: ReplySed
): ThunkResult<ActionWithPayload> => {
  const rinaSakId = replySed.saksnummer
  const copyReplySed = _.cloneDeep(replySed)
  delete copyReplySed.saksnummer
  delete copyReplySed.sedUrl
  delete copyReplySed.spørreSedJournalført
  return call({
    method: 'POST',
    url: sprintf(urls.API_SED_CREATE_URL, { rinaSakId: rinaSakId }),
    cascadeFailureError: true,
    expectedPayload: {
      sedId: '123'
    },
    type: {
      request: types.SVARPASED_SED_CREATE_REQUEST,
      success: types.SVARPASED_SED_CREATE_SUCCESS,
      failure: types.SVARPASED_SED_CREATE_FAILURE
    },
    body: copyReplySed
  })
}

export const getFagsaker: ActionCreator<ThunkResult<ActionWithPayload<FagSaker>>> = (
  fnr: string, sektor: string, tema: string
): ThunkResult<ActionWithPayload<FagSaker>> => {
  return call({
    url: sprintf(urls.API_FAGSAKER_QUERY_URL, { fnr: fnr, sektor: sektor, tema: tema }),
    expectedPayload: mockFagsakerList({ fnr: fnr, sektor: sektor, tema: tema }),
    type: {
      request: types.SVARPASED_FAGSAKER_GET_REQUEST,
      success: types.SVARPASED_FAGSAKER_GET_SUCCESS,
      failure: types.SVARPASED_FAGSAKER_GET_FAILURE
    }
  })
}

export const resetPreviewFile = () => ({
  type: types.SVARPASED_PREVIEW_RESET
})

export const getPreviewFile = (rinaSakId: string, replySed: ReplySed) => {
  return call({
    method: 'POST',
    url: sprintf(urls.API_PREVIEW_URL, { rinaSakId: rinaSakId }),
    expectedPayload: mockPreview,
    responseType: 'blob',
    type: {
      request: types.SVARPASED_PREVIEW_REQUEST,
      success: types.SVARPASED_PREVIEW_SUCCESS,
      failure: types.SVARPASED_PREVIEW_FAILURE
    },
    body: replySed
  })
}

export const querySaksnummerOrFnr: ActionCreator<ThunkResult<ActionWithPayload<ConnectedSed>>> = (
  saksnummerOrFnr: string
): ThunkResult<ActionWithPayload<ConnectedSed>> => {
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

export const queryReplySed: ActionCreator<ThunkResult<ActionWithPayload<ReplySed>>> = (
  connectedSed: ConnectedSed, saksnummer: string
): ThunkResult<ActionWithPayload<ReplySed>> => {
  const mockSed = mockReplySed(connectedSed.svarsedType)
  return call({
    url: sprintf(urls.API_RINASAK_SVARSED_QUERY_URL, {
      rinaSakId: saksnummer,
      sedId: connectedSed.sedId,
      sedType: connectedSed.svarsedType
    }),
    expectedPayload: {
      ...mockSed,
      saksnummer: saksnummer
    },
    context: {
      saksnummer: saksnummer,
      sedUrl: connectedSed.sedUrl,
      spørreSedJournalført: _.isNil(connectedSed.lenkeHvisForrigeSedMaaJournalfoeres)
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

export const resetSedResponse: ActionCreator<Action> = (): Action => ({
  type: types.SVARPASED_SED_RESPONSE_RESET
})

export const setMode: ActionCreator<ActionWithPayload<SvarPaSedMode>> = (
  mode: SvarPaSedMode
): ActionWithPayload<SvarPaSedMode> => ({
  type: types.SVARPASED_MODE_SET,
  payload: mode
})

export const setParentSed: ActionCreator<ActionWithPayload> = (
  payload: string
): ActionWithPayload => ({
  type: types.SVARPASED_PARENTSED_SET,
  payload: payload
})

export const setReplySed: ActionCreator<ActionWithPayload<ReplySed>> = (
  replySed: ReplySed
): ActionWithPayload<ReplySed> => ({
  type: types.SVARPASED_REPLYSED_SET,
  payload: replySed
})

export const updateReplySed: ActionCreator<ActionWithPayload<UpdateReplySedPayload>> = (
  needle: string, value: any
): ActionWithPayload<UpdateReplySedPayload> => ({
  type: types.SVARPASED_REPLYSED_UPDATE,
  payload: {
    needle,
    value
  }
})
