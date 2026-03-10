import { H065Sed, ReplySed } from 'declarations/sed'
import { Validation } from 'declarations/types'
import { checkLength } from 'utils/validation'

export interface ValidationOverfoeringInfoProps {
  replySed: ReplySed
  personName?: string
}

export const validateOverfoeringInfo = (
  v: Validation,
  namespace: string,
  {
    replySed,
    personName
  }: ValidationOverfoeringInfoProps
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

  hasErrors.push(checkLength(v, {
    needle: sed.overfoeringInfo?.dokumenterVedlagt?.annet?.[0],
    max: 255,
    id: namespace + '-dokumenterVedlagt-annet',
    message: 'validation:textOverX',
    personName
  }))

  return hasErrors.find(value => value) !== undefined
}
