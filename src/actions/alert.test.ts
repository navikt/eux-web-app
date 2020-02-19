import * as alertActions from 'actions/alert'
import * as types from 'constants/actionTypes'
import { ErrorPayload } from 'eessi-pensjon-ui/dist/declarations/types'

describe('actions/alert', () => {
  it('clientClear()', () => {
    const generatedResult = alertActions.clientClear()
    expect(generatedResult).toMatchObject({
      type: types.ALERT_CLIENT_CLEAR
    })
  })

  it('clientError()', () => {
    const mockPayload: ErrorPayload = {
      error: 'mockError'
    }
    const generatedResult = alertActions.clientError(mockPayload)
    expect(generatedResult).toMatchObject({
      type: types.ALERT_CLIENT_ERROR,
      payload: mockPayload
    })
  })
})
