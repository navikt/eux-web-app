import * as sakActions from 'actions/sak'
import * as types from 'constants/actionTypes'
import * as urls from 'constants/urls'
import { call as originalCall } from '@navikt/fetch'
import mockArbeidsperiode from 'mocks/arbeidsperioder/arbeidsperiode'
import mockFamilierelasjon from 'mocks/familierelasjon'
import mockOpprettSak from 'mocks/opprettSak'

jest.mock('@navikt/fetch', () => ({
  call: jest.fn()
}))
const call: jest.Mock = originalCall as unknown as jest.Mock<typeof originalCall>
const sprintf = require('sprintf-js').sprintf

describe('actions/sak', () => {
  afterEach(() => {
    call.mockReset()
  })

  afterAll(() => {
    call.mockRestore()
  })

  it('addArbeidsperiode()', () => {
    expect(sakActions.addArbeidsperiode(mockArbeidsperiode)).toMatchObject({
      type: types.SAK_ARBEIDSPERIODER_ADD,
      payload: mockArbeidsperiode
    })
  })

  it('addFamilierelasjoner()', () => {
    expect(sakActions.addFamilierelasjoner(mockFamilierelasjon)).toMatchObject({
      type: types.SAK_FAMILIERELASJONER_ADD,
      payload: mockFamilierelasjon
    })
  })

  it('sakReset()', () => {
    expect(sakActions.sakReset()).toMatchObject({
      type: types.SAK_RESET
    })
  })

  it('createSak()', () => {
    sakActions.createSak(mockOpprettSak)
    expect(call)
      .toBeCalledWith(expect.objectContaining({
        method: 'POST',
        type: {
          request: types.SAK_SEND_REQUEST,
          success: types.SAK_SEND_SUCCESS,
          failure: types.SAK_SEND_FAILURE
        },
        url: sprintf(urls.API_SAK_SEND_URL)
      }))
  })

  it('getFagsaker()', () => {
    const fnr = '12345678901'
    const sektor = 'mockSektor'
    const tema = 'mockTema'
    sakActions.getFagsaker(fnr, sektor, tema)
    expect(call)
      .toBeCalledWith(expect.objectContaining({
        type: {
          request: types.SAK_FAGSAKER_REQUEST,
          success: types.SAK_FAGSAKER_SUCCESS,
          failure: types.SAK_FAGSAKER_FAILURE
        },
        url: sprintf(urls.API_GET_FAGSAKER_URL, { fnr, tema })
      }))
  })

  it('getInstitusjoner()', () => {
    const buctype = 'P_BUC_MOCK'
    sakActions.getInstitusjoner(buctype)
    expect(call)
      .toBeCalledWith(expect.objectContaining({
        type: {
          request: types.SAK_INSTITUSJONER_REQUEST,
          success: types.SAK_INSTITUSJONER_SUCCESS,
          failure: types.SAK_INSTITUSJONER_FAILURE
        },
        url: sprintf(urls.API_ALL_INSTITUSJONER_URL, { buctype })
      }))
  })

  it('removeArbeidsperiode()', () => {
    expect(sakActions.removeArbeidsperiode(mockArbeidsperiode)).toMatchObject({
      type: types.SAK_ARBEIDSPERIODER_REMOVE,
      payload: mockArbeidsperiode
    })
  })

  it('removeFamilierelasjoner()', () => {
    expect(sakActions.removeFamilierelasjoner(mockFamilierelasjon)).toMatchObject({
      type: types.SAK_FAMILIERELASJONER_REMOVE,
      payload: mockFamilierelasjon
    })
  })

  it('resetFagsaker()', () => {
    expect(sakActions.resetFagsaker())
      .toMatchObject({
        type: types.SAK_FAGSAKER_RESET
      })
  })

  it('resetSentSed()', () => {
    expect(sakActions.resetSentSed())
      .toMatchObject({
        type: types.SAK_SEND_RESET
      })
  })

  it('setProperty()', () => {
    const key = 'key'
    const value = 'value'
    expect(sakActions.setProperty(key, value)).toMatchObject({
      type: types.SAK_PROPERTY_SET,
      payload: { key, value }
    })
  })
})
