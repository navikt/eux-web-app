import { validateAdresse } from 'applications/SvarSed/Adresser/validation'
import { validateInntektOgTimer } from 'components/ForsikringPeriodeBox/InntektOgTimer/validation'
import {
  ForsikringPeriode,
  PeriodeAnnenForsikring, PeriodeFerieForsikring,
  PeriodeMedForsikring,
  PeriodeUtenForsikring
} from 'declarations/sed'
import { Validation } from 'declarations/types'
import { checkIfNotDate, checkIfNotEmpty, checkIfNotNumber } from 'utils/validation'

export interface ValidationForsikringPeriodeBoxProps {
  forsikringPeriode: ForsikringPeriode | null | undefined
  nsIndex?: string
  showAddress: boolean
  validateAddress: boolean
  showArbeidsgiver: boolean
  showInntekt: boolean
  showAnnen: boolean
  showBeløp: boolean
}

export const validateForsikringPeriodeBox = (
  v: Validation,
  namespace: string,
  {
    forsikringPeriode,
    nsIndex,
    showAddress,
    validateAddress,
    showArbeidsgiver,
    showInntekt,
    showAnnen,
    showBeløp
  }: ValidationForsikringPeriodeBoxProps
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
      message: 'validation:noNavnInstitusjon'
    }))
  }

  if (showAddress && validateAddress) {
    hasErrors.push(validateAdresse(v, namespace + (nsIndex ?? '') + '-arbeidsgiver-adresse', {
      adresse: (forsikringPeriode as PeriodeMedForsikring)?.arbeidsgiver?.adresse,
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
      message: 'validation:noInfo'
    }))
  }

  if (showAnnen) {
    hasErrors.push(checkIfNotEmpty(v, {
      needle: (forsikringPeriode as PeriodeAnnenForsikring)?.annenTypeForsikringsperiode,
      id: namespace + (nsIndex ?? '') + '-annenTypeForsikringsperiode',
      message: 'validation:noAnnenTypeForsikringsperiode'
    }))
  }

  if (showBeløp) {
    hasErrors.push(checkIfNotEmpty(v, {
      needle: (forsikringPeriode as PeriodeFerieForsikring)?.beloep,
      id: namespace + (nsIndex ?? '') + '-beloep',
      message: 'validation:noBeløp'
    }))

    hasErrors.push(checkIfNotNumber(v, {
      needle: (forsikringPeriode as PeriodeFerieForsikring)?.beloep,
      id: namespace + (nsIndex ?? '') + '-beloep',
      message: 'validation:invalidBeløp'
    }))

    hasErrors.push(checkIfNotEmpty(v, {
      needle: (forsikringPeriode as PeriodeFerieForsikring)?.valuta,
      id: namespace + (nsIndex ?? '') + '-valuta',
      message: 'validation:noValuta'
    }))
  }

  return hasErrors.find(value => value) !== undefined
}
