import { Adresse } from 'declarations/sed'
import { Validation } from 'declarations/types'
import { getIdx } from 'utils/namespace'
import { checkIfNotEmpty } from 'utils/validation'

export interface ValidationAdresseProps {
  adresse: Adresse | undefined
  index?: number
  checkAdresseType: boolean
  personName?: string
}

export interface ValidationAdresserProps {
  adresser: Array<Adresse> | undefined
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
  }: ValidationAdresseProps
): boolean => {
  const hasErrors: Array<boolean> = []
  const idx = getIdx(index)

  if (checkAdresseType) {
    hasErrors.push(checkIfNotEmpty(v, {
      needle: adresse?.type,
      id: namespace + idx + '-type',
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
  }: ValidationAdresserProps
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
