import { X005Sed } from 'declarations/x005'
import { Validation } from 'declarations/types'
import { checkIfNotEmpty, checkLength } from 'utils/validation'

export interface ValidationLeggTilInstitusjonProps {
  replySed: X005Sed
  personName?: string | undefined
}

export const validateLeggTilInstitusjon = (
  v: Validation,
  namespace: string,
  {
    replySed,
    personName
  }: ValidationLeggTilInstitusjonProps
): boolean => {
  const hasErrors: Array<boolean> = []

  hasErrors.push(checkIfNotEmpty(v, {
    needle: replySed.leggTilInstitusjon?.institusjonId,
    id: namespace + '-institusjon',
    message: 'validation:noInstitusjon',
    personName
  }))

  hasErrors.push(checkIfNotEmpty(v, {
    needle: replySed.leggTilInstitusjon?.grunnType,
    id: namespace + '-grunnType',
    message: 'validation:noGrunnType',
    personName
  }))

  if (replySed.leggTilInstitusjon?.grunnType === 'annet') {
    hasErrors.push(checkIfNotEmpty(v, {
      needle: replySed.leggTilInstitusjon?.grunnAnnet,
      id: namespace + '-grunnAnnet',
      message: 'validation:noGrunnAnnet',
      personName
    }))

    hasErrors.push(checkLength(v, {
      needle: replySed.leggTilInstitusjon?.grunnAnnet,
      max: 255,
      id: namespace + '-grunnAnnet',
      message: 'validation:textOverX',
      personName
    }))
  }

  return hasErrors.find(value => value) !== undefined
}
