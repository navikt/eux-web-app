import * as inntektActions from 'actions/inntekt'
import * as types from 'constants/actionTypes'
import * as urls from 'constants/urls'
import { call as originalCall } from 'js-fetch-api'

const sprintf = require('sprintf-js').sprintf
jest.mock('js-fetch-api', () => ({
  call: jest.fn()
}))
const call = originalCall as jest.Mock<typeof originalCall>

describe('actions/attachments', () => {
  afterEach(() => {
    call.mockReset()
  })

  afterAll(() => {
    call.mockRestore()
  })

  it('fetchInntekt()', () => {
    const fnr = 'mockFnr'
    const fom = 'mockFom'
    const tom = 'mockTom'
    const inntektsliste = 'mockInntektsliste'
    inntektActions.fetchInntekt(fnr, fom, tom, inntektsliste)
    expect(call)
      .toBeCalledWith(expect.objectContaining({
        type: {
          request: types.INNTEKT_GET_REQUEST,
          success: types.INNTEKT_GET_SUCCESS,
          failure: types.INNTEKT_GET_FAILURE
        },
        url: sprintf(urls.API_INNTEKT_FOM_TOM_URL, { fnr, fom: fom ?? '', tom: tom ?? '', inntektsliste: inntektsliste ?? '' })
      }))
  })
})