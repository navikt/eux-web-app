import { H001Sed, ReplySed } from 'declarations/sed'
import { Validation } from 'declarations/types'
import { checkLength } from 'utils/validation'

export interface ValidationAnmodningProps {
  replySed: ReplySed
  namespace: string,
  personName?: string
}

export const validateAnmodning = (
  v: Validation,
  {
    replySed,
    namespace,
    personName
  }: ValidationAnmodningProps
): boolean => {
  const hasErrors: Array<boolean> = []

  hasErrors.push(checkLength(v, {
    needle: (replySed as H001Sed).anmodning?.dokumentasjon?.informasjon,
    max: 255,
    id: namespace + '-informasjon',
    message: 'validation:textOverX',
    personName
  }))

  hasErrors.push(checkLength(v, {
    needle: (replySed as H001Sed).anmodning?.dokumentasjon?.dokument,
    max: 255,
    id: namespace + '-dokument',
    message: 'validation:textOverX',
    personName
  }))

  hasErrors.push(checkLength(v, {
    needle: (replySed as H001Sed).anmodning?.dokumentasjon?.sed,
    max: 65,
    id: namespace + '-sed',
    message: 'validation:textOverX',
    personName
  }))

  return hasErrors.find(value => value) !== undefined
}
