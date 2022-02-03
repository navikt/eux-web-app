import * as arbeidsgiverActions from 'actions/arbeidsgiver'
import * as types from 'constants/actionTypes'
import * as urls from 'constants/urls'
import { call as originalCall } from '@navikt/fetch'
const sprintf = require('sprintf-js').sprintf

jest.mock('@navikt/fetch', () => ({ call: jest.fn() }))
const call: jest.Mock = originalCall as unknown as jest.Mock<typeof originalCall>

describe('actions/arbeidsgiver', () => {
  afterEach(() => {
    call.mockReset()
  })

  afterAll(() => {
    call.mockRestore()
  })

  it('fetchArbeidsperioder()', () => {
    const mockOptions = {
      fnr: 'mockFnr',
      inntektslistetype: 'type',
      fom: 'fom',
      tom: 'tom'
    }
    arbeidsgiverActions.fetchArbeidsperioder(mockOptions)
    expect(call)
      .toBeCalledWith(expect.objectContaining({
        type: {
          request: types.ARBEIDSPERIODER_GET_REQUEST,
          success: types.ARBEIDSPERIODER_GET_SUCCESS,
          failure: types.ARBEIDSPERIODER_GET_FAILURE
        },
        url: sprintf(urls.API_ARBEIDSPERIODER_QUERY_URL, mockOptions)
      }))
  })

  it('updateArbeidsgivere()', () => {
    const payload = 'mockPayload'
    expect(arbeidsgiverActions.updateArbeidsgivere(payload))
      .toMatchObject({
        type: types.ARBEIDSPERIODER_UPDATE,
        payload: payload
      })
  })
})
