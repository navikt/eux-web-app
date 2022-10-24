import * as vedleggActions from 'actions/vedlegg'
import * as types from 'constants/actionTypes'
import * as urls from 'constants/urls'
import { call as originalCall } from '@navikt/fetch'
import mockVedleggPayload from 'mocks/vedlegg/vedlegg'

jest.mock('@navikt/fetch', () => ({
  call: jest.fn()
}))
const call: jest.Mock = originalCall as unknown as jest.Mock<typeof originalCall>
const sprintf = require('sprintf-js').sprintf

describe('actions/vedlegg', () => {
  afterEach(() => {
    call.mockReset()
  })

  afterAll(() => {
    call.mockRestore()
  })

  it('getDokument()', () => {
    const mockRinasaksnummer = '12345678901'
    vedleggActions.getDokument(mockRinasaksnummer)
    expect(call)
      .toBeCalledWith(expect.objectContaining({
        type: {
          request: types.VEDLEGG_DOKUMENT_REQUEST,
          success: types.VEDLEGG_DOKUMENT_SUCCESS,
          failure: types.VEDLEGG_DOKUMENT_FAILURE
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
    expect(call)
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
