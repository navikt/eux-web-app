import * as types from 'constants/actionTypes'
import * as urls from 'constants/urls'
import { FagSaker } from 'declarations/types'
import { ActionWithPayload, call, ThunkResult } from 'js-fetch-api'
import mockFagsakerList from 'mocks/fagsakerList'
import mockCreatePdu1 from 'mocks/pdu1/replySed'
import { ActionCreator } from 'redux'
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
