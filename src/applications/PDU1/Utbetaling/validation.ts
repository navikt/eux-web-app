import { AndreMottatteUtbetalinger } from 'declarations/pd'
import { Validation } from 'declarations/types'
import _ from 'lodash'
import { addError } from 'utils/validation'

export interface ValidationUtbetalingProps {
  utbetaling: AndreMottatteUtbetalinger | undefined
}

export const validateUtbetaling = (
  v: Validation,
  namespace: string,
  {
    utbetaling
  }: ValidationUtbetalingProps
): boolean => {
  const hasErrors: Array<boolean> = []

  if (utbetaling?._utbetalingEtterEndtArbeidsforholdCheckbox && _.isEmpty(utbetaling?.utbetalingEtterEndtArbeidsforhold)) {
    hasErrors.push(addError(v, {
      id: namespace + '-utbetalingEtterEndtArbeidsforhold',
      message: 'validation:emptyField'
    }))
  }

  if (utbetaling?._kompensasjonForEndtArbeidsforholdCheckbox && _.isEmpty(utbetaling?.kompensasjonForEndtArbeidsforhold)) {
    hasErrors.push(addError(v, {
      id: namespace + '-kompensasjonForEndtArbeidsforhold',
      message: 'validation:emptyField'
    }))
  }

  if (utbetaling?._kompensasjonForFeriedagerCheckbox) {
    if (_.isEmpty(utbetaling?.kompensasjonForFeriedager?.antallDager)) {
      hasErrors.push(addError(v, {
        id: namespace + '-kompensasjonForFeriedager-antallDager',
        message: 'validation:emptyField'
      }))
    }

    if (_.isEmpty(utbetaling?.kompensasjonForFeriedager?.beloep)) {
      hasErrors.push(addError(v, {
        id: namespace + '-kompensasjonForFeriedager-beloep',
        message: 'validation:emptyField'
      }))
    }
  }

  if (utbetaling?._avkallKompensasjonBegrunnelseCheckbox && _.isEmpty(utbetaling?.avkallKompensasjonBegrunnelse)) {
    hasErrors.push(addError(v, {
      id: namespace + '-avkallKompensasjonBegrunnelse', message: 'validation:emptyField'
    }))
  }

  if (utbetaling?._andreYtelserSomMottasForTidenCheckbox && _.isEmpty(utbetaling?.andreYtelserSomMottasForTiden)) {
    hasErrors.push(addError(v, {
      id: namespace + '-andreYtelserSomMottasForTiden',
      message: 'validation:emptyField'
    }))
  }

  return hasErrors.find(value => value) !== undefined
}
