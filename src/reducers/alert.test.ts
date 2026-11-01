import alertReducer, { initialAlertState } from 'reducers/alert'
import * as types from 'constants/actionTypes'

describe('reducers/alert', () => {
  it('ALERT_RESET', () => {
    expect(
      alertReducer(initialAlertState, {
        type: types.ALERT_RESET,
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

  it('PERSON_SEARCH_SUCCESS with 206 shows Warning header as warning banner', () => {
    expect(
      alertReducer(initialAlertState, {
        type: types.PERSON_SEARCH_SUCCESS,
        status: 206,
        headers: { warning: '199 - "Mangler behandlingsnummer"' },
        payload: {}
      } as any)
    ).toEqual({
      ...initialAlertState,
      type: types.PERSON_SEARCH_SUCCESS,
      bannerStatus: 'warning',
      bannerMessage: 'Mangler behandlingsnummer'
    })
  })

  it('JOURNALFOERING_PERSON_SEARCH_SUCCESS with 206 and plain Warning header', () => {
    expect(
      alertReducer(initialAlertState, {
        type: types.JOURNALFOERING_PERSON_SEARCH_SUCCESS,
        status: 206,
        headers: { warning: 'Mangler behandlingsnummer' },
        payload: {}
      } as any).bannerMessage
    ).toEqual('Mangler behandlingsnummer')
  })

  it('PERSON_SEARCH_SUCCESS with 200 leaves state unchanged', () => {
    expect(
      alertReducer(initialAlertState, {
        type: types.PERSON_SEARCH_SUCCESS,
        status: 200,
        headers: { warning: 'ignored' },
        payload: {}
      } as any)
    ).toEqual(initialAlertState)
  })
})
