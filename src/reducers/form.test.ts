import formReducer, { initialFormState } from './form'
import * as types from 'constants/actionTypes'

describe('reducers/app', () => {
  it('APP_CLEAN_DATA', () => {
    expect(
      formReducer({
        ...initialFormState,
        fnr: '123'
      }, {
        type: types.APP_CLEAN_DATA
      })
    ).toEqual(initialFormState)
  })

  it('SAK_PERSON_RESET', () => {
    expect(
      formReducer({
        ...initialFormState,
        fnr: '123'
      }, {
        type: types.SAK_PERSON_RESET
      })
    ).toEqual(initialFormState)
  })

  it('FORM_VALUE_SET', () => {
    expect(
      formReducer(initialFormState,
      {
        type: types.FORM_VALUE_SET,
        payload: {
          key: 'foo',
          value: 'bar'
        }
      })
    ).toEqual({
      ...initialFormState,
      foo: 'bar'
    })
  })

  it('FORM_ARBEIDSFORHOLD_ADD', () => {
    expect(
      formReducer({
        ...initialFormState,
        arbeidsforhold: [1]
      }, {
          type: types.FORM_ARBEIDSFORHOLD_ADD,
          payload: 2
        })
    ).toEqual({
      ...initialFormState,
      arbeidsforhold: [1, 2]
    })
  })

  it('FORM_ARBEIDSFORHOLD_REMOVE', () => {
    expect(
      formReducer({
        ...initialFormState,
        arbeidsforhold: [1, 2]
      }, {
        type: types.FORM_ARBEIDSFORHOLD_REMOVE,
        payload: 2
      })
    ).toEqual({
      ...initialFormState,
      arbeidsforhold: [1]
    })
  })

  it('FORM_FAMILIERELASJONER_ADD', () => {
    expect(
      formReducer({
        ...initialFormState,
        familierelasjoner: [{ fnr: 1}]
      }, {
        type: types.FORM_FAMILIERELASJONER_ADD,
        payload: {fnr: 2}
      })
    ).toEqual({
      ...initialFormState,
      familierelasjoner: [{fnr: 1}, {fnr: 2}]
    })
  })

  it('FORM_FAMILIERELASJONER_REMOVE', () => {
    expect(
      formReducer({
        ...initialFormState,
        familierelasjoner: [{fnr: 1}, {fnr: 2}]
      }, {
        type: types.FORM_FAMILIERELASJONER_REMOVE,
        payload: {fnr: 2}
      })
    ).toEqual({
      ...initialFormState,
      familierelasjoner: [{fnr: 1}]
    })
  })
})
