import * as appActions from 'actions/app'
import * as types from 'constants/actionTypes'
import * as urls from 'constants/urls'
import EKV from 'eessi-kodeverk'
import { call as originalCall } from 'js-fetch-api'
import { Action } from 'redux'

jest.mock('js-fetch-api', () => ({
  call: jest.fn()
}))
const call: jest.Mock = originalCall as unknown as jest.Mock<typeof originalCall>

describe('actions/app', () => {
  afterEach(() => {
    call.mockReset()
  })

  afterAll(() => {
    call.mockRestore()
  })

  it('cleanData()', () => {
    expect(appActions.cleanData())
      .toMatchObject({
        type: types.APP_CLEAN_DATA
      })
  })

  it('getEnheter()', () => {
    appActions.getEnheter()
    expect(call)
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
    expect(call)
      .toBeCalledWith(expect.objectContaining({
        type: {
          request: types.APP_SAKSBEHANDLER_GET_REQUEST,
          success: types.APP_SAKSBEHANDLER_GET_SUCCESS,
          failure: types.APP_SAKSBEHANDLER_GET_FAILURE
        },
        url: urls.API_SAKSBEHANDLER_URL
      }))
  })

  it('getServerinfo()', () => {
    appActions.getServerinfo()
    expect(call)
      .toBeCalledWith(expect.objectContaining({
        type: {
          request: types.APP_SERVERINFO_GET_REQUEST,
          success: types.APP_SERVERINFO_GET_SUCCESS,
          failure: types.APP_SERVERINFO_GET_FAILURE
        },
        url: urls.API_SERVERINFO_URL
      }))
  })

  it('getUtgaarDato()', () => {
    appActions.getUtgaarDato()
    expect(call)
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
    expect(call)
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
    expect(appActions.preload())
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

  it('setStatusParam()', () => {
    const key = 'mockKey'
    const value = 'mockValue'
     expect( appActions.setStatusParam(key, value))
      .toMatchObject({
        type: types.APP_PARAM_SET,
        payload: {key, value}
      })
  })
})
