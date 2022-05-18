import { validatePeriode } from 'components/Forms/validation'
import {
  Periode,
  PeriodeAnnenForsikring,
  ForsikringPeriode,
  PeriodeUtenForsikring, PeriodeMedForsikring
} from 'declarations/sed'
import { Validation } from 'declarations/types'
import { getNSIdx } from 'utils/namespace'
import { checkIfNotEmpty } from 'utils/validation'
import { validateInntektOgTimer } from 'components/ForsikringPeriodeBox/InntektOgTimer/validation'

export interface ValidationForsikringPeriodeProps {
  periode: ForsikringPeriode | undefined
  nsIndex?: string
  personName?: string
}

interface ValidateForsikringPerioderProps {
  perioder: Array<ForsikringPeriode> |undefined
  type: string
  personName?: string
}

interface ValidateAlleForsikringPerioderProps {
  perioder: {[k in string]: Array<ForsikringPeriode> | undefined}
  personName?: string
}

export const validateForsikringPeriode = (
  v: Validation,
  namespace: string,
  {
    periode,
    nsIndex,
    personName
  }: ValidationForsikringPeriodeProps
): boolean => {
  const hasErrors: Array<boolean> = []

  hasErrors.push(checkIfNotEmpty(v, {
    needle: periode?.__type,
    id: namespace + (nsIndex ?? '') + '-type',
    message: 'validation:noType',
    personName
  }))

  hasErrors.push(validatePeriode(v, namespace + (nsIndex ?? ''), {
    periode,
    personName
  }))

  if (periode?.__type === 'perioderAnnenForsikring') {
    hasErrors.push(checkIfNotEmpty(v, {
      needle: (periode as PeriodeAnnenForsikring)?.annenTypeForsikringsperiode,
      id: namespace + (nsIndex ?? '') + '-annenTypeForsikringsperiode',
      message: 'validation:noAnnenTypeForsikringsperiode',
      personName
    }))
  }

  if (periode?.__type && ['perioderAnsattMedForsikring', 'perioderSelvstendigMedForsikring', 'perioderAnsattUtenForsikring', 'perioderSelvstendigUtenForsikring']
    .indexOf(periode?.__type) >= 0) {
    hasErrors.push(checkIfNotEmpty(v, {
      needle: (periode as PeriodeMedForsikring)?.arbeidsgiver?.navn,
      id: namespace + (nsIndex ?? '') + '-arbeidsgiver-navn',
      message: 'validation:noInstitusjonensNavn',
      personName
    }))
    /*  Id is not mandatory */
  }

  if (periode?.__type && ['perioderAnsattUtenForsikring', 'perioderSelvstendigUtenForsikring'].indexOf(periode?.__type) >= 0) {
    hasErrors.push(validateInntektOgTimer(v, namespace + (nsIndex ?? '') + '-inntektOgTimer', {
      inntektOgTimer: (periode as PeriodeUtenForsikring)?.inntektOgTimer,
      personName
    }))

    hasErrors.push(checkIfNotEmpty(v, {
      needle: (periode as PeriodeUtenForsikring)?.inntektOgTimerInfo,
      id: namespace + (nsIndex ?? '') + '-inntektOgTimerInfo',
      message: 'validation:noInntektInfo',
      personName
    }))
  }
  return hasErrors.find(value => value) !== undefined
}

export const validateForsikringPerioder = (
  validation: Validation,
  namespace: string,
  {
    type,
    perioder,
    personName
  }: ValidateForsikringPerioderProps
): boolean => {
  const hasErrors: Array<boolean> = []
  perioder?.forEach((periode: Periode, index: number) => {
    if (!Object.prototype.hasOwnProperty.call(periode as ForsikringPeriode, '__type')) {
      periode.__type = type
      periode.__index = index
    }
    hasErrors.push(validateForsikringPeriode(validation, namespace, {
      periode,
      nsIndex: getNSIdx(type, index),
      personName
    }))
  })
  return hasErrors.find(value => value) !== undefined
}

export const validateAlleForsikringPerioder = (
  v: Validation,
  namespace: string,
  {
    perioder,
    personName
  } : ValidateAlleForsikringPerioderProps
): boolean => {
  const hasErrors: Array<boolean> = []

  hasErrors.push(validateForsikringPerioder(v, namespace, { type: 'perioderAnsattMedForsikring', perioder: perioder.perioderAnsattMedForsikring, personName }))
  hasErrors.push(validateForsikringPerioder(v, namespace, { type: 'perioderSelvstendigMedForsikring', perioder: perioder.perioderSelvstendigMedForsikring, personName }))
  hasErrors.push(validateForsikringPerioder(v, namespace, { type: 'perioderAnsattUtenForsikring', perioder: perioder.perioderAnsattUtenForsikring, personName }))
  hasErrors.push(validateForsikringPerioder(v, namespace, { type: 'perioderSelvstendigUtenForsikring', perioder: perioder.perioderSelvstendigUtenForsikring, personName }))
  hasErrors.push(validateForsikringPerioder(v, namespace, { type: 'perioderSyk', perioder: perioder.perioderSyk, personName }))
  hasErrors.push(validateForsikringPerioder(v, namespace, { type: 'perioderSvangerskapBarn', perioder: perioder.perioderSvangerskapBarn, personName }))
  hasErrors.push(validateForsikringPerioder(v, namespace, { type: 'perioderUtdanning', perioder: perioder.perioderUtdanning, personName }))
  hasErrors.push(validateForsikringPerioder(v, namespace, { type: 'perioderMilitaertjeneste', perioder: perioder.perioderMilitaertjeneste, personName }))
  hasErrors.push(validateForsikringPerioder(v, namespace, { type: 'perioderFrihetsberoevet', perioder: perioder.perioderFrihetsberoevet, personName }))
  hasErrors.push(validateForsikringPerioder(v, namespace, { type: 'perioderFrivilligForsikring', perioder: perioder.perioderFrivilligForsikring, personName }))
  hasErrors.push(validateForsikringPerioder(v, namespace, { type: 'perioderKompensertFerie', perioder: perioder.perioderKompensertFerie, personName }))
  hasErrors.push(validateForsikringPerioder(v, namespace, { type: 'perioderAnnenForsikring', perioder: perioder.perioderAnnenForsikring, personName }))
  return hasErrors.find(value => value) !== undefined
}
