import { H005Sed } from 'declarations/h005'
import { ReplySed } from 'declarations/sed'
import { Validation } from 'declarations/types'
import { checkIfNotEmpty, checkLength } from 'utils/validation'

export interface ValidationAnmodningOmInformasjonProps {
  replySed: ReplySed
  personName?: string
}

export const validateAnmodningOmInformasjon = (
  v: Validation,
  namespace: string,
  {
    replySed,
    personName
  }: ValidationAnmodningOmInformasjonProps
): boolean => {
  const hasErrors: Array<boolean> = []
  const sed = replySed as H005Sed

  hasErrors.push(checkIfNotEmpty(v, {
    needle: sed.anmodningOmInformasjon,
    id: namespace + '-anmodningOmInformasjon',
    message: 'validation:noAnmodningOmInformasjon',
    personName
  }))

  hasErrors.push(checkLength(v, {
    needle: sed.anmodningOmInformasjon,
    max: 255,
    id: namespace + '-anmodningOmInformasjon',
    message: 'validation:textOverX',
    personName
  }))

  return hasErrors.find(value => value) !== undefined
}
