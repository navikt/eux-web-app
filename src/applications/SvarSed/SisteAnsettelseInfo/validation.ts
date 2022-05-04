import { SisteAnsettelseInfo, Utbetaling } from 'declarations/sed'
import { Validation } from 'declarations/types'
import _ from 'lodash'
import { getIdx } from 'utils/namespace'
import { addError, checkIfNotEmpty, checkIfNotNumber } from 'utils/validation'

export interface ValidationUtbetalingProps {
  utbetaling: Utbetaling
  index?: number
}

export interface ValidationUtbetalingerProps {
  utbetalinger: Array<Utbetaling> | undefined
}

export const validateUtbetaling = (
  v: Validation,
  namespace: string,
  {
    utbetaling,
    index
  }: ValidationUtbetalingProps
): boolean => {
  const hasErrors: Array<boolean> = []
  const idx = getIdx(index)

  hasErrors.push(checkIfNotEmpty(v, {
    needle: utbetaling?.utbetalingType,
    id: namespace + idx + '-utbetalingType',
    message: 'validation:noUtbetalingType'
  }))

  if (!_.isEmpty(utbetaling?.utbetalingType?.trim())) {
    if (utbetaling?.utbetalingType?.trim() === 'inntekter_for_periode_etter_avslutning_av_arbeidsforhold_eller_opphør_i_selvstendig_næringsvirksomhet' &&
      _.isEmpty(utbetaling?.loennTilDato?.trim())) {
      hasErrors.push(addError(v, {
        id: namespace + idx + '-loennTilDato',
        message: 'validation:noLoennTilDato'
      }))
    }

    if (utbetaling?.utbetalingType?.trim() === 'vederlag_for_ferie_som_ikke_er_tatt_ut_årlig_ferie' &&
      _.isEmpty(utbetaling?.feriedagerTilGode?.trim())) {
      hasErrors.push(addError(v, {
        id: namespace + idx + '-feriedagerTilGode',
        message: 'validation:noFeriedagerTilGode'
      }))
    }
  }

  hasErrors.push(checkIfNotEmpty(v, {
    needle: utbetaling?.beloep,
    id: namespace + '-beloep',
    message: 'validation:noBeløp'
  }))

  hasErrors.push(checkIfNotNumber(v, {
    needle: utbetaling?.beloep,
    id: namespace + '-beloep',
    message: 'validation:invalidBeløp'
  }))

  hasErrors.push(checkIfNotEmpty(v, {
    needle: utbetaling?.valuta,
    id: namespace + '-valuta',
    message: 'validation:noValuta'
  }))

  return hasErrors.find(value => value) !== undefined
}

export const validateUtbetalinger = (
  validation: Validation,
  namespace: string,
  { utbetalinger }: ValidationUtbetalingerProps
): boolean => {
  let hasErrors: boolean = false
  utbetalinger?.forEach((utbetaling: Utbetaling, index: number) => {
    const _errors: boolean = validateUtbetaling(validation, namespace, {
      utbetaling,
      index
    })
    hasErrors = hasErrors || _errors
  })
  return hasErrors
}

interface ValidateSisteAnsettelseInfoProps {
  sisteansettelseinfo: SisteAnsettelseInfo |undefined
}

export const validateSisteAnsettelseInfo = (
  v: Validation,
  namespace: string,
  {
    sisteansettelseinfo
  }: ValidateSisteAnsettelseInfoProps
) => {
  const hasErrors: Array<boolean> = []
  hasErrors.push(validateUtbetalinger(v, namespace, {
    utbetalinger: sisteansettelseinfo?.utbetalinger
  }))
  return hasErrors.find(value => value) !== undefined
}
