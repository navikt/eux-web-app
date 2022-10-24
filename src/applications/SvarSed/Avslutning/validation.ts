import { X001Sed } from 'declarations/sed'
import { Validation } from 'declarations/types'
import { checkIfNotEmpty, checkLength } from 'utils/validation'

export interface ValidationAvslutningProps {
  replySed: X001Sed
  personName ?: string | undefined
}

export const validateAvslutning = (
  v: Validation,
  namespace: string,
  {
    replySed,
    personName
  }: ValidationAvslutningProps
): boolean => {
  const hasErrors: Array<boolean> = []

  hasErrors.push(checkIfNotEmpty(v, {
    needle: replySed.avslutningDato,
    id: namespace + '-avslutningDato',
    message: 'validation:noDate',
    personName
  }))

  hasErrors.push(checkIfNotEmpty(v, {
    needle: replySed.avslutningType,
    id: namespace + '-avslutningType',
    message: 'validation:noType',
    personName
  }))

  hasErrors.push(checkIfNotEmpty(v, {
    needle: replySed.begrunnelseType,
    id: namespace + '-begrunnelseType',
    message: 'validation:noBegrunnelse',
    personName
  }))

  if (replySed.begrunnelseType === 'annet') {
    hasErrors.push(checkIfNotEmpty(v, {
      needle: replySed.begrunnelseAnnen,
      id: namespace + '-begrunnelseAnnen',
      message: 'validation:noBegrunnelseAnnen',
      personName
    }))

    hasErrors.push(checkLength(v, {
      needle: replySed.begrunnelseAnnen,
      max: 255,
      id: namespace + '-begrunnelseAnnen',
      message: 'validation:textOverX',
      personName
    }))
  }

  return hasErrors.find(value => value) !== undefined
}
