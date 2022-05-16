import { Validation } from 'declarations/types'
import { checkLength } from 'utils/validation'

export interface ValidationCoverLetterProps {
  info: string | undefined
}

export const validateCoverLetter = (
  v: Validation,
  namespace: string,
  {
    info
  }: ValidationCoverLetterProps
): boolean => {
  const hasErrors: Array<boolean> = []

  hasErrors.push(checkLength(v, {
    needle: info,
    max: 500,
    id: namespace + '-info',
    message: 'validation:textOverX'
  }))

  return hasErrors.find(value => value) !== undefined
}
