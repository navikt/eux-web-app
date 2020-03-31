import * as vedleggActions from 'actions/vedlegg'
import * as types from 'constants/actionTypes'
import * as urls from 'constants/urls'
import { VedleggPayload } from 'declarations/types'
import { realCall as originalCall } from 'eessi-pensjon-ui/dist/api'

jest.mock('eessi-pensjon-ui/dist/api', () => ({
  realCall: jest.fn()
}))
const realCall: jest.Mock = originalCall as jest.Mock<typeof originalCall>
const sprintf = require('sprintf-js').sprintf

describe('actions/vedlegg', () => {
  afterEach(() => {
    realCall.mockReset()
  })

  afterAll(() => {
    realCall.mockRestore()
  })

  it('sendVedlegg()', () => {
    const mockVedleggPayload: VedleggPayload = {
      dokumentID: '123',
      rinadokumentID: '456',
      journalpostID: '789',
      rinaNrErGyldig: true,
      rinaNrErSjekket: true,
      rinasaksnummer: '100'
    }
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
        url: sprintf(urls.API_VEDLEGG_DOKUMENT_URL, {rinasaksnummer: mockRinasaksnummer}),
      }))
  })

  it('set()', () => {
    const generatedResult = vedleggActions.set('key', 'value')
    expect(generatedResult).toMatchObject({
      type: types.VEDLEGG_VALUE_SET,
      payload: {
        key: 'key',
        value: 'value'
      }
    })
  })
})
