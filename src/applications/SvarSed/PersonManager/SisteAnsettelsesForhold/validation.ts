import { SisteAnsettelsesForhold, Utbetaling } from 'declarations/sed'
import { Validation } from 'declarations/types'
import _ from 'lodash'
import { FeiloppsummeringFeil } from 'nav-frontend-skjema'
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
      feilmelding: t('message:validation-noUtbetalingType'),
      skjemaelementId: namespace + idx + '-utbetalingType'
    } as FeiloppsummeringFeil
    hasErrors = true
  }

  if (_.isEmpty(utbetaling?.loennTilDato?.trim())) {
    v[namespace + idx + '-loennTilDato'] = {
      feilmelding: t('message:validation-noLoennTilDato'),
      skjemaelementId: namespace + idx + '-loennTilDato'
    } as FeiloppsummeringFeil
    hasErrors = true
  }

  if (_.isEmpty(utbetaling?.feriedagerTilGode?.trim())) {
    v[namespace + idx + '-feriedagerTilGode'] = {
      feilmelding: t('message:validation-noFeriedagerTilGode'),
      skjemaelementId: namespace + idx + '-feriedagerTilGode'
    } as FeiloppsummeringFeil
    hasErrors = true
  }

  if (_.isEmpty(utbetaling?.beloep?.trim())) {
    v[namespace + '-beloep'] = {
      skjemaelementId: namespace + '-beloep',
      feilmelding: t('message:validation-noBeløp')
    } as FeiloppsummeringFeil
    hasErrors = true
  }

  if (!_.isEmpty(utbetaling?.beloep?.trim()) && !utbetaling?.beloep?.trim().match(/^\d+$/)) {
    v[namespace + '-beloep'] = {
      skjemaelementId: namespace + '-beloep',
      feilmelding: t('message:validation-invalidBeløp')
    } as FeiloppsummeringFeil
    hasErrors = true
  }

  if (_.isEmpty(utbetaling?.valuta?.trim())) {
    v[namespace + idx + '-valuta'] = {
      feilmelding: t('message:validation-noValuta'),
      skjemaelementId: namespace + idx + '-valuta'
    } as FeiloppsummeringFeil
    hasErrors = true
  }

  return hasErrors
}

export const validateUtbetalinger = (
  validation: Validation,
  t: TFunction,
  utbetalinger: Array<Utbetaling>,
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

export const validateSisteansettelsesforhold = (
  v: Validation,
  t: TFunction,
  sisteansettelsesforhold: SisteAnsettelsesForhold,
  namespace: string
) => {
  let hasErrors: boolean = false
  const _errors = validateUtbetalinger(v, t, sisteansettelsesforhold?.utbetalinger, namespace)
  hasErrors = hasErrors || _errors

  if (hasErrors) {
    const namespaceBits = namespace.split('-')
    const mainNamespace = namespaceBits[0]
    const personNamespace = mainNamespace + '-' + namespaceBits[1]
    const categoryNamespace = personNamespace + '-' + namespaceBits[2]
    v[mainNamespace] = { feilmelding: 'notnull', skjemaelementId: '' } as FeiloppsummeringFeil
    v[personNamespace] = { feilmelding: 'notnull', skjemaelementId: '' } as FeiloppsummeringFeil
    v[categoryNamespace] = { feilmelding: 'notnull', skjemaelementId: '' } as FeiloppsummeringFeil
  }
  return hasErrors
}
