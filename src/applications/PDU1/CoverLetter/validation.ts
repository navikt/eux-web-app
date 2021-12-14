import { Validation } from 'declarations/types'
import { TFunction } from 'react-i18next'
import { checkIfNotEmpty, propagateError } from 'utils/validation'

export interface ValidationCoverLetterProps {
  info: string | undefined
  namespace: string
}

export const validateCoverLetter = (
  v: Validation,
  t: TFunction,
  {
    info,
    namespace
  }: ValidationCoverLetterProps
): boolean => {
  const hasErrors: Array<boolean> = []

  hasErrors.push(checkIfNotEmpty(v, {
    needle: info,
    id: namespace + '-info',
    message: 'validation:noInfo'
  }))

  const hasError: boolean = hasErrors.find(value => value) !== undefined
  if (hasError) propagateError(v, namespace)
  return hasError
}
