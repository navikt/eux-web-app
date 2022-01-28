import { H001Sed, ReplySed } from 'declarations/sed'
import { Validation } from 'declarations/types'
import { TFunction } from 'react-i18next'
import { checkLength, propagateError } from 'utils/validation'

export interface ValidationSvarPåForespørselProps {
  replySed: ReplySed
  namespace: string,
  personName: string
}

export const validateSvarPåForespørsel = (
  v: Validation,
  t: TFunction,
  {
    replySed,
    namespace,
    personName
  }: ValidationSvarPåForespørselProps
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
    max: 500,
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

  const hasError: boolean = hasErrors.find(value => value) !== undefined
  if (hasError) propagateError(v, namespace)
  return hasError
}
