import { validatePeriod } from 'components/Period/validation'
import { Validation } from 'declarations/types'
import { TFunction } from 'react-i18next'

export interface ValidationDatoProps {
  startdato: string
  sluttdato: string
  namespace: string
}

export const validateDato = (
  v: Validation,
  t: TFunction,
  {
    startdato,
    sluttdato,
    namespace
  }: ValidationDatoProps
): boolean => {
  const hasErrors = validatePeriod(v, t, {
    period: {
      startdato: startdato,
      sluttdato: sluttdato
    },
    namespace
  })
  return hasErrors
}
