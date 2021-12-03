import * as types from 'constants/actionTypes'
import arbeidsgiverReducer, { initialArbeidsgiverState } from 'reducers/arbeidsgiver'

describe('reducers/arbeidsgiver', () => {
  it('ARBEIDSPERIODER_GET_SUCCESS', () => {
    const payload = 'mockPayload'
    expect(
      arbeidsgiverReducer(initialArbeidsgiverState, {
        type: types.ARBEIDSPERIODER_GET_SUCCESS,
        payload: payload
      })
    ).toEqual({
      ...initialArbeidsgiverState,
      arbeidsgivere: payload
    })
  })
})
