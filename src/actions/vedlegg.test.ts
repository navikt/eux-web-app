import * as vedleggActions from 'actions/vedlegg'
import * as types from 'constants/actionTypes'
import * as urls from 'constants/urls'
import { realCall as originalCall } from 'js-fetch-api'
import mockVedleggPayload from 'mocks/vedlegg'

jest.mock('js-fetch-api', () => ({
  realCall: jest.fn()
}))
const realCall: jest.Mock = originalCall as unknown as jest.Mock<typeof originalCall>
const sprintf = require('sprintf-js').sprintf

describe('actions/vedlegg', () => {
  afterEach(() => {
    realCall.mockReset()
  })

  afterAll(() => {
    realCall.mockRestore()
  })


  it('getDokument()', () => {
    const mockRinasaksnummer = '12345678901'
    vedleggActions.getDokument(mockRinasaksnummer)
    expect(realCall)
      .toBeCalledWith(expect.objectContaining({
        type: {
          request: types.VEDLEGG_DOKUMENT_GET_REQUEST,
          success: types.VEDLEGG_DOKUMENT_GET_SUCCESS,
          failure: types.VEDLEGG_DOKUMENT_GET_FAILURE
        },
        url: sprintf(urls.API_VEDLEGG_DOKUMENT_URL, { rinasaksnummer: mockRinasaksnummer })
      }))
  })

  it('propertySet()', () => {
    const generatedResult = vedleggActions.propertySet('key', 'value')
    expect(generatedResult).toMatchObject({
      type: types.VEDLEGG_PROPERTY_SET,
      payload: {
        key: 'key',
        value: 'value'
      }
    })
  })

  it('sendVedlegg()', () => {
    vedleggActions.sendVedlegg(mockVedleggPayload)
    expect(realCall)
      .toBeCalledWith(expect.objectContaining({
        type: {
          request: types.VEDLEGG_POST_REQUEST,
          success: types.VEDLEGG_POST_SUCCESS,
          failure: types.VEDLEGG_POST_FAILURE
        },
        url: urls.API_VEDLEGG_POST_URL
      }))
  })
})
