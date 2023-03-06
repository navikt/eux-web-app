import { validateForsikringPeriodeBox } from 'components/ForsikringPeriodeBox/validation'
import { ForsikringPeriode, Periode, ReplySed, U002Sed } from 'declarations/sed'
import { Validation } from 'declarations/types'
import { getNSIdx } from 'utils/namespace'
import { checkIfNotEmpty } from 'utils/validation'
import {periodeSort} from "../../../utils/sort";

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

export interface ValidateForsikringProps {
  replySed: ReplySed
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

  const showAnnen = periode?.__type === 'perioderAnnenForsikring'
  const showArbeidsgiver = !!periode?.__type && ['perioderAnsattMedForsikring', 'perioderSelvstendigMedForsikring', 'perioderAnsattUtenForsikring', 'perioderSelvstendigUtenForsikring'].indexOf(periode?.__type) >= 0
  const showInntekt = !!periode?.__type && ['perioderAnsattUtenForsikring', 'perioderSelvstendigUtenForsikring'].indexOf(periode?.__type) >= 0
  const showAddress = showArbeidsgiver
  const validateAddress = false
  const showBeløp = periode?.__type === 'perioderKompensertFerie'
  hasErrors.push(validateForsikringPeriodeBox(v, namespace, {
    forsikringPeriode: periode,
    nsIndex,
    showAddress,
    validateAddress,
    showArbeidsgiver,
    showInntekt,
    showAnnen,
    showBeløp
  }))
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
  perioder?.sort(periodeSort).forEach((periode: Periode, index: number) => {
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

export const validateForsikring = (
  v: Validation,
  namespace: string,
  {
    replySed,
    personName
  } : ValidateForsikringProps
): boolean => {
  const hasErrors: Array<boolean> = []
  hasErrors.push(validateForsikringPerioder(v, namespace, { type: 'perioderAnsattMedForsikring', perioder: (replySed as U002Sed).perioderAnsattMedForsikring, personName }))
  hasErrors.push(validateForsikringPerioder(v, namespace, { type: 'perioderSelvstendigMedForsikring', perioder: (replySed as U002Sed).perioderSelvstendigMedForsikring, personName }))
  hasErrors.push(validateForsikringPerioder(v, namespace, { type: 'perioderAnsattUtenForsikring', perioder: (replySed as U002Sed).perioderAnsattUtenForsikring, personName }))
  hasErrors.push(validateForsikringPerioder(v, namespace, { type: 'perioderSelvstendigUtenForsikring', perioder: (replySed as U002Sed).perioderSelvstendigUtenForsikring, personName }))
  hasErrors.push(validateForsikringPerioder(v, namespace, { type: 'perioderSyk', perioder: (replySed as U002Sed).perioderSyk, personName }))
  hasErrors.push(validateForsikringPerioder(v, namespace, { type: 'perioderSvangerskapBarn', perioder: (replySed as U002Sed).perioderSvangerskapBarn, personName }))
  hasErrors.push(validateForsikringPerioder(v, namespace, { type: 'perioderUtdanning', perioder: (replySed as U002Sed).perioderUtdanning, personName }))
  hasErrors.push(validateForsikringPerioder(v, namespace, { type: 'perioderMilitaertjeneste', perioder: (replySed as U002Sed).perioderMilitaertjeneste, personName }))
  hasErrors.push(validateForsikringPerioder(v, namespace, { type: 'perioderFrihetsberoevet', perioder: (replySed as U002Sed).perioderFrihetsberoevet, personName }))
  hasErrors.push(validateForsikringPerioder(v, namespace, { type: 'perioderFrivilligForsikring', perioder: (replySed as U002Sed).perioderFrivilligForsikring, personName }))
  hasErrors.push(validateForsikringPerioder(v, namespace, { type: 'perioderKompensertFerie', perioder: (replySed as U002Sed).perioderKompensertFerie, personName }))
  hasErrors.push(validateForsikringPerioder(v, namespace, { type: 'perioderAnnenForsikring', perioder: (replySed as U002Sed).perioderAnnenForsikring, personName }))
  return hasErrors.find(value => value) !== undefined
}
