import { Validation } from 'declarations/types'
import {checkIfNotEmpty} from "../../../utils/validation";

export interface ValidationForespoerselProps {
  sykdom: any | undefined
}

export const validateForespoersel = (
  v: Validation,
  namespace: string,
  {
    sykdom
  }: ValidationForespoerselProps
): boolean => {
  const hasErrors: Array<boolean> = []

  console.log(v, namespace, sykdom)

  hasErrors.push(checkIfNotEmpty(v, {
    needle: sykdom?.ytelse?.type,
    id: namespace + '-ytelse-type',
    message: 'validation:noType'
  }))

  hasErrors.push(checkIfNotEmpty(v, {
    needle: sykdom?.ytelse?.kontantellernatural,
    id: namespace + '-ytelse-kontantellernatural',
    message: 'validation:noType'
  }))

  return hasErrors.find(value => value) !== undefined
}
