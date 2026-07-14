import { BostedInformasjon } from 'declarations/hbuc02a'
import { Validation } from 'declarations/types'
import { checkLength } from 'utils/validation'

export interface ValidationFamiliestatusProps {
  info: BostedInformasjon | undefined
  grunnForFlyttingMaxLength: number
  personName?: string
}

export const validateFamiliestatus = (
  v: Validation,
  namespace: string,
  {
    info,
    grunnForFlyttingMaxLength,
    personName
  }: ValidationFamiliestatusProps
): boolean => {
  const hasErrors: Array<boolean> = []

  hasErrors.push(checkLength(v, {
    needle: info?.grunnForFlytting,
    id: namespace + '-grunnForFlytting',
    max: grunnForFlyttingMaxLength,
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
