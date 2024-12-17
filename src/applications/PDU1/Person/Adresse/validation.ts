import { Adresse } from 'declarations/sed'
import { Validation } from 'declarations/types'
import _ from 'lodash'
import { checkIfNotEmpty, checkIfNotGB, checkIfValidLand } from 'utils/validation'

export interface ValidationAdresseProps {
  adresse: Adresse | undefined
  keyForCity?: string
  keyforZipCode?: string
}

export const validateAdresse = (
  v: Validation,
  namespace: string,
  {
    adresse,
    keyForCity = 'by',
    keyforZipCode = 'postnummer'
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
    needle: adresse?.landkode,
    id: namespace + '-land',
    message: 'validation:noAddressCountry'
  }))

  if (adresse?.land && adresse?.land?.length > 0) {
    hasErrors.push(checkIfValidLand(v, {
      needle: adresse?.landkode,
      id: namespace + '-land',
      message: 'validation:invalidLand'
    }))
    hasErrors.push(checkIfNotGB(v, {
      needle: adresse?.landkode,
      id: namespace + '-land',
      message: 'validation:invalidLand'
    }))
  }

  return hasErrors.find(value => value) !== undefined
}
