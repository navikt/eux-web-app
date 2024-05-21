import {F003Sed, ReplySed} from 'declarations/sed'
import { Validation } from 'declarations/types'
import _ from 'lodash'
import { checkLength } from 'utils/validation'

export interface ValidationYtterligereInfoProps {
  replySed: ReplySed
  personName?: string
}

export const validateYtterligereInfo = (
  v: Validation,
  namespace: string,
  {
    replySed,
    personName
  }: ValidationYtterligereInfoProps
): boolean => {
  const hasErrors: Array<boolean> = []

  if (!_.isEmpty((replySed as F003Sed).ektefelle?.ytterligereInfo)) {
    hasErrors.push(checkLength(v, {
      needle: (replySed as F003Sed).ektefelle?.ytterligereInfo,
      max: 500,
      id: namespace + '-ytterligereInfo',
      message: 'validation:textOverX',
      personName
    }))
  }

  return hasErrors.find(value => value) !== undefined
}
