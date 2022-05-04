import { AndreMottatteUtbetalinger } from 'declarations/pd'
import { Validation } from 'declarations/types'
import _ from 'lodash'
import { addError } from 'utils/validation'

export interface ValidationUtbetalingProps {
  utbetaling: AndreMottatteUtbetalinger
  namespace: string
}

export const validateUtbetaling = (
  v: Validation,
  {
    utbetaling,
    namespace
  }: ValidationUtbetalingProps
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

  return hasErrors.find(value => value) !== undefined
}
