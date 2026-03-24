import { H065Sed } from 'declarations/h065'
import { ReplySed } from 'declarations/sed'
import { Validation } from 'declarations/types'
import { checkLength } from 'utils/validation'

export interface ValidationGrunnerForOverfoeringProps {
  replySed: ReplySed
  personName?: string
}

export const validateGrunnerForOverfoering = (
  v: Validation,
  namespace: string,
  {
    replySed,
    personName
  }: ValidationGrunnerForOverfoeringProps
): boolean => {
  const hasErrors: Array<boolean> = []
  const sed = replySed as H065Sed

  hasErrors.push(checkLength(v, {
    needle: sed.overfoeringInfo?.grunnerForOverfoering,
    max: 255,
    id: namespace + '-grunnerForOverfoering',
    message: 'validation:textOverX',
    personName
  }))

  return hasErrors.find(value => value) !== undefined
}
