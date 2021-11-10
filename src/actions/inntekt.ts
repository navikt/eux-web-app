import * as types from 'constants/actionTypes'
import * as urls from 'constants/urls'
import { IInntekter } from 'declarations/types'
import { ActionWithPayload, call, ThunkResult } from 'js-fetch-api'
import mockInntekt from 'mocks/inntekt/inntekt'
import { ActionCreator } from 'redux'

const sprintf = require('sprintf-js').sprintf

export const fetchInntekt: ActionCreator<ThunkResult<ActionWithPayload<IInntekter>>> = (
  fnr: string, fom?: string, tom?: string, inntektsliste?: string
): ThunkResult<ActionWithPayload<IInntekter>> => {
  return call({
    url: sprintf(urls.API_INNTEKT_FOM_TOM_URL, { fnr, fom: fom ?? '', tom: tom ?? '', inntektsliste: inntektsliste ?? '' }),
    expectedPayload: mockInntekt,
    type: {
      request: types.INNTEKT_GET_REQUEST,
      success: types.INNTEKT_GET_SUCCESS,
      failure: types.INNTEKT_GET_FAILURE
    }
  })
}
