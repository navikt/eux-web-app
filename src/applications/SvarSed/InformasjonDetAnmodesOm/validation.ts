import { H005Sed } from 'declarations/h005'
import { ReplySed } from 'declarations/sed'
import { Validation } from 'declarations/types'
import { checkIfNotEmpty, checkLength } from 'utils/validation'

export interface ValidationInformasjonDetAnmodesOmProps {
  replySed: ReplySed
  personName?: string
}

export const validateInformasjonDetAnmodesOm = (
  v: Validation,
  namespace: string,
  {
    replySed,
    personName
  }: ValidationInformasjonDetAnmodesOmProps
): boolean => {
  const hasErrors: Array<boolean> = []
  const sed = replySed as H005Sed

  hasErrors.push(checkIfNotEmpty(v, {
    needle: sed.informasjonDetAnmodesOm,
    id: namespace + '-informasjonDetAnmodesOm',
    message: 'validation:noAnmodningOmInformasjon',
    personName
  }))

  hasErrors.push(checkLength(v, {
    needle: sed.informasjonDetAnmodesOm,
    max: 255,
    id: namespace + '-informasjonDetAnmodesOm',
    message: 'validation:textOverX',
    personName
  }))

  return hasErrors.find(value => value) !== undefined
}
