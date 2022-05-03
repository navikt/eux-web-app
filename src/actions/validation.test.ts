import * as validationActions from 'actions/validation'
import * as types from 'constants/actionTypes'

describe('actions/validation', () => {
  it('resetValidation()', () => {
    const generatedResult = validationActions.resetValidation()
    expect(generatedResult)
      .toMatchObject({
        type: types.VALIDATION_RESET,
        payload: {}
      })
  })

  it('resetValidation()', () => {
    const key = 'mockkey'
    const generatedResult = validationActions.resetValidation(key)
    expect(generatedResult)
      .toMatchObject({
        type: types.VALIDATION_RESET,
        payload: {
          namespace: key
        }
      })
  })

  it('setValidation()', () => {
    const newValidation = { foo: 'bar' }
    const generatedResult = validationActions.setValidation(newValidation)
    expect(generatedResult)
      .toMatchObject({
        type: types.VALIDATION_SET,
        payload: newValidation
      })
  })
})
