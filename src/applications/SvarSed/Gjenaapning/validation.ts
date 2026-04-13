import { X002Sed } from 'declarations/sed'
import { Validation } from 'declarations/types'
import { checkIfNotEmpty, checkLength } from 'utils/validation'

export interface ValidationGjenaapningProps {
  replySed: X002Sed
  personName ?: string | undefined
}

export const validateGjenaapning = (
  v: Validation,
  namespace: string,
  {
    replySed,
    personName
  }: ValidationGjenaapningProps
): boolean => {
  const hasErrors: Array<boolean> = []

  hasErrors.push(checkIfNotEmpty(v, {
    needle: replySed.gjenaapning?.aarsakType,
    id: namespace + '-aarsakType',
    message: 'validation:noAarsakType',
    personName
  }))

  if (replySed.gjenaapning?.aarsakType === 'annet') {
    hasErrors.push(checkIfNotEmpty(v, {
      needle: replySed.gjenaapning?.aarsakAnnet,
      id: namespace + '-aarsakAnnet',
      message: 'validation:noAarsakAnnet',
      personName
    }))

    hasErrors.push(checkLength(v, {
      needle: replySed.gjenaapning?.aarsakAnnet,
      max: 255,
      id: namespace + '-aarsakAnnet',
      message: 'validation:textOverX',
      personName
    }))
  }

  return hasErrors.find(value => value) !== undefined
}
