import { validateAdresse } from 'applications/PDU1/Person/Adresse/validation'
import {Avsender} from 'declarations/pd'
import { Validation } from 'declarations/types'
import { checkIfNotEmpty } from 'utils/validation'

export interface ValidationAvsenderProps {
  avsender: Avsender | undefined
  keyForCity?: string
  keyforZipCode?: string
}

export const validateAvsender = (
  v: Validation,
  namespace: string,
  {
    avsender,
    keyForCity = 'by',
    keyforZipCode = 'postnummer'
  }: ValidationAvsenderProps
): boolean => {
  const hasErrors: Array<boolean> = []

  hasErrors.push(checkIfNotEmpty(v, {
    needle: avsender?.navEnhetNavn,
    id: namespace + '-enhetNavn',
    message: 'validation:noEnhetNavn'
  }))

  hasErrors.push(checkIfNotEmpty(v, {
    needle: avsender?.navOrgNr,
    id: namespace + '-orgNr',
    message: 'validation:noEnhetId'
  }))

  hasErrors.push(validateAdresse(v, namespace + '-adresse', {
    adresse: avsender?.adresse,
    keyforZipCode,
    keyForCity
  }))

  hasErrors.push(checkIfNotEmpty(v, {
    needle: avsender?.navTlf,
    id: namespace + '-tlf',
    message: 'validation:noTelephoneNumber'
  }))

  hasErrors.push(checkIfNotEmpty(v, {
    needle: avsender?.saksbehandler?.navn,
    id: namespace + '-saksbehandler-navn',
    message: 'validation:noNavn'
  }))

  hasErrors.push(checkIfNotEmpty(v, {
    needle: avsender?.saksbehandler?.enhetNavn,
    id: namespace + '-saksbehandler-enhet',
    message: 'validation:noEnhet'
  }))

  return hasErrors.find(value => value) !== undefined
}
