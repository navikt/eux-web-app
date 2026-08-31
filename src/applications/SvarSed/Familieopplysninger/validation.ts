import { BostedOpplysninger } from '../../../declarations/h'
import { Validation } from 'declarations/types'
import { checkLength } from 'utils/validation'

export interface ValidationFamilieopplysningerProps {
  bostedOpplysninger: BostedOpplysninger | undefined
  antattFlyttegrunnMaxLength: number
  personName?: string
}

export const validateFamilieopplysninger = (
  v: Validation,
  namespace: string,
  {
    bostedOpplysninger,
    antattFlyttegrunnMaxLength,
    personName
  }: ValidationFamilieopplysningerProps
): boolean => {
  const hasErrors: Array<boolean> = []

  hasErrors.push(checkLength(v, {
    needle: bostedOpplysninger?.antattFlyttegrunn,
    id: namespace + '-antattFlyttegrunn',
    max: antattFlyttegrunnMaxLength,
    message: 'validation:textOverX',
    personName
  }))

  hasErrors.push(checkLength(v, {
    needle: bostedOpplysninger?.ektefelle?.navn,
    id: namespace + '-ektefelleNavn',
    max: 155,
    message: 'validation:textOverX',
    personName
  }))

  hasErrors.push(checkLength(v, {
    needle: bostedOpplysninger?.ektefelle?.bosted,
    id: namespace + '-ektefelleBosted',
    max: 255,
    message: 'validation:textOverX',
    personName
  }))

  hasErrors.push(checkLength(v, {
    needle: bostedOpplysninger?.barn?.navn,
    id: namespace + '-barnNavn',
    max: 155,
    message: 'validation:textOverX',
    personName
  }))

  hasErrors.push(checkLength(v, {
    needle: bostedOpplysninger?.barn?.bosted,
    id: namespace + '-barnBosted',
    max: 255,
    message: 'validation:textOverX',
    personName
  }))

  hasErrors.push(checkLength(v, {
    needle: bostedOpplysninger?.barn?.skolested,
    id: namespace + '-barnSkolested',
    max: 255,
    message: 'validation:textOverX',
    personName
  }))

  return hasErrors.find(value => value) !== undefined
}
