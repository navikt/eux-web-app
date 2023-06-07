import * as pdu1Actions from 'actions/pdu1'
import * as types from 'constants/actionTypes'
import * as urls from 'constants/urls'
import { PDU1 } from 'declarations/pd'
import { call as originalCall } from '@navikt/fetch'
const sprintf = require('sprintf-js').sprintf

jest.mock('@navikt/fetch', () => ({ call: jest.fn() }))
const call = originalCall as jest.Mock<typeof originalCall>

describe('actions/pdu1', () => {
  afterEach(() => {
    call.mockReset()
  })

  afterAll(() => {
    call.mockRestore()
  })

  it('jornalførePdu1()', () => {
    const payload = { saksreferanse: '123' } as PDU1
    pdu1Actions.jornalførePdu1(payload)
    expect(call)
      .toBeCalledWith(expect.objectContaining({
        method: 'POST',
        type: {
          request: types.PDU1_JOURNALFØRE_REQUEST,
          success: types.PDU1_JOURNALFØRE_SUCCESS,
          failure: types.PDU1_JOURNALFØRE_FAILURE
        },
        url: urls.PDU1_JOURNALPOST_URL,
        body: payload
      }))
  })

  it('getFagsaker()', () => {
    const fnr = '123'
    const sektor = '456'
    const tema = '789'
    pdu1Actions.getFagsaker(fnr, sektor, tema)
    expect(call)
      .toBeCalledWith(expect.objectContaining({
        type: {
          request: types.PDU1_FAGSAKER_REQUEST,
          success: types.PDU1_FAGSAKER_SUCCESS,
          failure: types.PDU1_FAGSAKER_FAILURE
        },
        url: sprintf(urls.API_GET_FAGSAKER_URL, { fnr, tema })
      }))
  })

  it('previewPdu1()', () => {
    const payload = { saksreferanse: '123' } as PDU1
    pdu1Actions.previewPdu1(payload)
    expect(call)
      .toBeCalledWith(expect.objectContaining({
        method: 'POST',
        responseType: 'pdf',
        type: {
          request: types.PDU1_PREVIEW_REQUEST,
          success: types.PDU1_PREVIEW_SUCCESS,
          failure: types.PDU1_PREVIEW_FAILURE
        },
        url: urls.PDU1_PREVIEW_URL,
        body: payload
      }))
  })

  it('resetPreviewPdu1()', () => {
    expect(pdu1Actions.resetPreviewPdu1()).toMatchObject({
      type: types.PDU1_PREVIEW_RESET
    })
  })

  it('resetJornalførePdu1()', () => {
    expect(pdu1Actions.resetJornalførePdu1()).toMatchObject({
      type: types.PDU1_JOURNALFØRE_RESET
    })
  })

  it('updatePdu1()', () => {
    const needle = 'foo'
    const value = { bar: '123' }
    expect(pdu1Actions.updatePdu1(needle, value)).toMatchObject({
      type: types.PDU1_UPDATE,
      payload: { needle, value }
    })
  })
})
