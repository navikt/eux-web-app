import * as validationActions from 'actions/validation'
import * as types from 'constants/actionTypes'

describe('actions/validation', () => {
  it('resetAllValidation()', () => {
    const generatedResult = validationActions.resetAllValidation()
    expect(generatedResult)
      .toMatchObject({
        type: types.VALIDATION_SET,
        payload: {}
      })
  })

  it('resetValidation()', () => {
    const key = 'mockkey'
    const generatedResult = validationActions.resetValidation(key)
    expect(generatedResult)
      .toMatchObject({
        type: types.VALIDATION_SET,
        payload: {
          key,
          value: undefined
        }
      })
  })

  it('setAllValidation()', () => {
    const newValidation = { foo: 'bar' }
    const generatedResult = validationActions.setAllValidation(newValidation)
    expect(generatedResult)
      .toMatchObject({
        type: types.VALIDATION_ALL_SET,
        payload: newValidation
      })
  })

  it('viewValidation()', () => {
    const generatedResult = validationActions.viewValidation()
    expect(generatedResult)
      .toMatchObject({
        type: types.VALIDATION_VIEW
      })
  })
})
