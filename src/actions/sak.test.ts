import * as EKV from 'eessi-kodeverk'
import * as sakActions from 'actions/sak'
import * as types from 'constants/actionTypes'
import * as urls from 'constants/urls'
import { realCall as originalCall } from 'eessi-pensjon-ui/dist/api'
jest.mock('eessi-pensjon-ui/dist/api', () => ({
  realCall: jest.fn()
}))
const realCall: jest.Mock = originalCall as jest.Mock<typeof originalCall>
const sprintf = require('sprintf-js').sprintf

describe('actions/app', () => {
  afterEach(() => {
    realCall.mockReset()
  })

  afterAll(() => {
    realCall.mockRestore()
  })

  it('getArbeidsforhold()', () => {
    const mockFnr = '12345678901'
    sakActions.getArbeidsforhold(mockFnr)
    expect(realCall)
      .toBeCalledWith(expect.objectContaining({
        type: {
          request: types.SAK_ARBEIDSFORHOLD_GET_REQUEST,
          success: types.SAK_ARBEIDSFORHOLD_GET_SUCCESS,
          failure: types.SAK_ARBEIDSFORHOLD_GET_FAILURE
        },
        url: sprintf(urls.API_SAK_ARBEIDSFORHOLD_URL, { fnr: mockFnr })
      }))
  })

  it('getFagsaker()', () => {
    const mockFnr = '12345678901'
    const mockSektor = 'mockSektor'
    const mockTema = 'mockTema'
    sakActions.getFagsaker(mockFnr, mockSektor, mockTema)
    expect(realCall)
      .toBeCalledWith(expect.objectContaining({
        type: {
          request: types.SAK_FAGSAKER_GET_REQUEST,
          success: types.SAK_FAGSAKER_GET_SUCCESS,
          failure: types.SAK_FAGSAKER_GET_FAILURE
        },
        url: sprintf(urls.API_SAK_FAGSAKER_URL, { fnr: mockFnr, sektor: mockSektor, tema: mockTema }),
      }))
  })

  it('getInstitusjoner()', () => {
    const mockBuctype = 'P_BUC_MOCK'
    const mockLandkode = 'AA'
    sakActions.getInstitusjoner(mockBuctype, mockLandkode)
    expect(realCall)
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
    expect(realCall)
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
    expect(realCall)
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
    expect(realCall)
      .toBeCalledWith(expect.objectContaining({
        type: {
          request: types.SAK_PERSON_RELATERT_GET_REQUEST,
          success: types.SAK_PERSON_RELATERT_GET_SUCCESS,
          failure: types.SAK_PERSON_RELATERT_GET_FAILURE
        },
        url: sprintf(urls.API_SAK_PERSON_URL, { fnr: mockFnr })
      }))
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

  it('createSak()', () => {
    const mockData = {
      buctype: 'P_BUC_MOCK',
      fnr: '12354678901',
      landKode: 'AA',
      institusjonsID: 'NAV',
      saksID: '123',
      sedtype: 'SED_MOCK',
      sektor: 'SEKTOR_MOCK',
      arbeidsforhold: [{
        ansettelsesPeriode: {
          fom: '01.01.1970',
          tom: '01.01.2000',
        },
        arbeidsforholdIDnav: 123,
        navn: 'navn',
        orgnr: '123456789'
      }],
      familierelasjoner: [{
        fnr: '12345678901',
        fdato: '01.01.1970',
        nasjonalitet: 'Norge',
        rolle: 'samboer',
        kjoenn: 'M',
        fornavn: 'Ola',
        etternavn: 'Nordmann'
      }]
    }

    sakActions.createSak(mockData)
    expect(realCall)
      .toBeCalledWith(expect.objectContaining({
        method: 'POST',
        type: {
          request: types.SAK_SEND_POST_REQUEST,
          success: types.SAK_SEND_POST_SUCCESS,
          failure: types.SAK_SEND_POST_FAILURE
        },
        url: sprintf(urls.API_SAK_SEND_POST_URL),
        payload: {
          buctype: 'P_BUC_MOCK',
          fnr: '12354678901',
          landKode: 'AA',
          institusjonsID: 'NAV',
          saksID: '123',
          sedtype: 'SED_MOCK',
          sektor: 'SEKTOR_MOCK',
          tilleggsopplysninger: {
            arbeidsforhold: [{
              ansettelsesPeriode: {
                fom: '01.01.1970',
                tom: '01.01.2000',
              },
              arbeidsforholdIDnav: 123,
              navn: 'navn',
              orgnr: '123456789'
            }],
            familierelasjoner: [{
              fnr: '12345678901',
              fdato: '1970-01-01',
              nasjonalitet: 'Norge',
              rolle: 'samboer',
              kjoenn: 'M',
              fornavn: 'Ola',
              etternavn: 'Nordmann'
            }]
          }
        }
      }))
  })

  it('preload()', () => {
    const generatedResult = sakActions.preload()
    expect(generatedResult)
      .toMatchObject({
        type: types.SAK_PRELOAD,
        payload: {
          ...EKV.KTObjects,
          kodemaps: {
            ...EKV.Kodemaps
          }
        }
      })
  })
})

