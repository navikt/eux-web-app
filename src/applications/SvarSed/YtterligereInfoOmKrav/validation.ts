import { H065Sed, ReplySed } from 'declarations/sed'
import { Validation } from 'declarations/types'
import { checkLength } from 'utils/validation'

export interface ValidationYtterligereInfoOmKravProps {
  replySed: ReplySed
  personName?: string
}

export const validateYtterligereInfoOmKrav = (
  v: Validation,
  namespace: string,
  {
    replySed,
    personName
  }: ValidationYtterligereInfoOmKravProps
): boolean => {
  const hasErrors: Array<boolean> = []
  const sed = replySed as H065Sed

  hasErrors.push(checkLength(v, {
    needle: sed.overfoeringInfo?.informasjonAngaarYtelse?.andre,
    max: 500,
    id: namespace + '-informasjonAngaarYtelse-andre',
    message: 'validation:textOverX',
    personName
  }))

  hasErrors.push(checkLength(v, {
    needle: sed.overfoeringInfo?.annenKorrespondanse?.andre,
    max: 500,
    id: namespace + '-annenKorrespondanse-andre',
    message: 'validation:textOverX',
    personName
  }))

  return hasErrors.find(value => value) !== undefined
}
