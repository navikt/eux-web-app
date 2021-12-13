import { validateAdresse } from 'applications/PDU1/Adresse/validation'
import { NavInfo } from 'declarations/pd'
import { Validation } from 'declarations/types'
import { TFunction } from 'react-i18next'
import { checkIfNotEmpty, propagateError } from 'utils/validation'

export interface ValidationNavInfoProps {
  nav: NavInfo,
  namespace: string
}

export const validateNavInfo = (
  v: Validation,
  t: TFunction,
  {
    nav,
    namespace
  }: ValidationNavInfoProps
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

  hasErrors.push(validateAdresse(v, t, {
    namespace: namespace + '-adresse',
    adresse: nav?.adresse
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

  const hasError: boolean = hasErrors.find(value => value) !== undefined
  if (hasError) propagateError(v, namespace)
  return hasError
}
