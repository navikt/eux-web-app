import * as types from 'constants/actionTypes'
import * as urls from 'constants/urls'
import { ReplySed } from 'declarations/sed'
import { ConnectedSed } from 'declarations/types'
import { ActionWithPayload, call, ThunkResult } from 'js-fetch-api'
import mockReplySed from 'mocks/replySed'
import mockConnectedReplySeds from 'mocks/connectedReplySeds'
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

export const updateReplySed:  ActionCreator<ActionWithPayload> = (
  needleString: string | Array<string>, value: any
): ActionWithPayload => ({
  type: types.SVARPASED_REPLYSED_UPDATE,
  payload: {
    needleString,
    value
  }
})

export const setParentSed: ActionCreator<ActionWithPayload> = (
  payload: string
): ActionWithPayload => ({
  type: types.SVARPASED_PARENTSED_SET,
  payload: payload
})

export const createSed: ActionCreator<ThunkResult<
  ActionWithPayload
>> = (rinaSakId: string, replySed: ReplySed): ThunkResult<ActionWithPayload> => {
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
    body: replySed
  })
}
