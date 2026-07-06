import { H070Sed } from 'declarations/h070'
import { ReplySed } from 'declarations/sed'
import { Validation } from 'declarations/types'
import _ from 'lodash'
import { checkLength } from 'utils/validation'

export interface ValidationYtterligereInformasjonProps {
  replySed: ReplySed
  personName?: string
}

export const validateYtterligereInformasjon = (
  v: Validation,
  namespace: string,
  {
    replySed,
    personName
  }: ValidationYtterligereInformasjonProps
): boolean => {
  const hasErrors: Array<boolean> = []
  const sed = replySed as H070Sed

  if (!_.isEmpty(sed.ytterligereInfo)) {
    hasErrors.push(checkLength(v, {
      needle: sed.ytterligereInfo,
      max: 500,
      id: namespace + '-ytterligereInfo',
      message: 'validation:textOverX',
      personName
    }))
  }

  return hasErrors.find(value => value) !== undefined
}
