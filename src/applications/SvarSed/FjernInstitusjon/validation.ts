import { X006Sed } from 'declarations/x006'
import { Validation } from 'declarations/types'
import { checkIfNotEmpty, checkLength } from 'utils/validation'

export interface ValidationFjernInstitusjonProps {
  replySed: X006Sed
  personName?: string | undefined
}

export const validateFjernInstitusjon = (
  v: Validation,
  namespace: string,
  {
    replySed,
    personName
  }: ValidationFjernInstitusjonProps
): boolean => {
  const hasErrors: Array<boolean> = []

  hasErrors.push(checkIfNotEmpty(v, {
    needle: replySed.fjernInstitusjon?.institusjonId,
    id: namespace + '-institusjon',
    message: 'validation:noInstitusjon',
    personName
  }))

  hasErrors.push(checkIfNotEmpty(v, {
    needle: replySed.fjernInstitusjon?.grunnType,
    id: namespace + '-grunnType',
    message: 'validation:noGrunnType',
    personName
  }))

  if (replySed.fjernInstitusjon?.grunnType === 'annet') {
    hasErrors.push(checkIfNotEmpty(v, {
      needle: replySed.fjernInstitusjon?.grunnAnnet,
      id: namespace + '-grunnAnnet',
      message: 'validation:noGrunnAnnet',
      personName
    }))

    hasErrors.push(checkLength(v, {
      needle: replySed.fjernInstitusjon?.grunnAnnet,
      max: 255,
      id: namespace + '-grunnAnnet',
      message: 'validation:textOverX',
      personName
    }))
  }

  return hasErrors.find(value => value) !== undefined
}
