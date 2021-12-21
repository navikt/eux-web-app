import { Adresse } from 'declarations/sed'
import { Validation } from 'declarations/types'
import _ from 'lodash'
import { TFunction } from 'react-i18next'
import { checkIfNotEmpty, checkIfNotGB, checkIfValidLand, propagateError } from 'utils/validation'

export interface ValidationAdresseProps {
  adresse: Adresse | undefined
  keyForCity?: string
  keyforZipCode?: string
  namespace: string
}

export const validateAdresse = (
  v: Validation,
  t: TFunction,
  {
    adresse,
    keyForCity = 'by',
    keyforZipCode = 'postnummer',
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
    needle: _.get(adresse, keyforZipCode),
    id: namespace + '-postnummer',
    message: 'validation:noAddressPostnummer'
  }))

  hasErrors.push(checkIfNotEmpty(v, {
    needle: _.get(adresse, keyForCity),
    id: namespace + '-by',
    message: 'validation:noAddressCity'
  }))

  hasErrors.push(checkIfNotEmpty(v, {
    needle: adresse?.land,
    id: namespace + '-land',
    message: 'validation:noAddressCountry'
  }))

  if (adresse?.land && adresse?.land?.length > 0) {
    hasErrors.push(checkIfValidLand(v, {
      needle: adresse?.land,
      id: namespace + '-land',
      message: 'validation:invalidLand'
    }))
    hasErrors.push(checkIfNotGB(v, {
      needle: adresse?.land,
      id: namespace + '-land',
      message: 'validation:invalidLand'
    }))
  }


  const hasError: boolean = hasErrors.find(value => value) !== undefined
  if (hasError) propagateError(v, namespace)
  return hasError
}
