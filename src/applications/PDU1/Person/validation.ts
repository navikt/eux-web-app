import { validateUtenlandskPins } from 'applications/PDU1/Person/UtenlandskPins/validation'
import { ErrorElement } from 'declarations/app'
import { Pdu1Person } from 'declarations/pd'
import { Validation } from 'declarations/types'
import { TFunction } from 'react-i18next'
import { checkIfNotEmpty } from 'utils/validation'

export interface ValidationPersonProps {
  person: Pdu1Person,
  namespace: string
}

export const validatePerson = (
  v: Validation,
  t: TFunction,
  {
    person,
    namespace
  }: ValidationPersonProps
): boolean => {
  const hasErrors: Array<boolean> = []

  hasErrors.push(checkIfNotEmpty(v, {
    needle: person?.fornavn,
    id: namespace + '-fornavn',
    message: 'validation:noFornavn'
  }))

  hasErrors.push(checkIfNotEmpty(v, {
    needle: person?.etternavn,
    id: namespace + '-etternavn',
    message: 'validation:noEtternavn'
  }))

  hasErrors.push(checkIfNotEmpty(v, {
    needle: person?.foedselsdato,
    id: namespace + '-foedselsdato',
    message: 'validation:noFoedselsdato'
  }))

  hasErrors.push(checkIfNotEmpty(v, {
    needle: person?.kjoenn,
    id: namespace + '-kjoenn',
    message: 'validation:noKjoenn'
  }))

  hasErrors.push(validateUtenlandskPins(v, t, {
    namespace: namespace + '-utenlandskePin',
    utenlandskePins: person?.utenlandskePin
  }))

  const hasError: boolean = hasErrors.find(value => value) !== undefined

  if (hasError) {
    const namespaceBits = namespace.split('-')
    const mainNamespace = namespaceBits[0]
    const personNamespace = mainNamespace + '-' + namespaceBits[1]
    const categoryNamespace = personNamespace + '-' + namespaceBits[2]
    v[mainNamespace] = { feilmelding: 'notnull', skjemaelementId: '' } as ErrorElement
    v[personNamespace] = { feilmelding: 'notnull', skjemaelementId: '' } as ErrorElement
    v[categoryNamespace] = { feilmelding: 'notnull', skjemaelementId: '' } as ErrorElement
  }
  return hasError
}
