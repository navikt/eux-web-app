import * as arbeidsgiverActions from 'actions/arbeidsgiver'
import * as types from 'constants/actionTypes'
import * as urls from 'constants/urls'
import { call as originalCall } from 'js-fetch-api'
import { Action } from 'redux'

const sprintf = require('sprintf-js').sprintf

jest.mock('js-fetch-api', () => ({
  call: jest.fn()
}))
const call: jest.Mock = originalCall as unknown as jest.Mock<typeof originalCall>

describe('actions/arbeidsgiver', () => {
  afterEach(() => {
    call.mockReset()
  })

  afterAll(() => {
    call.mockRestore()
  })

  it('fetchArbeidsperioder()', () => {
    const fnr = 'mockFnr'
    arbeidsgiverActions.fetchArbeidsperioder(fnr)
    expect(call)
      .toBeCalledWith(expect.objectContaining({
        type: {
          request: types.ARBEIDSPERIODER_GET_REQUEST,
          success: types.ARBEIDSPERIODER_GET_SUCCESS,
          failure: types.ARBEIDSPERIODER_GET_FAILURE
        },
        url: sprintf(urls.API_ARBEIDSPERIODER_QUERY_URL, { fnr: fnr })
      }))
  })

  it('updateArbeidsgivere()', () => {
    const payload = 'mockPayload'
    const generatedResult: Action = arbeidsgiverActions.updateArbeidsgivere(payload)
    expect(generatedResult)
      .toMatchObject({
        type: types.ARBEIDSPERIODER_UPDATE,
        payload: payload
      })
  })
})
