import * as types from 'constants/actionTypes'
import * as urls from 'constants/urls'
import { ReplySed } from 'declarations/sed'
import { Sed, CreateSedResponse, FagSaker, UpdateReplySedPayload, Sak } from 'declarations/types'
import { ActionWithPayload, call } from '@navikt/fetch'
import mockFagsakerList from 'mocks/fagsakerList'
import mockReplySed from 'mocks/svarsed/replySed'
import mockSaks from 'mocks/svarsed/saks'
import { Action, ActionCreator } from 'redux'
import validator from '@navikt/fnrvalidator'
import mockPreview from 'mocks/previewFile'
import _ from 'lodash'
const sprintf = require('sprintf-js').sprintf

export const cleanUpSvarSed = ():Action => ({
  type: types.SVARSED_RESET
})

export const createSed = (
  replySed: ReplySed
): ActionWithPayload => {
  const copyReplySed = _.cloneDeep(replySed)
  delete copyReplySed.sak
  delete copyReplySed.sed
  delete copyReplySed.attachments
  return call({
    method: 'POST',
    url: sprintf(urls.API_SED_CREATE_URL, { rinaSakId: replySed.sak?.sakId }),
    cascadeFailureError: true,
    expectedPayload: {
      sedId: '123'
    } as CreateSedResponse,
    context: {
      sedType: replySed.sedType,
      sakUrl: replySed.sak?.sakUrl
    },
    type: {
      request: types.SVARSED_SED_CREATE_REQUEST,
      success: types.SVARSED_SED_CREATE_SUCCESS,
      failure: types.SVARSED_SED_CREATE_FAILURE
    },
    body: copyReplySed
  })
}

export const deleteSak = (rinaSakId: string) => {
  return call({
    method: 'DELETE',
    url: sprintf(urls.API_SAK_DELETE_URL, { rinaSakId }),
    cascadeFailureError: true,
    expectedPayload: {
      sucess: true
    },
    type: {
      request: types.SVARSED_SAK_DELETE_REQUEST,
      success: types.SVARSED_SAK_DELETE_SUCCESS,
      failure: types.SVARSED_SAK_DELETE_FAILURE
    }
  })
}

export const updateSed = (
  replySed: ReplySed
): ActionWithPayload => {
  const copyReplySed = _.cloneDeep(replySed)
  delete copyReplySed.sak
  delete copyReplySed.sed
  delete copyReplySed.attachments
  return call({
    method: 'PUT',
    url: sprintf(urls.API_SED_UPDATE_URL, { rinaSakId: replySed.sak?.sakId, sedId: replySed.sed?.sedId }),
    cascadeFailureError: true,
    expectedPayload: {
      sedId: '456'
    } as CreateSedResponse,
    context: {
      sedType: replySed.sedType,
      sakUrl: replySed.sak?.sakUrl
    },
    type: {
      request: types.SVARSED_SED_UPDATE_REQUEST,
      success: types.SVARSED_SED_UPDATE_SUCCESS,
      failure: types.SVARSED_SED_UPDATE_FAILURE
    },
    body: copyReplySed
  })
}

export const getFagsaker = (
  fnr: string, sektor: string, tema: string
): ActionWithPayload<FagSaker> => {
  return call({
    url: sprintf(urls.API_FAGSAKER_QUERY_URL, { fnr, sektor, tema }),
    expectedPayload: mockFagsakerList({ fnr, sektor, tema }),
    type: {
      request: types.SVARSED_FAGSAKER_REQUEST,
      success: types.SVARSED_FAGSAKER_SUCCESS,
      failure: types.SVARSED_FAGSAKER_FAILURE
    }
  })
}

export const getPreviewFile = (rinaSakId: string, replySed: ReplySed): ActionWithPayload => {
  return call({
    method: 'POST',
    url: sprintf(urls.API_PREVIEW_URL, { rinaSakId }),
    expectedPayload: mockPreview,
    responseType: 'pdf',
    type: {
      request: types.SVARSED_PREVIEW_FILE_REQUEST,
      success: types.SVARSED_PREVIEW_FILE_SUCCESS,
      failure: types.SVARSED_PREVIEW_FILE_FAILURE
    },
    body: replySed
  })
}

