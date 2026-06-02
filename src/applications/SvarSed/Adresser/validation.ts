import { Adresse } from 'declarations/sed'
import { Validation } from 'declarations/types'
import { getIdx } from 'utils/namespace'
import {checkIfNotEmpty, checkLength} from 'utils/validation'

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
    needle: adresse?.landkode,
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

  hasErrors.push(checkLength(v, {
    needle: adresse?.gate,
    id: namespace + idx + '-gate',
    max: 155,
    message: 'validation:textOverX'
  }))

  hasErrors.push(checkLength(v, {
    needle: adresse?.bygning,
    id: namespace + idx + '-bygning',
    max: 155,
    message: 'validation:textOverX'
  }))

  hasErrors.push(checkLength(v, {
    needle: adresse?.by,
    id: namespace + idx + '-by',
    max: 65,
    message: 'validation:textOverX'
  }))

  hasErrors.push(checkLength(v, {
    needle: adresse?.postnummer,
    id: namespace + idx + '-postnummer',
    max: 25,
    message: 'validation:textOverX'
  }))

  hasErrors.push(checkLength(v, {
    needle: adresse?.region,
    id: namespace + idx + '-region',
    max: 65,
    message: 'validation:textOverX'
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

export interface ValidationAdresseH120Props {
  adresse: Adresse | undefined
  personName?: string
}

export const validateAdresseH120 = (
  v: Validation,
  namespace: string,
  {
    adresse,
    personName
  }: ValidationAdresseH120Props
): boolean => {
  const hasErrors: Array<boolean> = []

  const hasAnyField = !!(
    adresse?.gate?.trim() || adresse?.bygning?.trim() || adresse?.postnummer?.trim() ||
    adresse?.by?.trim() || adresse?.region?.trim() || adresse?.landkode?.trim()
  )

  if (hasAnyField) {
    hasErrors.push(checkIfNotEmpty(v, {
      needle: adresse?.by,
      id: namespace + '-by',
      message: 'validation:noAddressCity',
      personName
    }))

    hasErrors.push(checkIfNotEmpty(v, {
      needle: adresse?.landkode,
      id: namespace + '-land',
      message: 'validation:noAddressCountry',
      personName
    }))
  }

  hasErrors.push(checkLength(v, {
    needle: adresse?.gate,
    id: namespace + '-gate',
    max: 155,
    message: 'validation:textOverX'
  }))

  hasErrors.push(checkLength(v, {
    needle: adresse?.bygning,
    id: namespace + '-bygning',
    max: 155,
    message: 'validation:textOverX'
  }))

  hasErrors.push(checkLength(v, {
    needle: adresse?.by,
    id: namespace + '-by',
    max: 65,
    message: 'validation:textOverX'
  }))

  hasErrors.push(checkLength(v, {
    needle: adresse?.postnummer,
    id: namespace + '-postnummer',
    max: 25,
    message: 'validation:textOverX'
  }))

  hasErrors.push(checkLength(v, {
    needle: adresse?.region,
    id: namespace + '-region',
    max: 65,
    message: 'validation:textOverX'
  }))

  return hasErrors.find(value => value) !== undefined
}

export const validateAnmodningOmAdresse = ({}: any): boolean => {
  const hasErrors: Array<boolean> = []

  return hasErrors.find(value => value) !== undefined
}
