import * as formActions from 'actions/form'
import * as types from 'constants/actionTypes'
import { Arbeidsforholdet } from 'declarations/types'

describe('actions/form', () => {

  const mockArbeidsforhold: Arbeidsforholdet = {
    ansettelsesPeriode: {
      fom: '01.01.1970',
      tom: '01.01.2000',
    },
    arbeidsforholdIDnav: 123,
    navn: 'navn',
    orgnr: '123456789'
  }

  const mockFamilierelasjon = {
    fnr: '12345678901',
    fdato: '01.01.1970',
    nasjonalitet: 'Norge',
    rolle: 'samboer',
    kjoenn: 'M',
    fornavn: 'Ola',
    etternavn: 'Nordmann'
  }

  it('set()', () => {
    const generatedResult = formActions.set('key', 'value')
    expect(generatedResult).toMatchObject({
      type: types.FORM_VALUE_SET,
      payload: {
        key: 'key',
        value: 'value'
      }
    })
  })

  it('addArbeidsforhold()', () => {
    const generatedResult = formActions.addArbeidsforhold(mockArbeidsforhold)
    expect(generatedResult).toMatchObject({
      type: types.FORM_ARBEIDSFORHOLD_ADD,
      payload: mockArbeidsforhold
    })
  })

  it('removeArbeidsforhold()', () => {
    const generatedResult = formActions.removeArbeidsforhold(mockArbeidsforhold)
    expect(generatedResult).toMatchObject({
      type: types.FORM_ARBEIDSFORHOLD_REMOVE,
      payload: mockArbeidsforhold
    })
  })

  it('addFamilierelasjoner()', () => {
    const generatedResult = formActions.addFamilierelasjoner(mockFamilierelasjon)
    expect(generatedResult).toMatchObject({
      type: types.FORM_FAMILIERELASJONER_ADD,
      payload: mockFamilierelasjon
    })
  })

  it('removeFamilierelasjoner()', () => {
    const generatedResult = formActions.removeFamilierelasjoner(mockFamilierelasjon)
    expect(generatedResult).toMatchObject({
      type: types.FORM_FAMILIERELASJONER_REMOVE,
      payload: mockFamilierelasjon
    })
  })
})
