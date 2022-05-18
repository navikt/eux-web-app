import { validateAdresse } from 'applications/SvarSed/Adresser/validation'
import { ForsikringPeriode, PeriodeMedForsikring } from 'declarations/sed'
import { Validation } from 'declarations/types'
import { checkIfNotDate, checkIfNotEmpty } from 'utils/validation'

export interface ValidationForsikringPeriodeProps {
  forsikringPeriode: ForsikringPeriode | null | undefined
  showAddress: boolean
  showArbeidsgiver: boolean
}

export const validateForsikringPeriode = (
  v: Validation,
  namespace: string,
  {
    forsikringPeriode,
    showArbeidsgiver,
    showAddress
  }: ValidationForsikringPeriodeProps
): boolean => {
  const hasErrors: Array<boolean> = []

  hasErrors.push(checkIfNotEmpty(v, {
    needle: forsikringPeriode?.startdato,
    id: namespace + '-startdato',
    message: 'validation:noDate'
  }))

  hasErrors.push(checkIfNotDate(v, {
    needle: forsikringPeriode?.startdato,
    id: namespace + '-startdato',
    message: 'validation:invalidDate'
  }))

  hasErrors.push(checkIfNotDate(v, {
    needle: forsikringPeriode?.sluttdato,
    id: namespace + '-sluttdato',
    message: 'validation:invalidDate'
  }))

  if (showArbeidsgiver) {
    hasErrors.push(checkIfNotEmpty(v, {
      needle: (forsikringPeriode as PeriodeMedForsikring)?.arbeidsgiver?.navn,
      id: namespace + '-arbeidsgiver-navn',
      message: 'validation:noNavn'
    }))

    hasErrors.push(checkIfNotEmpty(v, {
      needle: (forsikringPeriode as PeriodeMedForsikring)?.arbeidsgiver?.identifikatorer,
      id: namespace + '-arbeidsgiver-identifikatorer',
      message: 'validation:noOrgnr'
    }))
  }

  if (showAddress) {
    hasErrors.push(validateAdresse(v, namespace + '-arbeidsgiver-adresse', {
      adresse: (forsikringPeriode as PeriodeMedForsikring)?.arbeidsgiver.adresse,
      checkAdresseType: false
    }))
  }
  return hasErrors.find(value => value) !== undefined
}
