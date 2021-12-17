import * as sakActions from 'actions/sak'
import * as types from 'constants/actionTypes'
import * as urls from 'constants/urls'
import { call as originalCall } from 'js-fetch-api'
import mockArbeidsgiver from 'mocks/arbeidsgiver/arbeidsgiver'
import mockFamilierelasjon from 'mocks/familierelasjon'
import mockOpprettSak from 'mocks/opprettSak'

jest.mock('js-fetch-api', () => ({
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

  it('addArbeidsgiver()', () => {
    expect(sakActions.addArbeidsgiver(mockArbeidsgiver)).toMatchObject({
      type: types.SAK_ARBEIDSGIVER_ADD,
      payload: mockArbeidsgiver
    })
  })

  it('addFamilierelasjoner()', () => {
    expect(sakActions.addFamilierelasjoner(mockFamilierelasjon)).toMatchObject({
      type: types.SAK_FAMILIERELASJONER_ADD,
      payload: mockFamilierelasjon
    })
  })

  it('cleanData()', () => {
    expect(sakActions.cleanData()).toMatchObject({
      type: types.SAK_CLEAN_DATA
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
          request: types.SAK_FAGSAKER_GET_REQUEST,
          success: types.SAK_FAGSAKER_GET_SUCCESS,
          failure: types.SAK_FAGSAKER_GET_FAILURE
        },
        url: sprintf(urls.API_FAGSAKER_QUERY_URL, { fnr, sektor, tema })
      }))
  })

  it('getInstitusjoner()', () => {
    const buctype = 'P_BUC_MOCK'
    const landkode = 'AA'
    sakActions.getInstitusjoner(buctype, landkode)
    expect(call)
      .toBeCalledWith(expect.objectContaining({
        type: {
          request: types.SAK_INSTITUSJONER_GET_REQUEST,
          success: types.SAK_INSTITUSJONER_GET_SUCCESS,
          failure: types.SAK_INSTITUSJONER_GET_FAILURE
        },
        url: sprintf(urls.API_INSTITUSJONER_URL, { buctype, landkode })
      }))
  })

  it('getLandkoder()', () => {
    const buctype = 'P_BUC_MOCK'
    sakActions.getLandkoder(buctype)
    expect(call)
      .toBeCalledWith(expect.objectContaining({
        type: {
          request: types.SAK_LANDKODER_GET_REQUEST,
          success: types.SAK_LANDKODER_GET_SUCCESS,
          failure: types.SAK_LANDKODER_GET_FAILURE
        },
        url: sprintf(urls.API_LANDKODER_URL, { buctype })
      }))
  })

  it('removeArbeidsgiver()', () => {
    expect(sakActions.removeArbeidsgiver(mockArbeidsgiver)).toMatchObject({
      type: types.SAK_ARBEIDSGIVER_REMOVE,
      payload: mockArbeidsgiver
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

  it('setProperty()', () => {
    const key = 'key'
    const value = 'value'
    expect(sakActions.setProperty(key, value)).toMatchObject({
      type: types.SAK_PROPERTY_SET,
      payload: {key, value}
    })
  })
})
