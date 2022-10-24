import * as appActions from 'actions/app'
import * as types from 'constants/actionTypes'
import * as urls from 'constants/urls'
import * as EKV from '@navikt/eessi-kodeverk'
import { call } from '@navikt/fetch'

jest.mock('@navikt/fetch', () => ({
  call: jest.fn()
}))

Object.defineProperty(window, 'location', {
  value: {
    origin: 'http://mock-localhost:9999',
    pathname: '/mock-pathname'
  }
})

describe('actions/app', () => {
  afterEach(() => {
    (call as jest.Mock).mockReset()
  })

  afterAll(() => {
    (call as jest.Mock).mockRestore()
  })

  it('appReset()', () => {
    expect(appActions.appReset())
      .toMatchObject({
        type: types.APP_RESET
      })
  })

  it('copyToClipboard()', () => {
    const text = 'text'
    expect(appActions.copyToClipboard(text))
      .toMatchObject({
        type: types.APP_CLIPBOARD_COPY,
        payload: text
      })
  })

  it('getEnheter()', () => {
    appActions.getEnheter()
    expect(call)
      .toBeCalledWith(expect.objectContaining({
        type: {
          request: types.APP_ENHETER_REQUEST,
          success: types.APP_ENHETER_SUCCESS,
          failure: types.APP_ENHETER_FAILURE
        },
        url: urls.API_ENHETER_URL
      }))
  })

  it('getSaksbehandler()', () => {
    appActions.getSaksbehandler()
    expect(call)
      .toBeCalledWith(expect.objectContaining({
        type: {
          request: types.APP_SAKSBEHANDLER_REQUEST,
          success: types.APP_SAKSBEHANDLER_SUCCESS,
          failure: types.APP_SAKSBEHANDLER_FAILURE
        },
        url: urls.API_SAKSBEHANDLER_URL
      }))
  })

  it('getServerinfo()', () => {
    appActions.getServerinfo()
    expect(call)
      .toBeCalledWith(expect.objectContaining({
        type: {
          request: types.APP_SERVERINFO_REQUEST,
          success: types.APP_SERVERINFO_SUCCESS,
          failure: types.APP_SERVERINFO_FAILURE
        },
        url: urls.API_SERVERINFO_URL
      }))
  })

  it('getUtgaarDato()', () => {
    appActions.getUtgaarDato()
    expect(call)
      .toBeCalledWith(expect.objectContaining({
        type: {
          request: types.APP_UTGAARDATO_REQUEST,
          success: types.APP_UTGAARDATO_SUCCESS,
          failure: types.APP_UTGAARDATO_FAILURE
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
        context: {
          redirectUrl: 'http://mock-localhost:9999/mock-pathname'
        },
        url: urls.API_REAUTENTISERING_URL
      }))
  })

  it('logMeAgain(name)', () => {
    const name = 'mockname'
    appActions.logMeAgain(name)
    expect(call)
      .toBeCalledWith(expect.objectContaining({
        type: {
          request: types.APP_LOGMEAGAIN_REQUEST,
          success: types.APP_LOGMEAGAIN_SUCCESS,
          failure: types.APP_LOGMEAGAIN_FAILURE
        },
        context: {
          redirectUrl: 'http://mock-localhost:9999/mock-pathname?name=mockname'
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
    expect(appActions.setStatusParam(key, value))
      .toMatchObject({
        type: types.APP_PARAM_SET,
        payload: { key, value }
      })
  })
})
