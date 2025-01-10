import { X011Sed } from 'declarations/sed'
import { Validation } from 'declarations/types'
import { checkIfNotEmpty, checkLength } from 'utils/validation'

export interface ValidationAvvisProps {
  replySed: X011Sed
  personName ?: string | undefined
}

export const validateAvvis = (
  v: Validation,
  namespace: string,
  {
    replySed,
    personName
  }: ValidationAvvisProps
): boolean => {
  const hasErrors: Array<boolean> = []

/*
  hasErrors.push(checkIfNotEmpty(v, {
    needle: (replySed as X011Sed).avvisSedId,
    id: namespace + '-kansellerSedId',
    message: 'validation:noId',
    personName
  }))
*/

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
