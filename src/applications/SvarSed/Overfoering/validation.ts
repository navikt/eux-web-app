import { H065Sed, ReplySed } from 'declarations/sed'
import { Validation } from 'declarations/types'
import { checkLength } from 'utils/validation'

export interface ValidationOverfoeringProps {
  replySed: ReplySed
  personName?: string
}

export const validateOverfoering = (
  v: Validation,
  namespace: string,
  {
    replySed,
    personName
  }: ValidationOverfoeringProps
): boolean => {
  const hasErrors: Array<boolean> = []

  hasErrors.push(checkLength(v, {
    needle: (replySed as H065Sed).overfoering?.krav,
    max: 500,
    id: namespace + '-krav',
    message: 'validation:textOverX',
    personName
  }))

  hasErrors.push(checkLength(v, {
    needle: (replySed as H065Sed).overfoering?.dokument,
    max: 500,
    id: namespace + '-dokument',
    message: 'validation:textOverX',
    personName
  }))

  hasErrors.push(checkLength(v, {
    needle: (replySed as H065Sed).overfoering?.informasjon,
    max: 500,
    id: namespace + '-informasjon',
    message: 'validation:textOverX',
    personName
  }))

  return hasErrors.find(value => value) !== undefined
}
