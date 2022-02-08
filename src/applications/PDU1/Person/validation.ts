import { validateAdresse } from 'applications/PDU1/Person/Adresse/validation'
import { validateUtenlandskPins } from 'components/UtenlandskPins/validation'
import { Pdu1Person } from 'declarations/pd'
import { Pin } from 'declarations/sed'
import { Validation } from 'declarations/types'
import { TFunction } from 'react-i18next'
import { checkIfNotEmpty, propagateError } from 'utils/validation'
import { validateStatsborgerskaper } from './Statsborgerskap/validation'

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
    utenlandskePins: person?.utenlandskePin?.map((pin: string) => {
      const els = pin.split(/\s+/)
      return {
        land: els[0],
        identifikator: els[1]
      } as Pin
    })
  }))

  hasErrors.push(validateStatsborgerskaper(v, t, { statsborgerskaper: person.statsborgerskap, namespace: namespace + '-statsborgerskap' }))

  hasErrors.push(validateAdresse(v, t, { adresse: person.adresse, keyForCity: 'poststed', keyforZipCode: 'postnr', namespace: namespace + '-adresse' }))

  const hasError: boolean = hasErrors.find(value => value) !== undefined
  if (hasError) propagateError(v, namespace)
  return hasError
}
