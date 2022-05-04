import { validatePeriode } from 'components/Forms/validation'
import { Periode } from 'declarations/sed'
import { Validation } from 'declarations/types'

export interface ValidationReferanseperiodeProps {
  anmodningsperiode: Periode | undefined
  personName?: string
}

export const validateReferanseperiode = (
  v: Validation,
  namespace: string,
  {
    anmodningsperiode,
    personName
  }: ValidationReferanseperiodeProps
): boolean => {
  const hasErrors = validatePeriode(v, namespace, {
    periode: anmodningsperiode,
    personName
  })
  return hasErrors
}
