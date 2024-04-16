import uiReducer, { initialUiState } from './ui'

describe('reducers/ui', () => {
  it('UNKNOWN_ACTION', () => {
    expect(
      uiReducer(initialUiState, {
        type: 'UNKNOWN_ACTION'
      })
    ).toEqual(initialUiState)
  })
})
