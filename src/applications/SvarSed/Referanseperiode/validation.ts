import { validatePeriode } from 'components/Forms/validation'
import { Periode } from 'declarations/sed'
import { Validation } from 'declarations/types'

export interface ValidationReferanseperiodeProps {
  anmodningsperiode: Periode
  namespace: string
  personName?: string
}

export const validateReferanseperiode = (
  v: Validation,
  {
    anmodningsperiode,
    namespace,
    personName
  }: ValidationReferanseperiodeProps
): boolean => {
  const hasErrors = validatePeriode(v, {
    periode: anmodningsperiode,
    namespace,
    personName
  })
  return hasErrors
}
