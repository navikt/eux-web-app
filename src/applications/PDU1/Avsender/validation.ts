import { validateAdresse } from 'applications/PDU1/Person/Adresse/validation'
import { NavInfo } from 'declarations/pd'
import { Validation } from 'declarations/types'
import { checkIfNotEmpty } from 'utils/validation'

export interface ValidationAvsenderProps {
  nav: NavInfo
  keyForCity?: string
  keyforZipCode?: string
}

export const validateAvsender = (
  v: Validation,
  namespace: string,
  {
    nav,
    keyForCity = 'by',
    keyforZipCode = 'postnummer'
  }: ValidationAvsenderProps
): boolean => {
  const hasErrors: Array<boolean> = []

  hasErrors.push(checkIfNotEmpty(v, {
    needle: nav?.enhetNavn,
    id: namespace + '-enhetNavn',
    message: 'validation:noEnhetNavn'
  }))

  hasErrors.push(checkIfNotEmpty(v, {
    needle: nav?.enhetId,
    id: namespace + '-enhetId',
    message: 'validation:noEnhetId'
  }))

  hasErrors.push(validateAdresse(v, namespace + '-adresse', {
    adresse: nav?.adresse,
    keyforZipCode,
    keyForCity
  }))

  hasErrors.push(checkIfNotEmpty(v, {
    needle: nav?.tlf,
    id: namespace + '-tlf',
    message: 'validation:noTelephoneNumber'
  }))

  hasErrors.push(checkIfNotEmpty(v, {
    needle: nav?.saksbehandler?.navn,
    id: namespace + '-saksbehandler-navn',
    message: 'validation:noNavn'
  }))

  hasErrors.push(checkIfNotEmpty(v, {
    needle: nav?.saksbehandler?.enhet,
    id: namespace + '-saksbehandler-enhet',
    message: 'validation:noEnhet'
  }))

  return hasErrors.find(value => value) !== undefined
}
