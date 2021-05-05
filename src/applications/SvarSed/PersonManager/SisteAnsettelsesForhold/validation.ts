import { validatePeriod } from 'components/Period/validation'
import { Periode } from 'declarations/sed'
import { Validation } from 'declarations/types'
import { TFunction } from 'react-i18next'

export interface ValidationReferanseperiodeProps {
  period: Periode
  namespace: string
}

export const validateReferanseperiode = (
  v: Validation,
  t: TFunction,
  {
    period,
    namespace
  }: ValidationReferanseperiodeProps
): boolean => {
  let hasErrors = validatePeriod(v, t, {
    period,
    namespace
  })
  return hasErrors
}
