import { H006Sed } from 'declarations/h006'
import { ReplySed } from 'declarations/sed'
import { Validation } from 'declarations/types'
import { checkLength } from 'utils/validation'

export interface ValidationFamiliestatusPositivtSvarProps {
  replySed: ReplySed
  personName?: string
}

export const validateFamiliestatusPositivtSvar = (
  v: Validation,
  namespace: string,
  {
    replySed,
    personName
  }: ValidationFamiliestatusPositivtSvarProps
): boolean => {
  const hasErrors: Array<boolean> = []
  const sed = replySed as H006Sed
  const info = sed.positivtSvar

  hasErrors.push(checkLength(v, {
    needle: info?.grunnForFlytting,
    id: namespace + '-grunnForFlytting',
    max: 255,
    message: 'validation:textOverX',
    personName
  }))

  hasErrors.push(checkLength(v, {
    needle: info?.familiestatus?.ektefelle?.familiemedlem,
    id: namespace + '-ektefelleFamiliemedlem',
    max: 155,
    message: 'validation:textOverX',
    personName
  }))

  hasErrors.push(checkLength(v, {
    needle: info?.familiestatus?.ektefelle?.bosted,
    id: namespace + '-ektefelleBosted',
    max: 255,
    message: 'validation:textOverX',
    personName
  }))

  hasErrors.push(checkLength(v, {
    needle: info?.familiestatus?.barn?.familiemedlem,
    id: namespace + '-barnFamiliemedlem',
    max: 155,
    message: 'validation:textOverX',
    personName
  }))

  hasErrors.push(checkLength(v, {
    needle: info?.familiestatus?.barn?.bosted,
    id: namespace + '-barnBosted',
    max: 255,
    message: 'validation:textOverX',
    personName
  }))

  hasErrors.push(checkLength(v, {
    needle: info?.familiestatus?.barn?.skolekrets,
    id: namespace + '-barnSkolekrets',
    max: 255,
    message: 'validation:textOverX',
    personName
  }))

  return hasErrors.find(value => value) !== undefined
}
