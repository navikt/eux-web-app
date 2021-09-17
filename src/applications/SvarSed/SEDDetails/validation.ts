import { validatePeriod } from 'components/Period/validation'
import { Periode } from 'declarations/sed'
import { Validation } from 'declarations/types'
import { TFunction } from 'react-i18next'

export interface ValidationSEDDetailsProps {
  anmodningsperiode: Periode,
  namespace: string
}

export const validateSEDDetail = (
  v: Validation,
  t: TFunction,
  {
    anmodningsperiode,
    namespace
  }: ValidationSEDDetailsProps
): boolean => {
  const hasErrors = validatePeriod(v, t, {
    period: anmodningsperiode,
    namespace
  })
  return hasErrors
}
