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
      payload: payload
    })
  })
})
