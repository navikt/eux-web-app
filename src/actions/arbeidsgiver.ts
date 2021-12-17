import * as types from 'constants/actionTypes'
import * as urls from 'constants/urls'
import { Arbeidsgiver, Arbeidsperioder } from 'declarations/types'
import { ActionWithPayload, call, ThunkResult } from 'js-fetch-api'
import mockArbeidsperioder from 'mocks/arbeidsgiver/arbeidsperioder'
import { ActionCreator } from 'redux'
const sprintf = require('sprintf-js').sprintf

export interface GetArbeidsperiodeOptions {
  fnr: string
  inntektslistetype: string
  fom: string
  tom: string
}

export const fetchArbeidsperioder: ActionCreator<ThunkResult<ActionWithPayload<Arbeidsperioder>>> = (
  options: GetArbeidsperiodeOptions
): ThunkResult<ActionWithPayload<Arbeidsperioder>> => {
  return call({
    url: sprintf(urls.API_ARBEIDSPERIODER_QUERY_URL, options),
    expectedPayload: mockArbeidsperioder,
    type: {
      request: types.ARBEIDSPERIODER_GET_REQUEST,
      success: types.ARBEIDSPERIODER_GET_SUCCESS,
      failure: types.ARBEIDSPERIODER_GET_FAILURE
    }
  })
}

export const updateArbeidsgivere: ActionCreator<ActionWithPayload<Array<Arbeidsgiver>>> = (
  arbeidsgivere: Array<Arbeidsgiver>
): ActionWithPayload<Array<Arbeidsgiver>> => ({
  type: types.ARBEIDSPERIODER_UPDATE,
  payload: arbeidsgivere
})
