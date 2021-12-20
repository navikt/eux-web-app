import { AndreMottatteUtbetalinger } from 'declarations/pd'
import { Validation } from 'declarations/types'
import { TFunction } from 'react-i18next'
import { propagateError } from 'utils/validation'

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
   console.log(utbetaling)

  const hasError: boolean = hasErrors.find(value => value) !== undefined
  if (hasError) propagateError(v, namespace)
  return hasError
}
