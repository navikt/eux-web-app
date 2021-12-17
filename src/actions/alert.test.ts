import * as alertActions from 'actions/alert'
import * as types from 'constants/actionTypes'
import { ErrorPayload } from 'js-fetch-api'

describe('actions/alert', () => {
  it('alertClear()', () => {
   expect(alertActions.alertClear()).toMatchObject({
      type: types.ALERT_CLEAR
    })
  })

  it('setAlertError()', () => {
    const payload: ErrorPayload = {
      error: 'mockError'
    }
    expect(alertActions.setAlertError(payload)).toMatchObject({
      type: types.ALERT_ERROR_SET,
      payload: payload
    })
  })
})
