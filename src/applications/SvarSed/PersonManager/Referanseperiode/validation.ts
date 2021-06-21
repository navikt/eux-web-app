import { validatePeriod } from 'components/Period/validation'
import { Periode } from 'declarations/sed'
import { Validation } from 'declarations/types'
import { TFunction } from 'react-i18next'

export interface ValidationReferanseperiodeProps {
  anmodningsperiode: Periode
  namespace: string
  personName: string
}

export const validateReferanseperiode = (
  v: Validation,
  t: TFunction,
  {
    anmodningsperiode,
    namespace,
    personName
  }: ValidationReferanseperiodeProps
): boolean => {
  const hasErrors = validatePeriod(v, t, {
    period: anmodningsperiode,
    namespace,
    personName
  })
  return hasErrors
}
