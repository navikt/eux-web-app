import * as types from 'constants/actionTypes'
import * as urls from 'constants/urls'
import {FagsakPayload, PDU1} from 'declarations/pd'
import { Fagsaker, UpdatePdu1Payload } from 'declarations/types'
import { ActionWithPayload, call } from '@navikt/fetch'
import mockFagsakerList from 'mocks/fagsakerList'
import mockFagsak from 'mocks/fagsak'
import mockStoredPdu1AsJSON from 'mocks/pdu1/storedAsJSON'
import mockSearchResultsPdu1 from 'mocks/pdu1/searchResults'
import mockTemplatePdu1 from 'mocks/pdu1/template'
import mockPreviewPdu1 from 'mocks/pdu1/preview'
import mockJornalførePdu1 from 'mocks/pdu1/journalfore'
import { Action, ActionCreator } from 'redux'
import File from '@navikt/forhandsvisningsfil'

const sprintf = require('sprintf-js').sprintf

export const cleanUpPDU1 = ():Action => ({
  type: types.PDU1_RESET
})

export const searchPdu1s = (
  fnr: string
): Action => {
  return call({
    url: sprintf(urls.PDU1_SEARCH_URL, { fnr }),
    expectedPayload: mockSearchResultsPdu1,
    type: {
      request: types.PDU1_SEARCH_REQUEST,
      success: types.PDU1_SEARCH_SUCCESS,
      failure: types.PDU1_SEARCH_FAILURE
    }
  })
}

export const getStoredPdu1AsJSON = (
  journalpostId: string, dokumentId: string, fagsak: string
): Action => {
  return call({
    url: sprintf(urls.PDU1_GET_URL, { journalpostId, dokumentId, variant: 'ORIGINAL' }),
    expectedPayload: mockStoredPdu1AsJSON,
    context: {
      fagsak,
      journalpostId,
      dokumentId
    },
    type: {
      request: types.PDU1_ASJSON_REQUEST,
      success: types.PDU1_ASJSON_SUCCESS,
      failure: types.PDU1_ASJSON_FAILURE
    }
  })
}

export const getStoredPdu1AsPDF = (
  journalpostId: string, dokumentId: string
): Action => {
  return call({
    url: sprintf(urls.PDU1_GET_URL, { journalpostId, dokumentId, variant: 'ARKIV' }),
    expectedPayload: mockPreviewPdu1(),
    responseType: 'pdf',
    type: {
      request: types.PDU1_ASPDF_REQUEST,
      success: types.PDU1_ASPDF_SUCCESS,
      failure: types.PDU1_ASPDF_FAILURE
    }
  })
}

export const resetStoredPdu1AsPDF = () => ({
  type: types.PDU1_ASPDF_RESET
})

export const getPdu1Template = (
  fnr: string, fagsakId: string, saksreferanse: string
): Action => {
  return call({
    url: sprintf(urls.PDU1_INFO_URL, { fnr }),
    expectedPayload: mockTemplatePdu1,
    context: {
      fnr,
      fagsakId,
      saksreferanse
    },
    type: {
      request: types.PDU1_TEMPLATE_REQUEST,
      success: types.PDU1_TEMPLATE_SUCCESS,
      failure: types.PDU1_TEMPLATE_FAILURE
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
): ActionWithPayload<Fagsaker> => {
  return call({
    url: sprintf(urls.API_GET_FAGSAKER_URL, { fnr, tema }),
    expectedPayload: mockFagsakerList({ fnr, sektor, tema }),
    type: {
      request: types.PDU1_FAGSAKER_REQUEST,
      success: types.PDU1_FAGSAKER_SUCCESS,
      failure: types.PDU1_FAGSAKER_FAILURE
    }
  })
}

export const createFagsak = (
  fnr: string, payload: FagsakPayload
): ActionWithPayload<Fagsaker> => {
  return call({
    method: 'POST',
    url: sprintf(urls.API_PDU1_CREATE_FAGSAK_URL, { fnr }),
    expectedPayload: mockFagsak,
    body: payload,
    type: {
      request: types.PDU1_CREATE_FAGSAK_REQUEST,
      success: types.PDU1_CREATE_FAGSAK_SUCCESS,
      failure: types.PDU1_CREATE_FAGSAK_FAILURE
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
  type: types.PDU1_SEARCH_RESET
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

export const setStatsborgerskapModalShown = () => ({
  type:types.PDU1_STATSBORGERSKAP_MODAL_SHOWN_SET
})

export const loadPdu1 = (
  PDU1: PDU1
): ActionWithPayload<PDU1> => ({
  type: types.PDU1_LOAD,
  payload: PDU1
})

export const setPdu1 = (
  PDU1: PDU1
): ActionWithPayload<PDU1> => ({
  type: types.PDU1_SET,
  payload: PDU1
})

export const updatePdu1: ActionCreator<ActionWithPayload<UpdatePdu1Payload>> = (
  needle: string, value: any
): ActionWithPayload<UpdatePdu1Payload> => ({
  type: types.PDU1_UPDATE,
  payload: { needle, value }
})
