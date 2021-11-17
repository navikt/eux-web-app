import * as types from 'constants/actionTypes'
import * as urls from 'constants/urls'
import { ReplyPdu1 } from 'declarations/pd'
import { FagSaker, UpdateReplyPdu1Payload } from 'declarations/types'
import { ActionWithPayload, call, ThunkResult } from 'js-fetch-api'
import mockFagsakerList from 'mocks/fagsakerList'
import mockCreatePdu1 from 'mocks/pdu1/replyPdu1'
import mockCompletePdu1 from 'mocks/pdu1/complete'
import mockPreviewPdu1 from 'mocks/pdu1/preview'
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
): ThunkResult<ActionWithPayload<File>> => {
  return call({
    url: sprintf(urls.PDU1_PREVIEW_URL, {}),
    expectedPayload: mockPreviewPdu1,
    type: {
      request: types.PDU1_PREVIEW_REQUEST,
      success: types.PDU1_PREVIEW_SUCCESS,
      failure: types.PDU1_PREVIEW_FAILURE
    }
  })
}

export const createPdu1: ActionCreator<ThunkResult<ActionWithPayload<FagSaker>>> = (
  fnr: string, fagsak: string
): ThunkResult<ActionWithPayload<FagSaker>> => {
  return call({
    url: sprintf(urls.PDU1_CREATE_URL, {
      fnr: fnr,
      fagsak: fagsak
    }),
    expectedPayload: mockCreatePdu1,
    type: {
      request: types.PDU1_CREATE_REQUEST,
      success: types.PDU1_CREATE_SUCCESS,
      failure: types.PDU1_CREATE_FAILURE
    }
  })
}

export const completePdu1: ActionCreator<ThunkResult<ActionWithPayload<FagSaker>>> = (
  replyPdu1: ReplyPdu1
): ThunkResult<ActionWithPayload<FagSaker>> => {
  return call({
    method: 'POST',
    url: sprintf(urls.PDU1_COMPLETE_URL, {}),
    body: replyPdu1,
    expectedPayload: mockCompletePdu1,
    type: {
      request: types.PDU1_COMPLETE_REQUEST,
      success: types.PDU1_COMPLETE_SUCCESS,
      failure: types.PDU1_COMPLETE_FAILURE
    }
  })
}

export const setReplySed: ActionCreator<ActionWithPayload<ReplyPdu1>> = (
  replyPdu1: ReplyPdu1
): ActionWithPayload<ReplyPdu1> => ({
  type: types.PDU1_REPLYSED_SET,
  payload: replyPdu1
})

export const updateReplySed: ActionCreator<ActionWithPayload<UpdateReplyPdu1Payload>> = (
  needle: string, value: any
): ActionWithPayload<UpdateReplyPdu1Payload> => ({
  type: types.PDU1_REPLYSED_UPDATE,
  payload: {
    needle,
    value
  }
})
