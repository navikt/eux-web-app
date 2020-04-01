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
      type: types.SERVER_INTERNAL_ERROR,
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
      type: types.SERVER_UNAUTHORIZED_ERROR,
      serverErrorMessage: 'ui:serverAuthenticationError',
      error: 'mockPayload'
    })
  })


  it('UNKNOWN_FAILURE', () => {
    expect(
      alertReducer(initialAlertState, {
        type: 'UNKNOWN/FAILURE',
        payload: {}
      })
    ).toEqual({
      ...initialAlertState,
      clientErrorMessage: 'ui:error',
      clientErrorStatus: 'ERROR',
      type: 'UNKNOWN/FAILURE'
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
