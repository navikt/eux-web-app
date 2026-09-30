import { ReplySed } from 'declarations/sed'
import { H001Sed } from 'declarations/h001'
import { Validation } from 'declarations/types'
import _ from 'lodash'
import { checkLength } from 'utils/validation'

export interface ValidationYtterligereInfoH001Props {
  replySed: ReplySed
  personName?: string
}

export const validateYtterligereInfoH001 = (
  v: Validation,
  namespace: string,
  {
    replySed,
    personName
  }: ValidationYtterligereInfoH001Props
): boolean => {
  const hasErrors: Array<boolean> = []
  const ytterligereInfo = (replySed as H001Sed).bruker?.ytterligereInfo

  if (!_.isEmpty(ytterligereInfo)) {
    hasErrors.push(checkLength(v, {
      needle: ytterligereInfo,
      max: 500,
      id: namespace + '-ytterligereInfo',
      message: 'validation:textOverX',
      personName
    }))
  }

  return hasErrors.find(value => value) !== undefined
}