export const getSedStatus = (rinaSakId: string, sedId: string): ActionWithPayload => {
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

export const invalidatingSed = (
  connectedSed: Sed, sak: Sak
): ActionWithPayload<any> => ({
  type: types.SVARSED_SED_INVALIDATE,
  payload: { connectedSed, sak }
})

export const rejectingSed = (
  connectedSed: Sed, sak: Sak
): ActionWithPayload<any> => ({
  type: types.SVARSED_SED_REJECT,
  payload: { connectedSed, sak }
})

export const clarifyingSed = (
  connectedSed: Sed, sak: Sak
): ActionWithPayload<any> => ({
  type: types.SVARSED_SED_CLARIFY,
  payload: { connectedSed, sak }
})

export const querySaks = (
  saksnummerOrFnr: string, actiontype: 'new' | 'refresh' = 'new'
): ActionWithPayload<Sed> => {
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
    url,
    expectedPayload: mockSaks(saksnummerOrFnr, type),
    context: {
      type,
      saksnummerOrFnr
    },
    type: actiontype === 'new'
      ? {
          request: types.SVARSED_SAKS_REQUEST,
          success: types.SVARSED_SAKS_SUCCESS,
          failure: types.SVARSED_SAKS_FAILURE
        }
      : {
          request: types.SVARSED_SAKS_REFRESH_REQUEST,
          success: types.SVARSED_SAKS_REFRESH_SUCCESS,
          failure: types.SVARSED_SAKS_REFRESH_FAILURE
        }
  })
}

/*
sedId: string, sedType: string, status: string
rinaSakId: string,
 */
export const editSed = (
  connectedSed: Sed, sak: Sak
): ActionWithPayload<ReplySed> => {
  return call({
    url: sprintf(urls.API_SED_EDIT_URL, { rinaSakId: sak.sakId, sedId: connectedSed.sedId }),
    expectedPayload: mockReplySed(connectedSed.sedType ?? 'F001'),
    context: {
      sak,
      sed: connectedSed
    },
    type: {
      request: types.SVARSED_EDIT_REQUEST,
      success: types.SVARSED_EDIT_SUCCESS,
      failure: types.SVARSED_EDIT_FAILURE
    }
  })
}

export const previewSed = (
  sedId: string, rinaSakId: string
): ActionWithPayload<ReplySed> => {
  return call({
    url: sprintf(urls.API_SED_EDIT_URL, { rinaSakId, sedId }),
    expectedPayload: mockReplySed('F002'),
    type: {
      request: types.SVARSED_PREVIEW_REQUEST,
      success: types.SVARSED_PREVIEW_SUCCESS,
      failure: types.SVARSED_PREVIEW_FAILURE
    }
  })
}

export const loadReplySed: ActionCreator<ActionWithPayload<ReplySed>> = (
  replySed: ReplySed
): ActionWithPayload<ReplySed> => ({
  type: types.SVARSED_REPLYSED_LOAD,
  payload: replySed
})

export const setCurrentSak = (currentSak: Sak | undefined) => ({
  type: types.SVARSED_CURRENTSAK_SET,
  payload: currentSak
})

export const replyToSed = (
  connectedSed: Sed, sak: Sak
): ActionWithPayload<ReplySed> => {
  const sedId = connectedSed.sedType === 'F002' && connectedSed.svarsedType === 'F002' && !_.isEmpty(connectedSed.sedIdParent)
    ? connectedSed.sedIdParent
    : connectedSed.sedId

  return call({
    url: sprintf(urls.API_RINASAK_SVARSED_QUERY_URL, {
      rinaSakId: sak.sakId,
      sedId,
      sedType: connectedSed.svarsedType
    }),
    expectedPayload: mockReplySed(connectedSed.svarsedType),
    context: {
      sak,
      sed: undefined
    },
    type: {
      request: types.SVARSED_REPLYTOSED_REQUEST,
      success: types.SVARSED_REPLYTOSED_SUCCESS,
      failure: types.SVARSED_REPLYTOSED_FAILURE
    }
  })
}

export const restoreReplySed: ActionCreator<Action> = (): Action => ({
  type: types.SVARSED_REPLYSED_RESTORE
})

export const resetPreviewSvarSed = () => ({
  type: types.SVARSED_PREVIEW_RESET
})

export const sendSedInRina = (
  rinaSakId: string, sedId: string
): ActionWithPayload<any> => {
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
