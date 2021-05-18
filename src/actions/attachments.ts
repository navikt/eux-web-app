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
import { ActionWithPayload, call, ThunkResult } from 'js-fetch-api'
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

export const getJoarkItemPreview: ActionCreator<ThunkResult<ActionWithPayload<JoarkPreview>>> = (
  item: JoarkBrowserItem
): ThunkResult<ActionWithPayload<JoarkPreview>> => {
  return call({
    url: sprintf(urls.API_JOARK_GET_URL, {
      dokumentInfoId: item.dokumentInfoId,
      journalpostId: item.journalpostId,
      variantformat: item.variant?.variantformat
    }),
    expectedPayload: mockPreview(),
    context: item,
    type: {
      request: types.JOARK_PREVIEW_REQUEST,
      success: types.JOARK_PREVIEW_SUCCESS,
      failure: types.JOARK_PREVIEW_FAILURE
    }
  })
}

export const listJoarkItems: ActionCreator<ThunkResult<ActionWithPayload<JoarkList>>> = (
  userId: string
): ThunkResult<ActionWithPayload<JoarkList>> => {
  return call({
    url: sprintf(urls.API_JOARK_LIST_URL, { userId: userId }),
    expectedPayload: mockJoark,
    type: {
      request: types.JOARK_LIST_REQUEST,
      success: types.JOARK_LIST_SUCCESS,
      failure: types.JOARK_LIST_FAILURE
    }
  })
}

export const sendAttachmentToSed: ActionCreator<ThunkResult<Action>> = (
  params: SEDAttachmentPayloadWithFile, joarkBrowserItem: JoarkBrowserItem
): ThunkResult<Action> => {
  return call({
    url: sprintf(urls.API_JOARK_ATTACHMENT_URL, params),
    method: 'PUT',
    cascadeFailureError: true,
    expectedPayload: joarkBrowserItem,
    context: {
      params: params,
      joarkBrowserItem: joarkBrowserItem
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
  type: types.JOARK_PREVIEW_SET,
  payload: item
})

export const resetSedAttachments: ActionCreator<Action> = (): Action => ({
  type: types.ATTACHMENT_RESET
})
