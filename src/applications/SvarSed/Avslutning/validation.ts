import { X001Sed } from 'declarations/sed'
import { Validation } from 'declarations/types'
import { checkIfNotEmpty } from 'utils/validation'

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
    needle: replySed.avslutningsDato,
    id: namespace + '-avslutningsDato',
    message: 'validation:noDate',
    personName
  }))

  hasErrors.push(checkIfNotEmpty(v, {
    needle: replySed.avslutningsType,
    id: namespace + '-avslutningsType',
    message: 'validation:noType',
    personName
  }))

  hasErrors.push(checkIfNotEmpty(v, {
    needle: replySed.begrunnelse,
    id: namespace + '-begrunnelse',
    message: 'validation:noBegrunnelse',
    personName
  }))

  if (replySed.begrunnelse === '99') {
    hasErrors.push(checkIfNotEmpty(v, {
      needle: replySed.begrunnelseAnnen,
      id: namespace + '-begrunnelseAnnen',
      message: 'validation:noBegrunnelseAnnen',
      personName
    }))
  }

  return hasErrors.find(value => value) !== undefined
}
