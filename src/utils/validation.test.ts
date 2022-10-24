import { Validation } from 'declarations/types'
import { filterAllWithNamespace } from 'utils/validation'

describe('utils/validation', () => {
  it('Filters all validations with namespaces, for the original object', () => {
    const validation: Validation = {
      a: { feilmelding: 'something', skjemaelementId: 'something' },
      'a-b': { feilmelding: 'something', skjemaelementId: 'something' },
      'a-b-c': { feilmelding: 'something', skjemaelementId: 'something' },
      b: { feilmelding: 'something', skjemaelementId: 'something' },
      'b-c-d': { feilmelding: 'something', skjemaelementId: 'something' },
      'b-c-e': { feilmelding: 'something', skjemaelementId: 'something' },
      c: { feilmelding: 'something', skjemaelementId: 'something' },
      'c-d': { feilmelding: 'something', skjemaelementId: 'something' },
      'c-d-e': { feilmelding: 'something', skjemaelementId: 'something' },
      'c-d-e-f': { feilmelding: 'something', skjemaelementId: 'something' }
    }

    const namespaces = ['a', 'b-c']

    const expectedValidation = {
      b: { feilmelding: 'something', skjemaelementId: 'something' },
      c: { feilmelding: 'something', skjemaelementId: 'something' },
      'c-d': { feilmelding: 'something', skjemaelementId: 'something' },
      'c-d-e': { feilmelding: 'something', skjemaelementId: 'something' },
      'c-d-e-f': { feilmelding: 'something', skjemaelementId: 'something' }
    }

    const newValidation = filterAllWithNamespace(validation, namespaces)

    expect(newValidation).toEqual(expectedValidation)
    expect(validation).toEqual(expectedValidation)
  })
})
