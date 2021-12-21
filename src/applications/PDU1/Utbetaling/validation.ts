import { AndreMottatteUtbetalinger } from 'declarations/pd'
import { Validation } from 'declarations/types'
import _ from 'lodash'
import { TFunction } from 'react-i18next'
import { addError, propagateError } from 'utils/validation'

export interface ValidationUbetalingProps {
  utbetaling: AndreMottatteUtbetalinger
  namespace: string
}

export const validateUtbetaling = (
  v: Validation,
  t: TFunction,
  {
    utbetaling,
    namespace
  }: ValidationUbetalingProps
): boolean => {
  const hasErrors: Array<boolean> = []

  if (utbetaling?._utbetalingEtterEndtArbeidsforholdCheckbox && _.isEmpty(utbetaling?.utbetalingEtterEndtArbeidsforhold)) {
    addError(v, { id: namespace + '-utbetalingEtterEndtArbeidsforhold', message: t('validation:emptyField') })
    hasErrors.push(true)
  }

  if (utbetaling?._kompensasjonForEndtArbeidsforholdCheckbox && _.isEmpty(utbetaling?.kompensasjonForEndtArbeidsforhold)) {
    addError(v, { id: namespace + '-kompensasjonForEndtArbeidsforhold', message: t('validation:emptyField') })
    hasErrors.push(true)
  }

  if (utbetaling?._kompensasjonForFeriedagerCheckbox) {
    if (_.isEmpty(utbetaling?.kompensasjonForFeriedager?.antallDager)) {
      addError(v, { id: namespace + '-kompensasjonForFeriedager-antallDager', message: t('validation:emptyField') })
      hasErrors.push(true)
    }

    if (_.isEmpty(utbetaling?.kompensasjonForFeriedager?.beloep)) {
      addError(v, { id: namespace + '-kompensasjonForFeriedager-beloep', message: t('validation:emptyField') })
      hasErrors.push(true)
    }
  }

  if (utbetaling?._avkallKompensasjonBegrunnelseCheckbox && _.isEmpty(utbetaling?.avkallKompensasjonBegrunnelse)) {
    addError(v, { id: namespace + '-avkallKompensasjonBegrunnelse', message: t('validation:emptyField') })
    hasErrors.push(true)
  }

  if (utbetaling?._andreYtelserSomMottasForTidenCheckbox && _.isEmpty(utbetaling?.andreYtelserSomMottasForTiden)) {
    addError(v, { id: namespace + '-andreYtelserSomMottasForTiden', message: t('validation:emptyField') })
    hasErrors.push(true)
  }

  const hasError: boolean = hasErrors.find(value => value) !== undefined
  if (hasError) propagateError(v, namespace)
  return hasError
}
