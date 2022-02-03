import { H001Sed, ReplySed } from 'declarations/sed'
import { Validation } from 'declarations/types'
import { TFunction } from 'react-i18next'
import { checkIfNotEmpty, checkLength, propagateError } from 'utils/validation'

export interface ValidationEndredeForholdProps {
  replySed: ReplySed
  namespace: string,
  personName: string
}

export const validateEndredeForhold = (
  v: Validation,
  t: TFunction,
  {
    replySed,
    namespace,
    personName
  }: ValidationEndredeForholdProps
): boolean => {
  const hasErrors: Array<boolean> = []

  hasErrors.push(checkIfNotEmpty(v, {
    needle: (replySed as H001Sed).ytterligereinfoType,
    id: namespace + '-ytterligereinfoType',
    message: 'validation:noVelg',
    personName
  }))

  hasErrors.push(checkLength(v, {
    needle: (replySed as H001Sed).ytterligereinfo,
    max: 500,
    id: namespace + '-tekst',
    message: 'validation:textOverX',
    personName
  }))

  const hasError: boolean = hasErrors.find(value => value) !== undefined
  if (hasError) propagateError(v, namespace)
  return hasError
}
