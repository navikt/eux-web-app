import * as sakActions from 'actions/sak'
import * as types from 'constants/actionTypes'
import * as urls from 'constants/urls'
import { call as originalCall } from 'js-fetch-api'

import mockArbeidsgiver from 'mocks/arbeidsgiver'
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
    const generatedResult = sakActions.addArbeidsgiver(mockArbeidsgiver)
    expect(generatedResult).toMatchObject({
      type: types.SAK_ARBEIDSGIVER_ADD,
      payload: mockArbeidsgiver
    })
  })

  it('addFamilierelasjoner()', () => {
    const generatedResult = sakActions.addFamilierelasjoner(mockFamilierelasjon)
    expect(generatedResult).toMatchObject({
      type: types.SAK_FAMILIERELASJONER_ADD,
      payload: mockFamilierelasjon
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

  it('getArbeidsperidioder()', () => {
    const mockFnr = '12345678901'
    sakActions.getArbeidsperioder(mockFnr)
    expect(call)
      .toBeCalledWith(expect.objectContaining({
        type: {
          request: types.SAK_ARBEIDSPERIODER_GET_REQUEST,
          success: types.SAK_ARBEIDSPERIODER_GET_SUCCESS,
          failure: types.SAK_ARBEIDSPERIODER_GET_FAILURE
        },
        url: sprintf(urls.API_SAK_ARBEIDSPERIODER_URL, { fnr: mockFnr })
      }))
  })

  it('getFagsaker()', () => {
    const mockFnr = '12345678901'
    const mockSektor = 'mockSektor'
    const mockTema = 'mockTema'
    sakActions.getFagsaker(mockFnr, mockSektor, mockTema)
    expect(call)
      .toBeCalledWith(expect.objectContaining({
        type: {
          request: types.SAK_FAGSAKER_GET_REQUEST,
          success: types.SAK_FAGSAKER_GET_SUCCESS,
          failure: types.SAK_FAGSAKER_GET_FAILURE
        },
        url: sprintf(urls.API_SAK_FAGSAKER_URL, { fnr: mockFnr, sektor: mockSektor, tema: mockTema })
      }))
  })

  it('getInstitusjoner()', () => {
    const mockBuctype = 'P_BUC_MOCK'
    const mockLandkode = 'AA'
    sakActions.getInstitusjoner(mockBuctype, mockLandkode)
    expect(call)
      .toBeCalledWith(expect.objectContaining({
        type: {
          request: types.SAK_INSTITUSJONER_GET_REQUEST,
          success: types.SAK_INSTITUSJONER_GET_SUCCESS,
          failure: types.SAK_INSTITUSJONER_GET_FAILURE
        },
        url: sprintf(urls.API_SAK_INSTITUSJONER_URL, { buctype: mockBuctype, landkode: mockLandkode })
      }))
  })

  it('getLandkoder()', () => {
    const mockBuctype = 'P_BUC_MOCK'
    sakActions.getLandkoder(mockBuctype)
    expect(call)
      .toBeCalledWith(expect.objectContaining({
        type: {
          request: types.SAK_LANDKODER_GET_REQUEST,
          success: types.SAK_LANDKODER_GET_SUCCESS,
          failure: types.SAK_LANDKODER_GET_FAILURE
        },
        url: sprintf(urls.API_SAK_LANDKODER_URL, { buctype: mockBuctype })
      }))
  })

  it('getPerson()', () => {
    const mockFnr = '12345678901'
    sakActions.getPerson(mockFnr)
    expect(call)
      .toBeCalledWith(expect.objectContaining({
        type: {
          request: types.SAK_PERSON_GET_REQUEST,
          success: types.SAK_PERSON_GET_SUCCESS,
          failure: types.SAK_PERSON_GET_FAILURE
        },
        url: sprintf(urls.API_SAK_PERSON_URL, { fnr: mockFnr })
      }))
  })

  it('getPersonRelated()', () => {
    const mockFnr = '12345678901'
    sakActions.getPersonRelated(mockFnr)
    expect(call)
      .toBeCalledWith(expect.objectContaining({
        type: {
          request: types.SAK_PERSON_RELATERT_GET_REQUEST,
          success: types.SAK_PERSON_RELATERT_GET_SUCCESS,
          failure: types.SAK_PERSON_RELATERT_GET_FAILURE
        },
        url: sprintf(urls.API_SAK_PERSON_URL, { fnr: mockFnr })
      }))
  })

  it('removeArbeidsgiver()', () => {
    const generatedResult = sakActions.removeArbeidsgiver(mockArbeidsgiver)
    expect(generatedResult).toMatchObject({
      type: types.SAK_ARBEIDSGIVER_REMOVE,
      payload: mockArbeidsgiver
    })
  })

  it('removeFamilierelasjoner()', () => {
    const generatedResult = sakActions.removeFamilierelasjoner(mockFamilierelasjon)
    expect(generatedResult).toMatchObject({
      type: types.SAK_FAMILIERELASJONER_REMOVE,
      payload: mockFamilierelasjon
    })
  })

  it('resetPerson()', () => {
    const generatedResult = sakActions.resetPerson()
    expect(generatedResult)
      .toMatchObject({
        type: types.SAK_PERSON_RESET
      })
  })

  it('resetPersonRelatert()', () => {
    const generatedResult = sakActions.resetPersonRelatert()
    expect(generatedResult)
      .toMatchObject({
        type: types.SAK_PERSON_RELATERT_RESET
      })
  })

  it('setProperty()', () => {
    const generatedResult = sakActions.setProperty('key', 'value')
    expect(generatedResult).toMatchObject({
      type: types.SAK_PROPERTY_SET,
      payload: {
        key: 'key',
        value: 'value'
      }
    })
  })
})
