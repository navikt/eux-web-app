import * as uiActions from 'actions/ui'
import * as types from 'constants/actionTypes'

describe('actions/ui', () => {
  it('toggleHighContrast()', () => {
    const generatedResult = uiActions.toggleHighContrast()
    expect(generatedResult).toMatchObject({
      type: types.UI_HIGHCONTRAST_TOGGLE
    })
  })
})
