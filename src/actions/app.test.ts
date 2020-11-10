import * as appActions from 'actions/app'
import * as types from 'constants/actionTypes'
import * as urls from 'constants/urls'
import EKV from 'eessi-kodeverk'
import { realCall as originalCall } from 'js-fetch-api'
import { Action } from 'redux'

jest.mock('js-fetch-api', () => ({
  realCall: jest.fn()
}))
const realCall: jest.Mock = originalCall as unknown as jest.Mock<typeof originalCall>

describe('actions/app', () => {
  afterEach(() => {
    realCall.mockReset()
  })

  afterAll(() => {
    realCall.mockRestore()
  })

  it('cleanData()', () => {
    const generatedResult: Action = appActions.cleanData()
    expect(generatedResult)
      .toMatchObject({
        type: types.APP_CLEAN_DATA
      })
  })

  it('getEnheter()', () => {
    appActions.getEnheter()
    expect(realCall)
      .toBeCalledWith(expect.objectContaining({
        type: {
          request: types.APP_ENHETER_GET_REQUEST,
          success: types.APP_ENHETER_GET_SUCCESS,
          failure: types.APP_ENHETER_GET_FAILURE
        },
        url: urls.API_ENHETER_URL
      }))
  })

  it('getSaksbehandler()', () => {
    appActions.getSaksbehandler()
    expect(realCall)
      .toBeCalledWith(expect.objectContaining({
        type: {
          request: types.APP_SAKSBEHANDLER_GET_REQUEST,
          success: types.APP_SAKSBEHANDLER_GET_SUCCESS,
          failure: types.APP_SAKSBEHANDLER_GET_FAILURE
        },
        url: urls.API_SAKSBEHANDLER_URL
      }))
  })

  it('getUtgaarDato()', () => {
    appActions.getUtgaarDato()
    expect(realCall)
      .toBeCalledWith(expect.objectContaining({
        type: {
          request: types.APP_UTGAARDATO_GET_REQUEST,
          success: types.APP_UTGAARDATO_GET_SUCCESS,
          failure: types.APP_UTGAARDATO_GET_FAILURE
        },
        url: urls.API_UTGAARDATO_URL
      }))
  })

  it('logMeAgain()', () => {
    appActions.logMeAgain()
    expect(realCall)
      .toBeCalledWith(expect.objectContaining({
        type: {
          request: types.APP_LOGMEAGAIN_REQUEST,
          success: types.APP_LOGMEAGAIN_SUCCESS,
          failure: types.APP_LOGMEAGAIN_FAILURE
        },
        url: urls.API_REAUTENTISERING_URL
      }))
  })

  it('preload()', () => {
    const generatedResult = appActions.preload()
    expect(generatedResult)
      .toMatchObject({
        type: types.APP_PRELOAD,
        payload: {
          ...EKV.KTObjects,
          kodemaps: {
            ...EKV.Kodemaps
          }
        }
      })
  })
})
