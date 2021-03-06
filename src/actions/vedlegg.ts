import * as types from 'constants/actionTypes'
import * as urls from 'constants/urls'
import { VedleggPayload } from 'declarations/types'
import { realCall, ActionWithPayload, ThunkResult } from 'js-fetch-api'
import { ActionCreator } from 'redux'
const sprintf = require('sprintf-js').sprintf

export const sendVedlegg: ActionCreator<ThunkResult<ActionWithPayload>> = (payload: VedleggPayload): ThunkResult<ActionWithPayload> => {
  return realCall({
    url: urls.API_VEDLEGG_POST_URL,
    method: 'POST',
    payload: payload,
    type: {
      request: types.VEDLEGG_POST_REQUEST,
      success: types.VEDLEGG_POST_SUCCESS,
      failure: types.VEDLEGG_POST_FAILURE
    }
  })
}

export const getDokument: ActionCreator<ThunkResult<ActionWithPayload>> = (rinasaksnummer: string): ThunkResult<ActionWithPayload> => {
  return realCall({
    url: sprintf(urls.API_VEDLEGG_DOKUMENT_URL, { rinasaksnummer: rinasaksnummer }),
    type: {
      request: types.VEDLEGG_DOKUMENT_GET_REQUEST,
      success: types.VEDLEGG_DOKUMENT_GET_SUCCESS,
      failure: types.VEDLEGG_DOKUMENT_GET_FAILURE
    }
  })
}

export const set = (key: string, value: string | undefined) => ({
  type: types.VEDLEGG_VALUE_SET,
  payload: {
    key: key,
    value: value
  }
})
