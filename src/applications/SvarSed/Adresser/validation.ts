import { Adresse } from 'declarations/sed'
import { Validation } from 'declarations/types'
import { getIdx } from 'utils/namespace'
import { checkIfNotEmpty } from 'utils/validation'

export interface ValidationAddressProps {
  adresse: Adresse | undefined
  index?: number
  checkAdresseType: boolean
  personName?: string
}

interface ValidateAdresserProps {
  adresser: Array<Adresse>
  checkAdresseType: boolean
  personName?: string
}

export const validateAdresse = (
  v: Validation,
  namespace: string,
  {
    adresse,
    index,
    checkAdresseType,
    personName
  }: ValidationAddressProps
): boolean => {
  const hasErrors: Array<boolean> = []
  const idx = getIdx(index)

  if (checkAdresseType) {
    hasErrors.push(checkIfNotEmpty(v, {
      needle: adresse?.type,
      id: namespace + idx + '-fnr',
      message: 'validation:noAddressType',
      personName
    }))
  }

  hasErrors.push(checkIfNotEmpty(v, {
    needle: adresse?.land,
    id: namespace + idx + '-land',
    message: 'validation:noAddressCountry',
    personName
  }))

  hasErrors.push(checkIfNotEmpty(v, {
    needle: adresse?.by,
    id: namespace + idx + '-by',
    message: 'validation:noAddressCity',
    personName
  }))

  return hasErrors.find(value => value) !== undefined
}

export const validateAdresser = (
  validation: Validation,
  namespace: string,
  {
    adresser,
    checkAdresseType,
    personName
  }: ValidateAdresserProps
): boolean => {
  const hasErrors: Array<boolean> = []
  adresser?.forEach((adresse: Adresse, index: number) => {
    hasErrors.push(validateAdresse(validation, namespace, {
      adresse,
      index,
      checkAdresseType,
      personName
    }))
  })
  return hasErrors.find(value => value) !== undefined
}
