import * as alertActions from 'actions/alert'
import * as types from 'constants/actionTypes'

describe('actions/alert', () => {
  it('alertClear()', () => {
    expect(alertActions.alertClear()).toMatchObject({
      type: types.ALERT_CLEAR
    })
  })

  it('alertFailure()', () => {
    const payload = 'payload'
    expect(alertActions.alertFailure(payload)).toMatchObject({
      type: types.ALERT_FAILURE,
      payload: {
        message: payload
      }
    })
  })

  it('alertWarning()', () => {
    const payload = 'payload'
    expect(alertActions.alertWarning(payload)).toMatchObject({
      type: types.ALERT_WARNING,
      payload: {
        message: payload
      }
    })
  })

  it('alertSuccess()', () => {
    const payload = 'payload'
    expect(alertActions.alertSuccess(payload)).toMatchObject({
      type: types.ALERT_SUCCESS,
      payload: {
        message: payload
      }
    })
  })
})
