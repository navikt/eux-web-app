import { ReplySed } from 'declarations/sed'
import { H001Sed } from 'declarations/h001'
import { H002Sed } from 'declarations/h002'
import { Validation } from 'declarations/types'
import _ from 'lodash'
import { checkLength } from 'utils/validation'

export interface ValidationYtterligereInfoBrukerProps {
  replySed: ReplySed
  personName?: string
}

export const validateYtterligereInfoBruker = (
  v: Validation,
  namespace: string,
  {
    replySed,
    personName
  }: ValidationYtterligereInfoBrukerProps
): boolean => {
  const hasErrors: Array<boolean> = []
  const ytterligereInfo = (replySed as H001Sed | H002Sed).bruker?.ytterligereInfo

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
