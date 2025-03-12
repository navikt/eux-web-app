import * as types from 'constants/actionTypes'
import * as urls from 'constants/urls'
import { ReplySed } from 'declarations/sed'
import { Sed, CreateSedResponse, Fagsaker, UpdateReplySedPayload, Sak } from 'declarations/types'
import { ActionWithPayload, call } from '@navikt/fetch'
import mockFagsakerList from 'mocks/fagsakerList'
import mockReplySed from 'mocks/svarsed/replySed'
import mockSaks from 'mocks/svarsed/saks'
import mockSaks2 from 'mocks/svarsed/saks_2'
import { Action, ActionCreator } from 'redux'
import {validateFnrDnrNpid} from 'utils/fnrValidator'
import mockPreview from 'mocks/previewFile'
import _ from 'lodash'
import {JoarkBrowserItem} from "../declarations/attachments";
// @ts-ignore
import { sprintf } from 'sprintf-js';

export const addMottakere = (
  rinaSakId: string, mottakere: Array<{id: string, name: string}>
) => {
  return call({
    method: 'POST',
    url: sprintf(urls.API_MOTTAKERE_URL, { rinaSakId }),
    cascadeFailureError: true,
    expectedPayload: {
      sucess: true
    },
    body: mottakere.map((m) => m.id),
    context: {
      mottakere: mottakere.map((m) => m.name)
    },
    type: {
      request: types.SVARSED_MOTTAKERE_ADD_REQUEST,
      success: types.SVARSED_MOTTAKERE_ADD_SUCCESS,
      failure: types.SVARSED_MOTTAKERE_ADD_FAILURE
    }
  })
}

export const resetMottakere = () => ({
  type: types.SVARSED_MOTTAKERE_ADD_RESET
})

export const cleanUpSvarSed = ():Action => ({
  type: types.SVARSED_RESET
})

