import { X003Sed } from 'declarations/x003'
import { Validation } from 'declarations/types'
import { checkIfNotEmpty, checkLength } from 'utils/validation'

export interface ValidationSvarGjenaapningProps {
  replySed: X003Sed
  personName ?: string | undefined
}

export const validateSvarGjenaapning = (
  v: Validation,
  namespace: string,
  {
    replySed,
    personName
  }: ValidationSvarGjenaapningProps
): boolean => {
  const hasErrors: Array<boolean> = []

  hasErrors.push(checkIfNotEmpty(v, {
    needle: replySed.svarGjenaapning?.erGodkjent,
    id: namespace + '-erGodkjent',
    message: 'validation:noErGodkjent',
    personName
  }))

  hasErrors.push(checkIfNotEmpty(v, {
    needle: replySed.svarGjenaapning?.grunnType,
    id: namespace + '-grunnType',
    message: 'validation:noAarsakType',
    personName
  }))

  if (replySed.svarGjenaapning?.grunnType === 'annet') {
    hasErrors.push(checkIfNotEmpty(v, {
      needle: replySed.svarGjenaapning?.grunnAnnet,
      id: namespace + '-grunnAnnet',
      message: 'validation:noAarsakAnnet',
      personName
    }))

    hasErrors.push(checkLength(v, {
      needle: replySed.svarGjenaapning?.grunnAnnet,
      max: 255,
      id: namespace + '-grunnAnnet',
      message: 'validation:textOverX',
      personName
    }))
  }

  return hasErrors.find(value => value) !== undefined
}
