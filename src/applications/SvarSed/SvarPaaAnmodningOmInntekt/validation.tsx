import { Validation } from 'declarations/types'
import {SvarInntekt} from "../../../declarations/sed";
import {checkIfFilledOut, checkLength} from "../../../utils/validation";

export interface ValidationInntektProps {
  svarInntekt: SvarInntekt | undefined,
  label: string | undefined
}

export const validateInntekt = (
  v: Validation,
  namespace: string,
  {
    svarInntekt,
    label
  }: ValidationInntektProps
): boolean => {
  const hasErrors: Array<boolean> = []


  hasErrors.push(checkIfFilledOut(v, {
    needle: svarInntekt,
    id: namespace + '-content',
    message: 'validation:du-maa-fylle-ut',
    extra: {
      type: label?.toLowerCase()
    }
  }))

  hasErrors.push(checkLength(v, {
    needle: svarInntekt?.ytterligereInformasjon,
    max: 500,
    id: namespace + '-ytterligereInfo',
    message: 'validation:textOverX'
  }))

  return hasErrors.find(value => value) !== undefined
}
