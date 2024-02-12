import { Validation } from 'declarations/types'
import {doNothing} from 'utils/validation'

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

  hasErrors.push(doNothing(v, {
    needle: info,
    id: namespace + '-info',
    message: 'dummy'
  }))

  return hasErrors.find(value => value) !== undefined
}
