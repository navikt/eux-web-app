import * as types from 'constants/actionTypes'
import * as urls from 'constants/urls'
import { ReplyPdu1 } from 'declarations/pd'
import { FagSaker, UpdateReplyPdu1Payload } from 'declarations/types'
import { ActionWithPayload, call, ThunkResult } from 'js-fetch-api'
import mockFagsakerList from 'mocks/fagsakerList'
import mockCreatePdu1 from 'mocks/pdu1/replyPdu1empty'
import mockPreviewPdu1 from 'mocks/pdu1/preview'
import mockCompletePdu1 from 'mocks/pdu1/complete'
import { ActionCreator } from 'redux'
import File from 'forhandsvisningsfil'

const sprintf = require('sprintf-js').sprintf

export const getFagsaker: ActionCreator<ThunkResult<ActionWithPayload<FagSaker>>> = (
  fnr: string, sektor: string, tema: string
): ThunkResult<ActionWithPayload<FagSaker>> => {
  return call({
    url: sprintf(urls.API_FAGSAKER_QUERY_URL, { fnr: fnr, sektor: sektor, tema: tema }),
    expectedPayload: mockFagsakerList({ fnr: fnr, sektor: sektor, tema: tema }),
    type: {
      request: types.PDU1_FAGSAKER_GET_REQUEST,
      success: types.PDU1_FAGSAKER_GET_SUCCESS,
      failure: types.PDU1_FAGSAKER_GET_FAILURE
    }
  })
}

export const getPreviewPdu1: ActionCreator<ThunkResult<ActionWithPayload<File>>> = (
  payload: ReplyPdu1
): ThunkResult<ActionWithPayload<File>> => {
  return call({
    method: 'POST',
    url: urls.PDU1_PREVIEW_URL,
    body: payload,
    responseType: 'pdf',
    expectedPayload: mockPreviewPdu1,
    type: {
      request: types.PDU1_PREVIEW_REQUEST,
      success: types.PDU1_PREVIEW_SUCCESS,
      failure: types.PDU1_PREVIEW_FAILURE
    }
  })
}

export const createPdu1: ActionCreator<ThunkResult<ActionWithPayload<FagSaker>>> = (
  fnr: string
): ThunkResult<ActionWithPayload<FagSaker>> => {
  return call({
    url: sprintf(urls.PDU1_GET_URL, { fnr }),
    expectedPayload: mockCreatePdu1,
    type: {
      request: types.PDU1_CREATE_REQUEST,
      success: types.PDU1_CREATE_SUCCESS,
      failure: types.PDU1_CREATE_FAILURE
    }
  })
}

export const completePdu1: ActionCreator<ThunkResult<ActionWithPayload<any>>> = (
  payload: ReplyPdu1
): ThunkResult<ActionWithPayload<any>> => {
  return call({
    method: 'POST',
    url: urls.PDU1_JOURNALPOST_URL,
    body: payload,
    expectedPayload: mockCompletePdu1,
    type: {
      request: types.PDU1_COMPLETE_REQUEST,
      success: types.PDU1_COMPLETE_SUCCESS,
      failure: types.PDU1_COMPLETE_FAILURE
    }
  })
}

export const resetPreviewFile = () => ({
  type: types.PDU1_PREVIEW_RESET
})

export const resetCompletePdu1 = () => ({
  type: types.PDU1_COMPLETE_RESET
})

export const setReplyPdu1: ActionCreator<ActionWithPayload<ReplyPdu1>> = (
  replyPdu1: ReplyPdu1
): ActionWithPayload<ReplyPdu1> => ({
  type: types.PDU1_REPLYSED_SET,
  payload: replyPdu1
})

export const updateReplyPdu1: ActionCreator<ActionWithPayload<UpdateReplyPdu1Payload>> = (
  needle: string, value: any
): ActionWithPayload<UpdateReplyPdu1Payload> => ({
  type: types.PDU1_REPLYSED_UPDATE,
  payload: {
    needle,
    value
  }
})