export const resetSaks = ():Action => ({
  type: types.SVARSED_SAKS_RESET
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
): ActionWithPayload<Fagsaker> => {
  return call({
    url: sprintf(urls.API_GET_FAGSAKER_URL, { fnr, tema }),
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

export const remindSed = (
  connectedSed: Sed, sak: Sak
): ActionWithPayload<any> => ({
  type: types.SVARSED_SED_REMIND,
  payload: { connectedSed, sak }
})

export const createXSed = (
  sedType: string, sak: Sak
): ActionWithPayload<any> => ({
  type: types.SVARSED_XSED_CREATE,
  payload: { sedType, sak }
})

export const createH001Sed = (
  sak: Sak
): ActionWithPayload<any> => ({
  type: types.SVARSED_H001SED_CREATE,
  payload: { sak }
})

export const createFSed = (
  sedType: string,
  sak: Sak
): ActionWithPayload<any> => ({
  type: types.SVARSED_FSED_CREATE,
  payload: { sedType, sak }
})

export const createF002Sed = (
  connectedSed: Sed,
  sedType: string,
  sak: Sak
): ActionWithPayload<ReplySed> => {
  return call({
    url: sprintf(urls.API_SED_EDIT_URL, { rinaSakId: sak.sakId, sedId: connectedSed.sedId }),
    expectedPayload: mockReplySed(connectedSed.sedType ?? 'F001'),
    context: {
      sak,
      sedType
    },
    type: {
      request: types.SVARSED_F002SED_CREATE_REQUEST,
      success: types.SVARSED_F002SED_CREATE_SUCCESS,
      failure: types.SVARSED_F002SED_CREATE_FAILURE
    }
  })
}


export const querySaks = (
  saksnummerOrFnr: string, actiontype: 'new' | 'refresh' | 'timer' = 'new', mock2: boolean = false, signal?: AbortSignal
): ActionWithPayload<Sed> => {
  let url, type
  const result = validateFnrDnrNpid(saksnummerOrFnr)
  if (result.status === 'valid') {
    type = result.type
    if (result.type) {
      url = sprintf(urls.API_RINASAKER_OVERSIKT_FNR_DNR_NPID_QUERY_URL, { fnr: saksnummerOrFnr })
    }
  } else {
    type = 'saksnummer'
    url = sprintf(urls.API_RINASAKER_OVERSIKT_SAKID_QUERY_URL, { rinaSakId: saksnummerOrFnr })
  }

  let myActionType = {
    request: types.SVARSED_SAKS_REQUEST,
    success: types.SVARSED_SAKS_SUCCESS,
    failure: types.SVARSED_SAKS_FAILURE
  }

  if(actiontype === 'refresh') {
    myActionType = {
      request: types.SVARSED_SAKS_REFRESH_REQUEST,
      success: types.SVARSED_SAKS_REFRESH_SUCCESS,
      failure: types.SVARSED_SAKS_REFRESH_FAILURE
    }
  } else if (actiontype === 'timer') {
    myActionType = {
      request: types.SVARSED_SAKS_TIMER_REFRESH_REQUEST,
      success: types.SVARSED_SAKS_TIMER_REFRESH_SUCCESS,
      failure: types.SVARSED_SAKS_TIMER_REFRESH_FAILURE
    }
  }

  return call({
    url,
    expectedPayload: mock2 ? mockSaks2(saksnummerOrFnr, type) : mockSaks(saksnummerOrFnr, type),
    context: {
      type,
      saksnummerOrFnr
    },
    type: myActionType,
    signal
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
    url: sprintf(urls.API_PDF_URL, { rinaSakId, sedId }),
    expectedPayload: mockPreview,
    responseType: 'pdf',
    type: {
      request: types.SVARSED_PREVIEW_FILE_REQUEST,
      success: types.SVARSED_PREVIEW_FILE_SUCCESS,
      failure: types.SVARSED_PREVIEW_FILE_FAILURE
    },
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
    expectedPayload: mockReplySed(connectedSed.svarsedType!),
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

export const updateAttachmentsSensitivt: ActionCreator<ActionWithPayload<any>> = (
  attachmentKey: string,  sensitivt: boolean
): ActionWithPayload<any> => ({
  type: types.SVARSED_REPLYSED_ATTACHMENTS_SENSITIVT_UPDATE,
  payload: {
    attachmentKey,
    sensitivt
  }
})

export const removeAttachment: ActionCreator<ActionWithPayload<any>> = (
  attachment: JoarkBrowserItem
): ActionWithPayload<any> => ({
  type: types.SVARSED_REPLYSED_ATTACHMENTS_REMOVE,
  payload: attachment
})

export const deleteSed = (rinaSakId: string, sedId: string) => {
  return call({
    method: 'DELETE',
    url: sprintf(urls.API_SED_DELETE_URL, { rinaSakId, sedId }),
    cascadeFailureError: true,
    context: {
      sedId
    },
    type: {
      request: types.SVARSED_SED_DELETE_REQUEST,
      success: types.SVARSED_SED_DELETE_SUCCESS,
      failure: types.SVARSED_SED_DELETE_FAILURE
    }
  })
}

export const deleteAttachment = (rinaSakId: string | undefined, sedId: string | undefined, vedleggId: string) => {
  return call({
    method: 'DELETE',
    url: sprintf(urls.API_RINA_ATTACHMENT_DELETE_URL, { rinaSakId, sedId, vedleggId }),
    cascadeFailureError: true,
    context: {
      vedleggId: vedleggId,
      sedId: sedId
    },
    type: {
      request: types.SVARSED_ATTACHMENT_DELETE_REQUEST,
      success: types.SVARSED_ATTACHMENT_DELETE_SUCCESS,
      failure: types.SVARSED_ATTACHMENT_DELETE_FAILURE
    }
  })
}

export const setAttachmentSensitive = (rinaSakId: string | undefined, sedId: string | undefined, vedleggId: string, sensitive: boolean) => {
  return call({
    method: 'PUT',
    url: sprintf(urls.API_RINA_ATTACHMENT_SENSITIVE_URL, {rinaSakId, sedId, vedleggId}),
    body: {
      sensitivt: sensitive
    },
    cascadeFailureError: true,
    context: {
      vedleggId: vedleggId,
      sensitivt: sensitive,
      sedId: sedId
    },
    type: {
      request: types.SVARSED_ATTACHMENT_SENSITIVE_REQUEST,
      success: types.SVARSED_ATTACHMENT_SENSITIVE_SUCCESS,
      failure: types.SVARSED_ATTACHMENT_SENSITIVE_FAILURE
    }
  })
}

export const setDeselectedMenu = (menu: string | undefined) => ({
  type: types.SVARSED_DESELECTED_MENU_SET,
  payload: menu
})
