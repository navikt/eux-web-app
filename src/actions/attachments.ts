import * as types from 'constants/actionTypes'
import * as urls from 'constants/urls'
import {
  JoarkBrowserItem,
  JoarkBrowserItems,
  JoarkBrowserItemWithContent,
  JoarkList,
  JoarkPreview,
  SEDAttachmentPayloadWithFile
} from 'declarations/attachments.d'
import { ActionWithPayload, call } from '@navikt/fetch'
import mockJoark from 'mocks/attachments/joark'
import mockPreview from 'mocks/attachments/preview'
import { Action, ActionCreator } from 'redux'
const sprintf = require('sprintf-js').sprintf

export const createSavingAttachmentJob: ActionCreator<ActionWithPayload<JoarkBrowserItems>> = (
  joarkBrowserItems: JoarkBrowserItems
): ActionWithPayload<JoarkBrowserItems> => ({
  type: types.ATTACHMENT_SAVINGATTACHMENTJOB_SET,
  payload: joarkBrowserItems
})

export const getJoarkItemPreview = (
  item: JoarkBrowserItem
): ActionWithPayload<JoarkPreview> => {
  return call({
    url: sprintf(urls.API_JOARK_GET_URL, {
      dokumentInfoId: item.dokumentInfoId,
      journalpostId: item.journalpostId,
      variantformat: item.variant?.variantformat
    }),
    responseType: 'pdf',
    expectedPayload: mockPreview(),
    context: item,
    type: {
      request: types.ATTACHMENT_PREVIEW_REQUEST,
      success: types.ATTACHMENT_PREVIEW_SUCCESS,
      failure: types.ATTACHMENT_PREVIEW_FAILURE
    }
  })
}

export const listJoarkItems = (
  fnr: string, tema: string = ''
): ActionWithPayload<JoarkList> => {
  return call({
    url: sprintf(urls.API_ATTACHMENT_LIST_URL, { fnr, tema }),
    expectedPayload: mockJoark,
    type: {
      request: types.ATTACHMENT_LIST_REQUEST,
      success: types.ATTACHMENT_LIST_SUCCESS,
      failure: types.ATTACHMENT_LIST_FAILURE
    }
  })
}

export const resetSedAttachments: ActionCreator<Action> = (): Action => ({
  type: types.ATTACHMENT_RESET
})

export const sendAttachmentToSed = (
  params: SEDAttachmentPayloadWithFile, joarkBrowserItem: JoarkBrowserItem
): Action => {
  return call({
    url: sprintf(urls.API_JOARK_ATTACHMENT_URL, params),
    method: 'POST',
    cascadeFailureError: true,
    expectedPayload: joarkBrowserItem,
    context: {
      params,
      joarkBrowserItem
    },
    type: {
      request: types.ATTACHMENT_SEND_REQUEST,
      success: types.ATTACHMENT_SEND_SUCCESS,
      failure: types.ATTACHMENT_SEND_FAILURE
    }
  })
}

export const setJoarkItemPreview: ActionCreator<ActionWithPayload<JoarkBrowserItemWithContent | undefined>> = (
  item: JoarkBrowserItemWithContent | undefined
): ActionWithPayload<JoarkBrowserItemWithContent | undefined> => ({
  type: types.ATTACHMENT_PREVIEW_SET,
  payload: item
})
