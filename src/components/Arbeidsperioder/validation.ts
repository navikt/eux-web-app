import { validateAdresse } from 'applications/SvarSed/Adresser/validation'
import { PeriodeMedForsikring } from 'declarations/sed'
import { Validation } from 'declarations/types'
import moment from 'moment'
import { addError, checkIfNotDate, checkIfNotEmpty } from 'utils/validation'

export interface ValidationPeriodeMedForsikringProps {
  periodeMedForsikring: PeriodeMedForsikring | undefined
  includeAddress: boolean
}

export interface ValidationArbeidsperioderSøkProps {
  fom: string
  tom: string
  inntektslistetype: string
}

const dateSearchPattern = /^\d{4}-\d{2}$/

export const validateArbeidsperioderSøk = (
  v: Validation,
  namespace: string,
  {
    fom,
    tom,
    inntektslistetype
  }: ValidationArbeidsperioderSøkProps
): boolean => {
  const hasErrors: Array<boolean> = []

  hasErrors.push(checkIfNotEmpty(v, {
    needle: fom,
    id: namespace + '-startdato',
    message: 'validation:noDate'
  }))

  hasErrors.push(checkIfNotDate(v, {
    needle: fom,
    pattern: dateSearchPattern,
    id: namespace + '-startdato',
    message: 'validation:invalidDate'
  }))

  if (fom.trim().match(dateSearchPattern)) {
    const fomDate = moment(fom, 'YYYY-MM')
    if (fomDate.isBefore(new Date(2015, 0, 1))) {
      hasErrors.push(addError(v, {
        id: namespace + '-startdato',
        message: 'validation:invalidDate2015'
      }))
    }
  }

  hasErrors.push(checkIfNotEmpty(v, {
    needle: tom,
    id: namespace + '-sluttdato',
    message: 'validation:noDate'
  }))

  hasErrors.push(checkIfNotDate(v, {
    needle: tom,
    pattern: dateSearchPattern,
    id: namespace + '-sluttdato',
    message: 'validation:invalidDate'
  }))

  if (tom.trim().match(dateSearchPattern)) {
    const fomDate = moment(fom, 'YYYY-MM')
    const tomDate = moment(tom, 'YYYY-MM')
    if (tomDate.isBefore(fomDate)) {
      hasErrors.push(addError(v, {
        id: namespace + '-sluttdato',
        message: 'validation:invalidDateFomTom'
      }))
    }
  }

  hasErrors.push(checkIfNotEmpty(v, {
    needle: inntektslistetype,
    id: namespace + '-inntektslistetype',
    message: 'validation:noInntektsliste'
  }))

  return hasErrors.find(value => value) !== undefined
}

export const validatePeriodeMedForsikring = (
  v: Validation,
  namespace: string,
  {
    periodeMedForsikring,
    includeAddress
  }: ValidationPeriodeMedForsikringProps
): boolean => {
  const hasErrors: Array<boolean> = []

  hasErrors.push(checkIfNotEmpty(v, {
    needle: periodeMedForsikring?.arbeidsgiver?.navn,
    id: namespace + '-arbeidsgiver-navn',
    message: 'validation:noNavn'
  }))

  hasErrors.push(checkIfNotEmpty(v, {
    needle: periodeMedForsikring?.arbeidsgiver?.identifikatorer,
    id: namespace + '-arbeidsgiver-identifikatorer',
    message: 'validation:noOrgnr'
  }))

  hasErrors.push(checkIfNotEmpty(v, {
    needle: periodeMedForsikring?.startdato,
    id: namespace + '-startdato',
    message: 'validation:noDate'
  }))

  hasErrors.push(checkIfNotDate(v, {
    needle: periodeMedForsikring?.startdato,
    id: namespace + '-startdato',
    message: 'validation:invalidDate'
  }))

  hasErrors.push(checkIfNotDate(v, {
    needle: periodeMedForsikring?.sluttdato,
    id: namespace + '-sluttdato',
    message: 'validation:invalidDate'
  }))

  if (includeAddress) {
    hasErrors.push(validateAdresse(v, namespace + '-arbeidsgiver-adresse', {
      adresse: periodeMedForsikring?.arbeidsgiver.adresse,
      checkAdresseType: false
    }))
  }
  return hasErrors.find(value => value) !== undefined
}
