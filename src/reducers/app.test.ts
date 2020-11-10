import appReducer, { initialAppState } from 'reducers/app'
import * as types from 'constants/actionTypes'

describe('reducers/app', () => {
  it('APP_SAKSBEHANDLER_GET_SUCCESS', () => {
    const mockPayload = 'mockPayload'
    expect(
      appReducer(initialAppState, {
        type: types.APP_SAKSBEHANDLER_GET_SUCCESS,
        payload: mockPayload
      })
    ).toEqual({
      ...initialAppState,
      saksbehandler: mockPayload
    })
  })

  it('APP_SERVERINFO_GET_SUCCESS', () => {
    const mockPayload = 'mockPayload'
    expect(
      appReducer(initialAppState, {
        type: types.APP_SERVERINFO_GET_SUCCESS,
        payload: mockPayload
      })
    ).toEqual({
      ...initialAppState,
      serverinfo: mockPayload
    })
  })

  it('APP_ENHETER_GET_SUCCESS', () => {
    const mockPayload = 'mockPayload'
    expect(
      appReducer(initialAppState, {
        type: types.APP_ENHETER_GET_SUCCESS,
        payload: mockPayload
      })
    ).toEqual({
      ...initialAppState,
      enheter: mockPayload
    })
  })

  it('APP_UTGAARDATO_GET_SUCCESS', () => {
    const mockDate = new Date('2020-01-01 10:00:00')
    const mockPayload = {
      utgaarDato: mockDate
    }
    expect(
      appReducer(initialAppState, {
        type: types.APP_UTGAARDATO_GET_SUCCESS,
        payload: mockPayload
      })
    ).toEqual({
      ...initialAppState,
      expirationTime: mockDate
    })
  })

  it('APP_LOGMEAGAIN_SUCCESS', () => {
    const mockPayload = {
      Location: 'http://mockurl.no'
    }
    Object.defineProperty(window, 'location', {
      value: {
        ...window.location,
        reload: jest.fn()
      }
    })
    appReducer(initialAppState, {
      type: types.APP_LOGMEAGAIN_SUCCESS,
      payload: mockPayload
    })
    expect(window.location.href).toEqual(mockPayload.Location)
  })

  it('APP_PRELOAD', () => {
    const mockPayload = {
      foo: 'bar'
    }

    expect(
      appReducer(initialAppState, {
        type: types.APP_LOGMEAGAIN_SUCCESS,
        payload: mockPayload
      })
    ).toEqual({
      ...initialAppState,
      foo: 'bar'
    })
  })
})




