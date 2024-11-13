import { Validation } from 'declarations/types'
import {SvarAdopsjon} from "../../../declarations/sed";
import {checkIfFilledOut, checkLength} from "../../../utils/validation";

export interface ValidationAdopsjonProps {
  svarAdopsjon: SvarAdopsjon | undefined,
  label: string | undefined
}

export const validateAdopsjon = (
  v: Validation,
  namespace: string,
  {
    svarAdopsjon,
    label
  }: ValidationAdopsjonProps
): boolean => {
  const hasErrors: Array<boolean> = []


  hasErrors.push(checkIfFilledOut(v, {
    needle: svarAdopsjon,
    id: namespace + '-content',
    message: 'validation:du-maa-fylle-ut',
    extra: {
      type: label?.toLowerCase()
    }
  }))

  hasErrors.push(checkLength(v, {
    needle: svarAdopsjon?.ytterligereInformasjon,
    max: 500,
    id: namespace + '-ytterligereInfo',
    message: 'validation:textOverX'
  }))

  return hasErrors.find(value => value) !== undefined
}
