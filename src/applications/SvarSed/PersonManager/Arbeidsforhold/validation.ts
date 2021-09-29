import { validatePeriode } from 'components/Forms/validation'
import { Validation } from 'declarations/types'
import { TFunction } from 'react-i18next'

export interface ValidationDatoProps {
  startdato: string
  sluttdato: string
  namespace: string
}

export const performValidationArbeidsperioderSearch = (
  v: Validation,
  t: TFunction,
  {
    startdato,
    sluttdato,
    namespace
  }: ValidationDatoProps
): boolean => {
  const hasErrors = validatePeriode(v, t, {
    periode: {
      startdato: startdato,
      sluttdato: sluttdato
    },
    namespace
  })
  return hasErrors
}
