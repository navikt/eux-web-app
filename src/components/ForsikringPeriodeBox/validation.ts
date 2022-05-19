import { validateAdresse } from 'applications/SvarSed/Adresser/validation'
import { validateInntektOgTimer } from 'components/ForsikringPeriodeBox/InntektOgTimer/validation'
import { ForsikringPeriode, PeriodeMedForsikring, PeriodeUtenForsikring } from 'declarations/sed'
import { Validation } from 'declarations/types'
import { checkIfNotDate, checkIfNotEmpty } from 'utils/validation'

export interface ValidationForsikringPeriodeProps {
  forsikringPeriode: ForsikringPeriode | null | undefined
  nsIndex?: string
  showAddress: boolean
  showArbeidsgiver: boolean
  showInntekt: boolean
}

export const validateForsikringPeriode = (
  v: Validation,
  namespace: string,
  {
    forsikringPeriode,
    nsIndex,
    showAddress,
    showArbeidsgiver,
    showInntekt
  }: ValidationForsikringPeriodeProps
): boolean => {
  const hasErrors: Array<boolean> = []

  hasErrors.push(checkIfNotEmpty(v, {
    needle: forsikringPeriode?.startdato,
    id: namespace + (nsIndex ?? '') + '-startdato',
    message: 'validation:noDate'
  }))

  hasErrors.push(checkIfNotDate(v, {
    needle: forsikringPeriode?.startdato,
    id: namespace + (nsIndex ?? '') + '-startdato',
    message: 'validation:invalidDate'
  }))

  hasErrors.push(checkIfNotDate(v, {
    needle: forsikringPeriode?.sluttdato,
    id: namespace + (nsIndex ?? '') + '-sluttdato',
    message: 'validation:invalidDate'
  }))

  if (showArbeidsgiver) {
    hasErrors.push(checkIfNotEmpty(v, {
      needle: (forsikringPeriode as PeriodeMedForsikring)?.arbeidsgiver?.navn,
      id: namespace + (nsIndex ?? '') + '-arbeidsgiver-navn',
      message: 'validation:noNavn'
    }))

    hasErrors.push(checkIfNotEmpty(v, {
      needle: (forsikringPeriode as PeriodeMedForsikring)?.arbeidsgiver?.identifikatorer,
      id: namespace + (nsIndex ?? '') + '-arbeidsgiver-identifikatorer',
      message: 'validation:noOrgnr'
    }))
  }

  if (showAddress) {
    hasErrors.push(validateAdresse(v, namespace + (nsIndex ?? '') + '-arbeidsgiver-adresse', {
      adresse: (forsikringPeriode as PeriodeMedForsikring)?.arbeidsgiver.adresse,
      checkAdresseType: false
    }))
  }

  if (showInntekt) {
    hasErrors.push(validateInntektOgTimer(v, namespace + (nsIndex ?? '') + '-inntektOgTimer', {
      inntektOgTimer: (forsikringPeriode as PeriodeUtenForsikring)?.inntektOgTimer
    }))

    hasErrors.push(checkIfNotEmpty(v, {
      needle: (forsikringPeriode as PeriodeUtenForsikring)?.inntektOgTimerInfo,
      id: namespace + (nsIndex ?? '') + '-inntektOgTimerInfo',
      message: 'validation:noInntektOgTimerInfo'
    }))
  }
  return hasErrors.find(value => value) !== undefined
}
