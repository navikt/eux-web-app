import uiReducer, { initialUiState } from './ui'
import * as types from 'constants/actionTypes'

describe('reducers/ui', () => {

  it('UI_HIGHCONTRAST_TOGGLE', () => {
    expect(
      uiReducer(initialUiState, {
        type: types.UI_HIGHCONTRAST_TOGGLE
      })
    ).toEqual({
      ...initialUiState,
      highContrast: true
    })
  })

  it('UNKNOWN_ACTION', () => {
    expect(
      uiReducer(initialUiState, {
        type: 'UNKNOWN_ACTION'
      })
    ).toEqual(initialUiState)
  })
})
