import alertReducer, { initialAlertState } from './alert'
import * as types from 'constants/actionTypes'

describe('reducers/alert', () => {
  it('ALERT_CLIENT_CLEAR', () => {
    expect(
      alertReducer(initialAlertState, {
        type: types.ALERT_CLIENT_CLEAR,
        payload: 'mockPayload'
      })
    ).toEqual({
      ...initialAlertState
    })
  })

  it('SERVER_INTERNAL_ERROR', () => {
    expect(
      alertReducer(initialAlertState, {
        type: types.SERVER_INTERNAL_ERROR,
        payload: {
          error: 'mockPayload'
        }
      })
    ).toEqual({
      ...initialAlertState,
      serverErrorMessage: 'ui:serverInternalError',
      error: 'mockPayload'
    })
  })

  it('SERVER_UNAUTHORIZED_ERROR', () => {
    expect(
      alertReducer(initialAlertState, {
        type: types.SERVER_UNAUTHORIZED_ERROR,
        payload: {
          error: 'mockPayload'
        }
      })
    ).toEqual({
      ...initialAlertState,
      serverErrorMessage: 'ui:serverAuthenticationError',
      error: 'mockPayload'
    })
  })

  it('SOMETHING_ERROR', () => {
    expect(
      alertReducer(initialAlertState, {
        type: 'SOMETHING/ERROR',
        payload: {
          error: 'mockPayload'
        }
      })
    ).toEqual({
      ...initialAlertState,
      serverErrorMessage: 'ui:serverInternalError',
      error: 'mockPayload'
    })
  })

  it('UNKNOWN_ACTION', () => {
    expect(
      alertReducer(initialAlertState, {
        type: 'UNKNOWN_ACTION'
      })
    ).toEqual({
      ...initialAlertState
    })
  })
})
