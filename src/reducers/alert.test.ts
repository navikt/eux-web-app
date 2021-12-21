import alertReducer, { initialAlertState } from 'reducers/alert'
import * as types from 'constants/actionTypes'

describe('reducers/alert', () => {
  it('ALERT_CLEAR', () => {
    expect(
      alertReducer(initialAlertState, {
        type: types.ALERT_CLEAR,
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
      bannerMessage: 'message:error-serverInternalError',
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
      bannerMessage: 'message:error-serverAuthenticationError',
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
      stripeMessage: 'label:error',
      stripeStatus: 'error',
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
