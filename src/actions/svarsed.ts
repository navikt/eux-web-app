import * as types from 'constants/actionTypes'
import * as urls from 'constants/urls'
import { ReplySed } from 'declarations/sed'
import { ConnectedSed, CreateSedResponse, FagSaker, UpdateReplySedPayload } from 'declarations/types'
import { ActionWithPayload, call, ThunkResult } from '@navikt/fetch'
import mockFagsakerList from 'mocks/fagsakerList'
import mockReplySed from 'mocks/svarsed/replySed'
import mockConnectedReplySeds from 'mocks/svarsed/connectedReplySeds'
import { ActionCreator } from 'redux'
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
  delete copyReplySed.sakUrl
  delete copyReplySed.sedId
  return call({
    method: 'POST',
    url: sprintf(urls.API_SED_CREATE_URL, { rinaSakId }),
    cascadeFailureError: true,
    expectedPayload: {
      sedId: '123'
    } as CreateSedResponse,
    context: {
      sedType: replySed.sedType,
      sakUrl: replySed.sakUrl
    },
    type: {
      request: types.SVARSED_SED_CREATE_REQUEST,
      success: types.SVARSED_SED_CREATE_SUCCESS,
      failure: types.SVARSED_SED_CREATE_FAILURE
    },
    body: copyReplySed
  })
}

export const updateSed: ActionCreator<ThunkResult<ActionWithPayload>> = (
  replySed: ReplySed
): ThunkResult<ActionWithPayload> => {
  const rinaSakId = replySed.saksnummer
  const sedId = replySed.sedId
  const copyReplySed = _.cloneDeep(replySed)
  delete copyReplySed.saksnummer
  delete copyReplySed.sakUrl
  delete copyReplySed.sedId
  return call({
    method: 'PUT',
    url: sprintf(urls.API_SED_UPDATE_URL, { rinaSakId, sedId }),
    cascadeFailureError: true,
    expectedPayload: {
      sedId: '456'
    } as CreateSedResponse,
    context: {
      sedType: replySed.sedType,
      sakUrl: replySed.sakUrl
    },
    type: {
      request: types.SVARSED_SED_UPDATE_REQUEST,
      success: types.SVARSED_SED_UPDATE_SUCCESS,
      failure: types.SVARSED_SED_UPDATE_FAILURE
    },
    body: copyReplySed
  })
}

export const getFagsaker: ActionCreator<ThunkResult<ActionWithPayload<FagSaker>>> = (
  fnr: string, sektor: string, tema: string
): ThunkResult<ActionWithPayload<FagSaker>> => {
  return call({
    url: sprintf(urls.API_FAGSAKER_QUERY_URL, { fnr, sektor, tema }),
    expectedPayload: mockFagsakerList({ fnr, sektor, tema }),
    type: {
      request: types.SVARSED_FAGSAKER_GET_REQUEST,
      success: types.SVARSED_FAGSAKER_GET_SUCCESS,
      failure: types.SVARSED_FAGSAKER_GET_FAILURE
    }
  })
}

export const getPreviewFile = (rinaSakId: string, replySed: ReplySed) => {
  return call({
    method: 'POST',
    url: sprintf(urls.API_PREVIEW_URL, { rinaSakId }),
    expectedPayload: mockPreview,
    responseType: 'pdf',
    type: {
      request: types.SVARSED_PREVIEW_REQUEST,
      success: types.SVARSED_PREVIEW_SUCCESS,
      failure: types.SVARSED_PREVIEW_FAILURE
    },
    body: replySed
  })
}

