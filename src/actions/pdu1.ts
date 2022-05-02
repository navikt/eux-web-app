import * as types from 'constants/actionTypes'
import * as urls from 'constants/urls'
import { PDU1 } from 'declarations/pd'
import { FagSaker, UpdatePdu1Payload } from 'declarations/types'
import { ActionWithPayload, call } from '@navikt/fetch'
import mockFagsakerList from 'mocks/fagsakerList'
import mockGetPdu1 from 'mocks/pdu1/get'
import mockFetchPdu1 from 'mocks/pdu1/fetch'
import mockPreviewPdu1 from 'mocks/pdu1/preview'
import mockJornalførePdu1 from 'mocks/pdu1/journalfore'
import { Action, ActionCreator } from 'redux'
import File from '@navikt/forhandsvisningsfil'

const sprintf = require('sprintf-js').sprintf

export const fetchPdu1 = (
  fnr: string
): Action => {
  return call({
    url: sprintf(urls.PDU1_FETCH_URL, { fnr }),
    expectedPayload: mockFetchPdu1,
    type: {
      request: types.PDU1_FETCH_REQUEST,
      success: types.PDU1_FETCH_SUCCESS,
      failure: types.PDU1_FETCH_FAILURE
    }
  })
}

export const getPdu1 = (
  fnr: string, fagsakId: string
): Action => {
  return call({
    url: sprintf(urls.PDU1_GET_URL, { fnr }),
    expectedPayload: mockGetPdu1,
    context: { fagsakId },
    type: {
      request: types.PDU1_GET_REQUEST,
      success: types.PDU1_GET_SUCCESS,
      failure: types.PDU1_GET_FAILURE
    }
  })
}

export const jornalførePdu1 = (
  payload: PDU1
): ActionWithPayload<PDU1> => {
  return call({
    method: 'POST',
    url: urls.PDU1_JOURNALPOST_URL,
    body: payload,
    expectedPayload: mockJornalførePdu1,
    type: {
      request: types.PDU1_JOURNALFØRE_REQUEST,
      success: types.PDU1_JOURNALFØRE_SUCCESS,
      failure: types.PDU1_JOURNALFØRE_FAILURE
    }
  })
}

export const getFagsaker = (
  fnr: string, sektor: string, tema: string
): ActionWithPayload<FagSaker> => {
  return call({
    url: sprintf(urls.API_FAGSAKER_QUERY_URL, { fnr, sektor, tema }),
    expectedPayload: mockFagsakerList({ fnr, sektor, tema }),
    type: {
      request: types.PDU1_FAGSAKER_GET_REQUEST,
      success: types.PDU1_FAGSAKER_GET_SUCCESS,
      failure: types.PDU1_FAGSAKER_GET_FAILURE
    }
  })
}

export const previewPdu1 = (
  payload: PDU1
): ActionWithPayload<File> => {
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

export const resetPdu1results = () => ({
  type: types.PDU1_FETCH_RESET
})

export const resetFagsaker = () => ({
  type: types.PDU1_FAGSAKER_RESET
})

export const resetPreviewPdu1 = () => ({
  type: types.PDU1_PREVIEW_RESET
})

export const resetJornalførePdu1 = () => ({
  type: types.PDU1_JOURNALFØRE_RESET
})

export const setPdu1 = (
  PDU1: PDU1
): ActionWithPayload<PDU1> => ({
  type: types.PDU1_SET,
  payload: PDU1
})

export const loadPdu1 = (
  PDU1: PDU1
): ActionWithPayload<PDU1> => ({
  type: types.PDU1_LOAD,
  payload: PDU1
})

export const updatePdu1: ActionCreator<ActionWithPayload<UpdatePdu1Payload>> = (
  needle: string, value: any
): ActionWithPayload<UpdatePdu1Payload> => ({
  type: types.PDU1_UPDATE,
  payload: { needle, value }
})
