import { validatePeriode } from 'components/Forms/validation'
import { Periode } from 'declarations/sed'
import { Validation } from 'declarations/types'
import { TFunction } from 'react-i18next'

export interface ValidationReferanseperiodeProps {
  periode: Periode
  namespace: string
}

export const validateReferanseperiode = (
  v: Validation,
  t: TFunction,
  {
    periode,
    namespace
  }: ValidationReferanseperiodeProps
): boolean => {
  const hasErrors = validatePeriode(v, t, {
    periode,
    namespace
  })
  return hasErrors
}