export const getSedStatus = (rinaSakId: string, sedId: string) => {
  return call({
    url: sprintf(urls.API_SED_STATUS_URL, { rinaSakId, sedId }),
    expectedPayload: {
      status: 'new'
    },
    context: {
      sedId
    },
    type: {
      request: types.SVARSED_SED_STATUS_REQUEST,
      success: types.SVARSED_SED_STATUS_SUCCESS,
      failure: types.SVARSED_SED_STATUS_FAILURE
    }
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
      type,
      saksnummerOrFnr
    },
    type: {
      request: types.SVARSED_SAKSNUMMERORFNR_QUERY_REQUEST,
      success: types.SVARSED_SAKSNUMMERORFNR_QUERY_SUCCESS,
      failure: types.SVARSED_SAKSNUMMERORFNR_QUERY_FAILURE
    }
  })
}

export const editSed: ActionCreator<ThunkResult<ActionWithPayload<ReplySed>>> = (
  sedId: string, sedType: string, rinaSakId: string
): ThunkResult<ActionWithPayload<ReplySed>> => {
  const mockSed = mockReplySed(sedType)
  return call({
    url: sprintf(urls.API_SED_EDIT_URL, {rinaSakId, sedId}),
    expectedPayload: {
      ...mockSed,
      saksnummer: rinaSakId
    },
    context: {
      saksnummer: rinaSakId,
      sedId
    },
    type: {
      request: types.SVARSED_EDIT_REQUEST,
      success: types.SVARSED_EDIT_SUCCESS,
      failure: types.SVARSED_EDIT_FAILURE
    }
  })
}

export const queryReplySed: ActionCreator<ThunkResult<ActionWithPayload<ReplySed>>> = (
  connectedSed: ConnectedSed, saksnummer: string, sakUrl: string
): ThunkResult<ActionWithPayload<ReplySed>> => {
  const mockSed = mockReplySed(connectedSed.svarsedType)

  const sedId = connectedSed.sedType === 'F002' && connectedSed.svarsedType === 'F002' && !_.isEmpty(connectedSed.sedIdParent)
    ? connectedSed.sedIdParent
    : connectedSed.sedId

  return call({
    url: sprintf(urls.API_RINASAK_SVARSED_QUERY_URL, {
      rinaSakId: saksnummer,
      sedId,
      sedType: connectedSed.svarsedType
    }),
    expectedPayload: {
      ...mockSed,
      saksnummer
    },
    context: {
      saksnummer,
      sakUrl,
      sedId: connectedSed.svarsedId
    },
    type: {
      request: types.SVARSED_REPLYSED_QUERY_REQUEST,
      success: types.SVARSED_REPLYSED_QUERY_SUCCESS,
      failure: types.SVARSED_REPLYSED_QUERY_FAILURE
    }
  })
}

export const resetPreviewSvarSed = () => ({
  type: types.SVARSED_PREVIEW_RESET
})

export const sendSedInRina: ActionCreator<ThunkResult<ActionWithPayload<any>>> = (
  rinaSakId: string, sedId: string
): ThunkResult<ActionWithPayload<any>> => {
  return call({
    method: 'POST',
    url: sprintf(urls.API_SED_SEND_URL, { rinaSakId, sedId }),
    expectedPayload: {
      success: 'true'
    },
    type: {
      request: types.SVARSED_SED_SEND_REQUEST,
      success: types.SVARSED_SED_SEND_SUCCESS,
      failure: types.SVARSED_SED_SEND_FAILURE
    }
  })
}

export const setParentSed: ActionCreator<ActionWithPayload<string>> = (
  payload: string
): ActionWithPayload<string> => ({
  type: types.SVARSED_PARENTSED_SET,
  payload: payload
})

export const setReplySed: ActionCreator<ActionWithPayload<ReplySed>> = (
  replySed: ReplySed
): ActionWithPayload<ReplySed> => ({
  type: types.SVARSED_REPLYSED_SET,
  payload: replySed
})

export const updateReplySed: ActionCreator<ActionWithPayload<UpdateReplySedPayload>> = (
  needle: string, value: any
): ActionWithPayload<UpdateReplySedPayload> => ({
  type: types.SVARSED_REPLYSED_UPDATE,
  payload: { needle, value }
})
