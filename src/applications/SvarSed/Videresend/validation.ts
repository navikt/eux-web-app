import { X007Sed } from 'declarations/x007'
import { Validation } from 'declarations/types'
import { checkIfNotEmpty, checkLength } from 'utils/validation'

export interface ValidationVideresendProps {
  replySed: X007Sed
  personName?: string | undefined
}

export const validateVideresend = (
  v: Validation,
  namespace: string,
  {
    replySed,
    personName
  }: ValidationVideresendProps
): boolean => {
  const hasErrors: Array<boolean> = []

  hasErrors.push(checkIfNotEmpty(v, {
    needle: replySed.videresend?.leggTilInstitusjonId,
    id: namespace + '-leggTilInstitusjon',
    message: 'validation:noInstitusjon',
    personName
  }))

  hasErrors.push(checkIfNotEmpty(v, {
    needle: replySed.videresend?.fjernInstitusjonId,
    id: namespace + '-fjernInstitusjon',
    message: 'validation:noInstitusjon',
    personName
  }))

  hasErrors.push(checkIfNotEmpty(v, {
    needle: replySed.videresend?.grunnType,
    id: namespace + '-grunnType',
    message: 'validation:noGrunnType',
    personName
  }))

  if (replySed.videresend?.grunnType === 'annet') {
    hasErrors.push(checkIfNotEmpty(v, {
      needle: replySed.videresend?.grunnAnnet,
      id: namespace + '-grunnAnnet',
      message: 'validation:noGrunnAnnet',
      personName
    }))

    hasErrors.push(checkLength(v, {
      needle: replySed.videresend?.grunnAnnet,
      max: 255,
      id: namespace + '-grunnAnnet',
      message: 'validation:textOverX',
      personName
    }))
  }

  return hasErrors.find(value => value) !== undefined
}
