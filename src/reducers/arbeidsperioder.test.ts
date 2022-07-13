import * as types from 'constants/actionTypes'
import arbeidsperioderReducer, { initialArbeidsperioderState } from 'reducers/arbeidsperioder'

describe('reducers/arbeidsperioder', () => {
  it('ARBEIDSPERIODER_SUCCESS', () => {
    const payload = 'mockPayload'
    expect(
      arbeidsperioderReducer(initialArbeidsperioderState, {
        type: types.ARBEIDSPERIODER_SUCCESS,
        payload
      })
    ).toEqual(payload)
  })
})
