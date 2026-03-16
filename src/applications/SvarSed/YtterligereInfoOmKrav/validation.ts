import { H065Sed, ReplySed } from 'declarations/sed'
import { Validation } from 'declarations/types'
import { checkIfNotEmpty, checkLength } from 'utils/validation'

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

  hasErrors.push(checkIfNotEmpty(v, {
    needle: sed.overfoeringInfo?.informasjonAngaarYtelse?.type,
    id: namespace + '-informasjonAngaarYtelse-type',
    message: 'validation:noType',
    personName
  }))

  if (sed.overfoeringInfo?.informasjonAngaarYtelse?.type === 'annen_ytelse') {
    hasErrors.push(checkIfNotEmpty(v, {
      needle: sed.overfoeringInfo?.informasjonAngaarYtelse?.andre,
      id: namespace + '-informasjonAngaarYtelse-andre',
      message: 'validation:noAnnenYtelse',
      personName
    }))
  }

  hasErrors.push(checkLength(v, {
    needle: sed.overfoeringInfo?.informasjonAngaarYtelse?.andre,
    max: 155,
    id: namespace + '-informasjonAngaarYtelse-andre',
    message: 'validation:textOverX',
    personName
  }))

  hasErrors.push(checkLength(v, {
    needle: sed.overfoeringInfo?.annenKorrespondanse?.andre,
    max: 65,
    id: namespace + '-annenKorrespondanse-andre',
    message: 'validation:textOverX',
    personName
  }))

  hasErrors.push(checkIfNotEmpty(v, {
    needle: sed.overfoeringInfo?.mottaksdato,
    id: namespace + '-mottaksdato',
    message: 'validation:noDate',
    personName
  }))

  return hasErrors.find(value => value) !== undefined
}
