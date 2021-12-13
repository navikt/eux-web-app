import { Adresse } from 'declarations/sed'
import { Validation } from 'declarations/types'
import { TFunction } from 'react-i18next'
import { checkIfNotEmpty, propagateError } from 'utils/validation'

export interface ValidationAdresseProps {
  adresse: Adresse | undefined
  namespace: string
}

export const validateAdresse = (
  v: Validation,
  t: TFunction,
  {
    adresse,
    namespace
  }: ValidationAdresseProps
): boolean => {
  const hasErrors: Array<boolean> = []

  hasErrors.push(checkIfNotEmpty(v, {
    needle: adresse?.gate,
    id: namespace + '-gate',
    message: 'validation:noAddressStreet'
  }))

  hasErrors.push(checkIfNotEmpty(v, {
    needle: adresse?.postnummer,
    id: namespace + '-postnummer',
    message: 'validation:noAddressPostnummer'
  }))

  hasErrors.push(checkIfNotEmpty(v, {
    needle: adresse?.by,
    id: namespace + '-by',
    message: 'validation:noAddressCity'
  }))

  hasErrors.push(checkIfNotEmpty(v, {
    needle: adresse?.land,
    id: namespace + '-land',
    message: 'validation:noAddressCountry'
  }))

  const hasError: boolean = hasErrors.find(value => value) !== undefined
  if (hasError) propagateError(v, namespace)
  return hasError
}
