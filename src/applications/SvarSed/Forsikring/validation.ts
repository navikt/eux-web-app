import { validatePeriode } from 'components/Forms/validation'
import {
  ForsikringPeriode,
  Periode,
  PeriodeAnnenForsikring,
  PeriodeMedForsikring, PeriodeUtenForsikring
} from 'declarations/sed'
import { Validation } from 'declarations/types'
import _ from 'lodash'
import { getIdx } from 'utils/namespace'
import { addError, checkIfNotEmpty } from 'utils/validation'
import { validateInntektOgTimer } from './InntektOgTimer/validation'

export interface ValidationForsikringPeriodeProps {
  periode: ForsikringPeriode
  type: string | undefined
  index?: number
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
    type,
    index,
    personName
  }: ValidationForsikringPeriodeProps
): boolean => {
  const idx = getIdx(index)
  const hasErrors: Array<boolean> = []

  if (_.isNil(index) && _.isEmpty(type)) {
    hasErrors.push(addError(v, {
      id: namespace + '-type',
      message: 'validation:noType',
      personName
    }))
  }

  hasErrors.push(validatePeriode(v, namespace + idx, {
    periode,
    personName
  }))

  if (type === 'perioderAnnenForsikring') {
    hasErrors.push(checkIfNotEmpty(v, {
      needle: (periode as PeriodeAnnenForsikring)?.annenTypeForsikringsperiode,
      id: namespace + idx + '-annenTypeForsikringsperiode',
      message: 'validation:noAnnenTypeForsikringsperiode',
      personName
    }))
  }

  if (type && ['perioderAnsattMedForsikring', 'perioderSelvstendigMedForsikring', 'perioderAnsattUtenForsikring', 'perioderSelvstendigUtenForsikring']
    .indexOf(type) >= 0) {
    hasErrors.push(checkIfNotEmpty(v, {
      needle: (periode as PeriodeMedForsikring)?.arbeidsgiver?.navn,
      id: namespace + idx + '-arbeidsgiver-navn',
      message: 'validation:noInstitusjonensNavn',
      personName
    }))
    /*  Id is not mandatory */
  }

  if (type && ['perioderAnsattUtenForsikring', 'perioderSelvstendigUtenForsikring'].indexOf(type) >= 0) {
    hasErrors.push(validateInntektOgTimer(v, namespace + idx + '-inntektOgTimer', {
      inntektOgTimer: (periode as PeriodeUtenForsikring)?.inntektOgTimer,
      personName
    }))

    hasErrors.push(checkIfNotEmpty(v, {
      needle: (periode as PeriodeUtenForsikring)?.inntektOgTimerInfo,
      id: namespace + idx + '-inntektOgTimerInfo',
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
    hasErrors.push(validateForsikringPeriode(validation, namespace + '[' + type + ']', {
      periode,
      type,
      index,
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
