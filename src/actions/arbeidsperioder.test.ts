import * as arbeidsperioderActions from 'actions/arbeidsperioder'
import * as types from 'constants/actionTypes'
import * as urls from 'constants/urls'
import { call as originalCall } from '@navikt/fetch'
const sprintf = require('sprintf-js').sprintf

jest.mock('@navikt/fetch', () => ({ call: jest.fn() }))
const call: jest.Mock = originalCall as unknown as jest.Mock<typeof originalCall>

describe('actions/arbeidsperioder', () => {
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
    arbeidsperioderActions.fetchArbeidsperioder(mockOptions)
    expect(call)
      .toBeCalledWith(expect.objectContaining({
        type: {
          request: types.ARBEIDSPERIODER_REQUEST,
          success: types.ARBEIDSPERIODER_SUCCESS,
          failure: types.ARBEIDSPERIODER_FAILURE
        },
        url: sprintf(urls.API_ARBEIDSPERIODER_QUERY_URL, mockOptions)
      }))
  })

  it('updateArbeidsperioder()', () => {
    const payload = 'mockPayload'
    expect(arbeidsperioderActions.updateArbeidsperioder(payload))
      .toMatchObject({
        type: types.ARBEIDSPERIODER_UPDATE,
        payload
      })
  })
})
