import { H001Sed, ReplySed } from 'declarations/sed'
import { Validation } from 'declarations/types'
import _ from 'lodash'
import { checkLength } from 'utils/validation'

export interface ValidationEndredeForholdProps {
  replySed: ReplySed
  namespace: string,
  personName?: string
}

export const validateEndredeForhold = (
  v: Validation,
  {
    replySed,
    namespace,
    personName
  }: ValidationEndredeForholdProps
): boolean => {
  const hasErrors: Array<boolean> = []

  if (!_.isEmpty((replySed as H001Sed).ytterligereInfo)) {
    hasErrors.push(checkLength(v, {
      needle: (replySed as H001Sed).ytterligereInfo,
      max: 500,
      id: namespace + '-tekst',
      message: 'validation:textOverX',
      personName
    }))
  }

  return hasErrors.find(value => value) !== undefined
}
