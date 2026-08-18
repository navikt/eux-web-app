import { H006Sed } from 'declarations/h006'
import { ReplySed } from 'declarations/sed'
import { Validation } from 'declarations/types'
import { checkLength } from 'utils/validation'

export interface ValidationNegativtSvarProps {
  replySed: ReplySed
  personName?: string
}

export const validateNegativtSvar = (
  v: Validation,
  namespace: string,
  {
    replySed,
    personName
  }: ValidationNegativtSvarProps
): boolean => {
  const hasErrors: Array<boolean> = []
  const sed = replySed as H006Sed
  const negativtSvar = sed.negativtSvar

  hasErrors.push(checkLength(v, {
    needle: negativtSvar?.opplysningerSomIkkeKanOversendes,
    id: namespace + '-opplysningerSomIkkeKanOversendes',
    max: 65,
    message: 'validation:textOverX',
    personName
  }))

  hasErrors.push(checkLength(v, {
    needle: negativtSvar?.grunn,
    id: namespace + '-grunn',
    max: 255,
    message: 'validation:textOverX',
    personName
  }))

  return hasErrors.find(value => value) !== undefined
}
