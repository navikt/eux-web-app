import { X002Sed } from 'declarations/sed'
import { Validation } from 'declarations/types'
import { checkIfInteger } from 'utils/validation'

export interface ValidationKontekstProps {
  replySed: X002Sed
  personName ?: string | undefined
}

export const validateKontekst = (
  v: Validation,
  namespace: string,
  {
    replySed,
    personName
  }: ValidationKontekstProps
): boolean => {
  const hasErrors: Array<boolean> = []

  if (replySed.refusjonskrav) {
    hasErrors.push(checkIfInteger(v, {
      needle: replySed.refusjonskrav?.antallkrav,
      id: namespace + '-refusjonskrav-antallkrav',
      message: 'validation:notInteger',
      personName
    }))
  }

  return hasErrors.find(value => value) !== undefined
}
