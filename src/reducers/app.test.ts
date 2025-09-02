import appReducer, { initialAppState } from 'reducers/app'
import * as types from 'constants/actionTypes'

describe('reducers/app', () => {
  it('APP_SAKSBEHANDLER_SUCCESS', () => {
    const mockPayload = 'mockPayload'
    expect(
      appReducer(initialAppState, {
        type: types.APP_SAKSBEHANDLER_SUCCESS,
        payload: mockPayload
      })
    ).toEqual({
      ...initialAppState,
      saksbehandler: mockPayload
    })
  })

  it('APP_SERVERINFO_SUCCESS', () => {
    const mockPayload = 'mockPayload'
    expect(
      appReducer(initialAppState, {
        type: types.APP_SERVERINFO_SUCCESS,
        payload: mockPayload
      })
    ).toEqual({
      ...initialAppState,
      serverinfo: mockPayload
    })
  })

  it('APP_ENHETER_SUCCESS', () => {
    const mockPayload = 'mockPayload'
    expect(
      appReducer(initialAppState, {
        type: types.APP_ENHETER_SUCCESS,
        payload: mockPayload
      })
    ).toEqual({
      ...initialAppState,
      enheter: mockPayload
    })
  })

  interface Session {
    created_at: string;
    ends_at: string;
    timeout_at: string;
    ends_in_seconds: number;
    active: boolean;
    timeout_in_seconds: number;
  }

  interface Tokens {
    expire_at: string;
    refreshed_at: string;
    expire_in_seconds: number;
    next_auto_refresh_in_seconds: number;
    refresh_cooldown: boolean;
    refresh_cooldown_seconds: number;
  }

  interface MockPayload {
    session: Session
    tokens: Tokens
  }

  it('APP_UTGAARDATO_SUCCESS', () => {
    const mockDate: Date = new Date();
    mockDate.setTime(new Date().getTime() + 3600 * 1000 * 8)
    const mockDate2 = new Date();
    mockDate2.setTime(new Date().getTime() + 3600 * 1000 * 10)
    const mockPayload: MockPayload = {
      session: {
        created_at: "2025-08-04T10:43:45.571915622Z",
        ends_at: mockDate2.toISOString(),
        timeout_at: "0001-01-01T00:00:00Z",
        ends_in_seconds: 26417,
        active: true,
        timeout_in_seconds: -1
      },
      tokens: {
        expire_at: mockDate.toISOString(),
        refreshed_at: "2025-08-04T13:23:20.860879157Z",
        expire_in_seconds: 4775,
        next_auto_refresh_in_seconds: 4475,
        refresh_cooldown: true,
        refresh_cooldown_seconds: 52
      }
    }

    expect(
      appReducer(initialAppState, {
        type: types.APP_UTGAARDATO_SUCCESS,
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
