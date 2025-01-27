import { Etterbetalinger } from 'declarations/pd'
import { Validation } from 'declarations/types'
import _ from 'lodash'
import { addError } from 'utils/validation'

export interface ValidationUtbetalingProps {
  etterbetalinger: Etterbetalinger | undefined
}

export const validateEtterbetalinger = (
  v: Validation,
  namespace: string,
  {
    etterbetalinger
  }: ValidationUtbetalingProps
): boolean => {
  const hasErrors: Array<boolean> = []

  if (etterbetalinger?._utbetalingEtterEndtArbeidsforholdCheckbox && _.isEmpty(etterbetalinger?.utbetalingEtterEndtArbeidsforhold)) {
    hasErrors.push(addError(v, {
      id: namespace + '-utbetalingEtterEndtArbeidsforhold',
      message: 'validation:emptyField'
    }))
  }

  if (etterbetalinger?._kompensasjonForEndtArbeidsforholdCheckbox && _.isEmpty(etterbetalinger?.kompensasjonForEndtArbeidsforhold)) {
    hasErrors.push(addError(v, {
      id: namespace + '-kompensasjonForEndtArbeidsforhold',
      message: 'validation:emptyField'
    }))
  }

  if (etterbetalinger?._kompensasjonForFeriedagerCheckbox) {
    if (_.isEmpty(etterbetalinger?.kompensasjonForFeriedager?.antallDager)) {
      hasErrors.push(addError(v, {
        id: namespace + '-kompensasjonForFeriedager-antallDager',
        message: 'validation:emptyField'
      }))
    }

    if (_.isEmpty(etterbetalinger?.kompensasjonForFeriedager?.beloep)) {
      hasErrors.push(addError(v, {
        id: namespace + '-kompensasjonForFeriedager-beloep',
        message: 'validation:emptyField'
      }))
    }
  }

  if (etterbetalinger?._avkallKompensasjonBegrunnelseCheckbox && _.isEmpty(etterbetalinger?.avkallKompensasjonBegrunnelse)) {
    hasErrors.push(addError(v, {
      id: namespace + '-avkallKompensasjonBegrunnelse', message: 'validation:emptyField'
    }))
  }

  if (etterbetalinger?._andreYtelserSomMottasForTidenCheckbox && _.isEmpty(etterbetalinger?.andreYtelserSomMottasForTiden)) {
    hasErrors.push(addError(v, {
      id: namespace + '-andreYtelserSomMottasForTiden',
      message: 'validation:emptyField'
    }))
  }

  return hasErrors.find(value => value) !== undefined
}
