import { PeriodeMedForsikring } from 'declarations/sed'
import { Validation } from 'declarations/types'
import _ from 'lodash'
import moment from 'moment'
import { getOrgnr } from 'utils/arbeidsperioder'
import { addError, checkIfNotDate, checkIfNotEmpty } from 'utils/validation'

export interface ValidationArbeidsgiverProps {
  arbeidsgiver: PeriodeMedForsikring
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

export const validateArbeidsgiver = (
  v: Validation,
  namespace: string,
  {
    arbeidsgiver,
    includeAddress
  }: ValidationArbeidsgiverProps
): boolean => {
  const hasErrors: Array<boolean> = []

  hasErrors.push(checkIfNotEmpty(v, {
    needle: arbeidsgiver.arbeidsgiver?.navn,
    id: namespace + '-navn',
    message: 'validation:noNavn'
  }))

  hasErrors.push(checkIfNotEmpty(v, {
    needle: getOrgnr(arbeidsgiver, 'organisasjonsnummer'),
    id: namespace + '-orgnr',
    message: 'validation:noOrgnr'
  }))

  hasErrors.push(checkIfNotEmpty(v, {
    needle: arbeidsgiver.startdato,
    id: namespace + '-startdato',
    message: 'validation:noDate'
  }))

  hasErrors.push(checkIfNotDate(v, {
    needle: arbeidsgiver.startdato,
    id: namespace + '-startdato',
    message: 'validation:invalidDate'
  }))

  hasErrors.push(checkIfNotDate(v, {
    needle: arbeidsgiver.sluttdato,
    id: namespace + '-sluttdato',
    message: 'validation:invalidDate'
  }))

  if (includeAddress && (
    !_.isEmpty((arbeidsgiver as PeriodeMedForsikring).arbeidsgiver.adresse?.gate) ||
    !_.isEmpty((arbeidsgiver as PeriodeMedForsikring).arbeidsgiver.adresse?.postnummer) ||
    !_.isEmpty((arbeidsgiver as PeriodeMedForsikring).arbeidsgiver.adresse?.by) ||
    !_.isEmpty((arbeidsgiver as PeriodeMedForsikring).arbeidsgiver.adresse?.land)
  )) {
    hasErrors.push(checkIfNotEmpty(v, {
      needle: (arbeidsgiver as PeriodeMedForsikring).arbeidsgiver.adresse?.gate,
      id: namespace + '-gate',
      message: 'validation:noAddressStreet'
    }))

    hasErrors.push(checkIfNotEmpty(v, {
      needle: (arbeidsgiver as PeriodeMedForsikring).arbeidsgiver.adresse?.postnummer,
      id: namespace + '-postnummer',
      message: 'validation:noAddressPostnummer'
    }))

    hasErrors.push(checkIfNotEmpty(v, {
      needle: (arbeidsgiver as PeriodeMedForsikring).arbeidsgiver.adresse?.by,
      id: namespace + '-by',
      message: 'validation:noAddressCity'
    }))

    hasErrors.push(checkIfNotEmpty(v, {
      needle: (arbeidsgiver as PeriodeMedForsikring).arbeidsgiver.adresse?.land,
      id: namespace + '-land',
      message: 'validation:noAddressCountry'
    }))
  }
  return hasErrors.find(value => value) !== undefined
}
