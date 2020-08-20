import appReducer, { initialAppState } from './app'
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
})
