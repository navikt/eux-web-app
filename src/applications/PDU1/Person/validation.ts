import { validateAdresse } from 'applications/PDU1/Person/Adresse/validation'
import { validateUtenlandskPins } from 'components/UtenlandskPins/validation'
import { Pdu1Person } from 'declarations/pd'
import { Pin } from 'declarations/sed'
import { Validation } from 'declarations/types'
import { checkIfNotEmpty } from 'utils/validation'
import { validateStatsborgerskaper } from './Statsborgerskap/validation'

export interface ValidationPersonProps {
  person: Pdu1Person | undefined
}

export const validatePerson = (
  v: Validation,
  namespace: string,
  {
    person
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

  hasErrors.push(validateUtenlandskPins(v, namespace + '-utenlandskePin', {
    utenlandskePins: person?.utenlandskePin?.map((pin: string) => {
      const els = pin.split(/\s+/)
      return {
        land: els[0],
        identifikator: els[1]
      } as Pin
    })
  }))

  hasErrors.push(validateStatsborgerskaper(v, namespace + '-statsborgerskap', { statsborgerskaper: person?.statsborgerskap }))

  hasErrors.push(validateAdresse(v, namespace + '-adresse', { adresse: person?.adresse, keyForCity: 'poststed', keyforZipCode: 'postnr' }))

  return hasErrors.find(value => value) !== undefined
}
