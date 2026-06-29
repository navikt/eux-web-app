import { Adresse, ReplySed } from 'declarations/sed'
import { Validation } from 'declarations/types'
import { getIdx } from 'utils/namespace'
import { isS040Sed } from 'utils/sed'
import {checkIfNotEmpty, checkLength, checkValidDateFormat} from 'utils/validation'

export interface ValidationAdresseProps {
  adresse: Adresse | undefined
  index?: number
  checkAdresseType: boolean
  personName?: string
  optional?: boolean
}

export interface ValidationAdresserProps {
  adresser: Array<Adresse> | undefined
  checkAdresseType: boolean
  personName?: string
  replySed?: ReplySed
  botidilandetsiden?: string
}

export const validateAdresse = (
  v: Validation,
  namespace: string,
  {
    adresse,
    index,
    checkAdresseType,
    personName,
    optional
  }: ValidationAdresseProps
): boolean => {
  const hasErrors: Array<boolean> = []
  const idx = getIdx(index)

  const hasAnyField = !!(
    adresse?.gate?.trim() || adresse?.bygning?.trim() || adresse?.postnummer?.trim() ||
    adresse?.by?.trim() || adresse?.region?.trim() || adresse?.landkode?.trim()
  )

  if (!optional || hasAnyField) {
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
  }

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
    personName,
    replySed,
    botidilandetsiden
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

  if (isS040Sed(replySed)) {
    hasErrors.push(checkValidDateFormat(validation, {
      needle: botidilandetsiden,
      id: namespace + '-botidilandetsiden',
      message: 'validation:invalidDateFormat',
      personName
    }))
  }

  return hasErrors.find(value => value) !== undefined
}

export const validateAnmodningOmAdresse = ({}: any): boolean => {
  const hasErrors: Array<boolean> = []

  return hasErrors.find(value => value) !== undefined
}
