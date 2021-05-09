import * as types from 'constants/actionTypes'
import * as urls from 'constants/urls'
import { ActionWithPayload, call, ThunkResult } from 'js-fetch-api'
import mockInntekt from 'mocks/inntekt'
import { ActionCreator } from 'redux'
const sprintf = require('sprintf-js').sprintf

export const fetchInntekt: ActionCreator<ThunkResult<ActionWithPayload>> = (
  fnr: string, fom?: string, tom?: string
): ThunkResult<ActionWithPayload> => {
  return call({
    url: fom ? sprintf(urls.API_INNTEKT_FOM_TOM_URL, { fnr, fom, tom }) : sprintf(urls.API_INNTEKT_URL, { fnr }),
    method: 'GET',
    expectedPayload: mockInntekt,
    type: {
      request: types.INNTEKT_GET_REQUEST,
      success: types.INNTEKT_GET_SUCCESS,
      failure: types.INNTEKT_GET_FAILURE
    }
  })
}
