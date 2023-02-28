import { SisteAnsettelseInfo, Utbetaling } from 'declarations/sed'
import { Validation } from 'declarations/types'
import _ from 'lodash'
import { getIdx } from 'utils/namespace'
import {addError, checkIfNotEmpty, checkIfNotNumber, checkLength} from 'utils/validation'


export interface ValidationUtbetalingProps {
  utbetaling: Utbetaling | undefined
  index?: number
  personName ?: string
}

export interface ValidationUtbetalingerProps {
  utbetalinger: Array<Utbetaling> | undefined
  personName ?: string
}

export interface ValidateSisteAnsettelseInfoProps {
  sisteAnsettelseInfo: SisteAnsettelseInfo |undefined
  personName ?: string
}

export const validateUtbetaling = (
  v: Validation,
  namespace: string,
  {
    utbetaling,
    index,
    personName
  }: ValidationUtbetalingProps
): boolean => {
  const hasErrors: Array<boolean> = []
  const idx = getIdx(index)

  hasErrors.push(checkIfNotEmpty(v, {
    needle: utbetaling?.utbetalingType,
    id: namespace + idx + '-utbetalingType',
    message: 'validation:noUtbetalingType',
    personName
  }))

  if (!_.isEmpty(utbetaling?.utbetalingType?.trim())) {
    if (utbetaling?.utbetalingType?.trim() === 'inntekter_for_periode_etter_avslutning_av_arbeidsforhold_eller_opphør_i_selvstendig_næringsvirksomhet' &&
      _.isEmpty(utbetaling?.loennTilDato?.trim())) {
      hasErrors.push(addError(v, {
        id: namespace + idx + '-loennTilDato',
        message: 'validation:noLoennTilDato',
        personName
      }))
    }
  }

  hasErrors.push(checkIfNotEmpty(v, {
    needle: utbetaling?.beloep,
    id: namespace + '-beloep',
    message: 'validation:noBeløp',
    personName
  }))

  hasErrors.push(checkIfNotNumber(v, {
    needle: utbetaling?.beloep,
    id: namespace + '-beloep',
    message: 'validation:invalidBeløp',
    personName
  }))

  hasErrors.push(checkIfNotEmpty(v, {
    needle: utbetaling?.valuta,
    id: namespace + '-valuta',
    message: 'validation:noValuta',
    personName
  }))

  return hasErrors.find(value => value) !== undefined
}

export const validateUtbetalinger = (
  validation: Validation,
  namespace: string,
  {
    utbetalinger,
    personName
  }: ValidationUtbetalingerProps
): boolean => {
  let hasErrors: boolean = false
  utbetalinger?.forEach((utbetaling: Utbetaling, index: number) => {
    const _errors: boolean = validateUtbetaling(validation, namespace, {
      utbetaling,
      index,
      personName
    })
    hasErrors = hasErrors || _errors
  })
  return hasErrors
}

export const validateSisteAnsettelseInfo = (
  v: Validation,
  namespace: string,
  {
    sisteAnsettelseInfo,
    personName
  }: ValidateSisteAnsettelseInfoProps
) => {
  const hasErrors: Array<boolean> = []

  if(!_.isEmpty(sisteAnsettelseInfo?.opphoerRettighet)){
    hasErrors.push(checkLength(v, {
      needle: sisteAnsettelseInfo?.opphoerRettighet,
      max: 255,
      id: namespace + '-opphoerRettighet',
      message: 'validation:textOverX',
      personName
    }))
  }

  if(!_.isEmpty(sisteAnsettelseInfo?.opphoerRettighetGrunn)){
    hasErrors.push(checkLength(v, {
      needle: sisteAnsettelseInfo?.opphoerRettighetGrunn,
      max: 255,
      id: namespace + '-opphoerRettighetGrunn',
      message: 'validation:textOverX',
      personName
    }))
  }

  if(!_.isEmpty(sisteAnsettelseInfo?.opphoerYtelse)){
    hasErrors.push(checkLength(v, {
      needle: sisteAnsettelseInfo?.opphoerYtelse,
      max: 255,
      id: namespace + '-opphoerYtelse',
      message: 'validation:textOverX',
      personName
    }))
  }

  hasErrors.push(validateUtbetalinger(v, namespace, {
    utbetalinger: sisteAnsettelseInfo?.utbetalinger,
    personName
  }))
  return hasErrors.find(value => value) !== undefined
}
