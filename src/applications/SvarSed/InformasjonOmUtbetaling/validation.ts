import { Validation } from 'declarations/types'
import {checkIfNotEmpty} from "../../../utils/validation";

export interface ValidationInformasjonOmUtbetalingProps {
  informasjonOmUtbetaling: any | undefined
}

export const validateInformasjonOmUtbetaling = (
  v: Validation,
  namespace: string,
  {
    informasjonOmUtbetaling
  }: ValidationInformasjonOmUtbetalingProps
): boolean => {
  const hasErrors: Array<boolean> = []

  console.log(v, namespace, informasjonOmUtbetaling)

  hasErrors.push(checkIfNotEmpty(v, {
    needle: informasjonOmUtbetaling?.ytelse?.type,
    id: namespace + '-ytelse-type',
    message: 'validation:noType'
  }))

  hasErrors.push(checkIfNotEmpty(v, {
    needle: informasjonOmUtbetaling?.vedtak?.type,
    id: namespace + '-vedtak-type',
    message: 'validation:noType'
  }))

  hasErrors.push(checkIfNotEmpty(v, {
    needle: informasjonOmUtbetaling?.forespoerselomperiode?.startdato,
    id: namespace + '-forespoerselomperiode-startdato',
    message: 'validation:noStartdato'
  }))

  return hasErrors.find(value => value) !== undefined
}
