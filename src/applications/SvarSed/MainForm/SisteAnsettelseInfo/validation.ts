import { SisteAnsettelseInfo, Utbetaling } from 'declarations/sed'
import { Validation } from 'declarations/types'
import _ from 'lodash'
import { ErrorElement } from 'declarations/app.d'
import { TFunction } from 'react-i18next'
import { getIdx } from 'utils/namespace'

export interface ValidationUtbetalingProps {
  utbetaling: Utbetaling
  index?: number
  namespace: string
}

export const validateUtbetaling = (
  v: Validation,
  t: TFunction,
  {
    utbetaling,
    index,
    namespace
  }: ValidationUtbetalingProps
): boolean => {
  let hasErrors: boolean = false
  const idx = getIdx(index)

  if (_.isEmpty(utbetaling?.utbetalingType?.trim())) {
    v[namespace + idx + '-utbetalingType'] = {
      feilmelding: t('validation:noUtbetalingType'),
      skjemaelementId: namespace + idx + '-utbetalingType'
    } as ErrorElement
    hasErrors = true
  } else {
    if (utbetaling?.utbetalingType?.trim() === 'inntekter_for_periode_etter_avslutning_av_arbeidsforhold_eller_opphør_i_selvstendig_næringsvirksomhet' &&
      _.isEmpty(utbetaling?.loennTilDato?.trim())) {
      v[namespace + idx + '-loennTilDato'] = {
        feilmelding: t('validation:noLoennTilDato'),
        skjemaelementId: namespace + idx + '-loennTilDato'
      } as ErrorElement
      hasErrors = true
    }

    if (utbetaling?.utbetalingType?.trim() === 'vederlag_for_ferie_som_ikke_er_tatt_ut_årlig_ferie' &&
      _.isEmpty(utbetaling?.feriedagerTilGode?.trim())) {
      v[namespace + idx + '-feriedagerTilGode'] = {
        feilmelding: t('validation:noFeriedagerTilGode'),
        skjemaelementId: namespace + idx + '-feriedagerTilGode'
      } as ErrorElement
      hasErrors = true
    }
  }

  if (_.isEmpty(utbetaling?.beloep?.trim())) {
    v[namespace + '-beloep'] = {
      skjemaelementId: namespace + '-beloep',
      feilmelding: t('validation:noBeløp')
    } as ErrorElement
    hasErrors = true
  }

  if (!_.isEmpty(utbetaling?.beloep?.trim()) && !utbetaling?.beloep?.trim().match(/^[\d.,]+$/)) {
    v[namespace + '-beloep'] = {
      skjemaelementId: namespace + '-beloep',
      feilmelding: t('validation:invalidBeløp')
    } as ErrorElement
    hasErrors = true
  }

  if (_.isEmpty(utbetaling?.valuta?.trim())) {
    v[namespace + idx + '-valuta'] = {
      feilmelding: t('validation:noValuta'),
      skjemaelementId: namespace + idx + '-valuta'
    } as ErrorElement
    hasErrors = true
  }

  return hasErrors
}

export const validateUtbetalinger = (
  validation: Validation,
  t: TFunction,
  utbetalinger: Array<Utbetaling> | undefined,
  namespace: string
): boolean => {
  let hasErrors: boolean = false
  utbetalinger?.forEach((utbetaling: Utbetaling, index: number) => {
    const _errors: boolean = validateUtbetaling(validation, t, {
      utbetaling,
      index,
      namespace
    })
    hasErrors = hasErrors || _errors
  })
  return hasErrors
}

interface ValidateSisteAnsettelseInfoProps {
  sisteansettelseinfo: SisteAnsettelseInfo |undefined
  namespace: string
}

export const validateSisteAnsettelseInfo = (
  v: Validation,
  t: TFunction,
  {
    sisteansettelseinfo,
    namespace
  }: ValidateSisteAnsettelseInfoProps
) => {
  let hasErrors: boolean = false
  const _errors = validateUtbetalinger(v, t, sisteansettelseinfo?.utbetalinger, namespace)
  hasErrors = hasErrors || _errors

  if (hasErrors) {
    const namespaceBits = namespace.split('-')
    const mainNamespace = namespaceBits[0]
    const personNamespace = mainNamespace + '-' + namespaceBits[1]
    const categoryNamespace = personNamespace + '-' + namespaceBits[2]
    v[mainNamespace] = { feilmelding: 'notnull', skjemaelementId: '' } as ErrorElement
    v[personNamespace] = { feilmelding: 'notnull', skjemaelementId: '' } as ErrorElement
    v[categoryNamespace] = { feilmelding: 'notnull', skjemaelementId: '' } as ErrorElement
  }
  return hasErrors
}