import * as types from 'constants/actionTypes'
import * as urls from 'constants/urls'
import { VedleggPayload } from 'declarations/types'
import { call, ActionWithPayload, ThunkResult } from 'js-fetch-api'
import { ActionCreator } from 'redux'
import mockSendVedlegg from 'mocks/sendVedlegg'
import mockRinaDokumenter from 'mocks/rinaDokumenter'
const sprintf = require('sprintf-js').sprintf

export const getDokument: ActionCreator<ThunkResult<ActionWithPayload>> = (rinasaksnummer: string): ThunkResult<ActionWithPayload> => {
  return call({
    url: sprintf(urls.API_VEDLEGG_DOKUMENT_URL, { rinasaksnummer: rinasaksnummer }),
    expectedPayload: mockRinaDokumenter({ rinasaksnummer: rinasaksnummer }),
    type: {
      request: types.VEDLEGG_DOKUMENT_GET_REQUEST,
      success: types.VEDLEGG_DOKUMENT_GET_SUCCESS,
      failure: types.VEDLEGG_DOKUMENT_GET_FAILURE
    }
  })
}

export const propertySet = (key: string, value: string | undefined) => ({
  type: types.VEDLEGG_PROPERTY_SET,
  payload: {
    key: key,
    value: value
  }
})

export const sendVedlegg: ActionCreator<ThunkResult<ActionWithPayload>> = (payload: VedleggPayload): ThunkResult<ActionWithPayload> => {
  return call({
    url: urls.API_VEDLEGG_POST_URL,
    method: 'POST',
    payload: payload,
    expectedPayload: mockSendVedlegg,
    type: {
      request: types.VEDLEGG_POST_REQUEST,
      success: types.VEDLEGG_POST_SUCCESS,
      failure: types.VEDLEGG_POST_FAILURE
    }
  })
}
