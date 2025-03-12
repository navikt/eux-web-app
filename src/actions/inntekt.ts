import * as types from 'constants/actionTypes'
import * as urls from 'constants/urls'
import { IInntekter } from 'declarations/types'
import { ActionWithPayload, call } from '@navikt/fetch'
import mockInntekt from 'mocks/inntekt/inntekt'
// @ts-ignore
import { sprintf } from 'sprintf-js'

export const fetchInntekt = (
  fnr: string, fom?: string, tom?: string, inntektsliste?: string
): ActionWithPayload<IInntekter> => {
  return call({
    url: sprintf(urls.API_INNTEKT_FOM_TOM_URL, { fnr, fom: fom ?? '', tom: tom ?? '', inntektsliste: inntektsliste ?? '' }),
    expectedPayload: mockInntekt,
    type: {
      request: types.INNTEKT_REQUEST,
      success: types.INNTEKT_SUCCESS,
      failure: types.INNTEKT_FAILURE
    }
  })
}
