import * as types from 'constants/actionTypes'
import * as urls from 'constants/urls'
import * as api from 'eessi-pensjon-ui/dist/api'
import { ActionWithPayload, ThunkResult } from 'eessi-pensjon-ui/dist/declarations/types'
import { ActionCreator } from 'redux'
const sprintf = require('sprintf-js').sprintf

export const sendVedlegg: ActionCreator<ThunkResult<ActionWithPayload>> = (payload: any): ThunkResult<ActionWithPayload> => {
  return api.realCall({
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

export const getDokumenter: ActionCreator<ThunkResult<ActionWithPayload>> = (rinasaksnummer: string): ThunkResult<ActionWithPayload> => {
  return api.realCall({
    url: sprintf(urls.API_VEDLEGG_DOKUMENTER_URL, { rinasaksnummer: rinasaksnummer }),
    type: {
      request: types.VEDLEGG_DOKUMENTER_GET_REQUEST,
      success: types.VEDLEGG_DOKUMENTER_GET_SUCCESS,
      failure: types.VEDLEGG_DOKUMENTER_GET_FAILURE
    }
  })
}

export const set = (key: any, value: any) => ({
  type: types.VEDLEGG_VALUE_SET,
  payload: {
    key: key,
    value: value
  }
})
