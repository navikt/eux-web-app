import * as types from 'constants/actionTypes'
import * as urls from 'constants/urls'
import { ArbeidsperiodeFraAA, ArbeidsperioderFraAA } from 'declarations/types'
import { ActionWithPayload, call } from '@navikt/fetch'
import mockArbeidsperioder from 'mocks/arbeidsperioder/arbeidsperioder'
import { ActionCreator } from 'redux'
const sprintf = require('sprintf-js').sprintf

export interface GetArbeidsperiodeOptions {
  fnr: string
  inntektslistetype: string
  fom: string
  tom: string
}

export const fetchArbeidsperioder = (
  options: GetArbeidsperiodeOptions
): ActionWithPayload<ArbeidsperioderFraAA> => {
  return call({
    url: sprintf(urls.API_ARBEIDSPERIODER_QUERY_URL, options),
    expectedPayload: mockArbeidsperioder,
    type: {
      request: types.ARBEIDSPERIODER_REQUEST,
      success: types.ARBEIDSPERIODER_SUCCESS,
      failure: types.ARBEIDSPERIODER_FAILURE
    }
  })
}

export const updateArbeidsperioder: ActionCreator<ActionWithPayload<Array<ArbeidsperiodeFraAA>>> = (
  arbeidsperioder: Array<ArbeidsperiodeFraAA>
): ActionWithPayload<Array<ArbeidsperiodeFraAA>> => ({
  type: types.ARBEIDSPERIODER_UPDATE,
  payload: arbeidsperioder
})
