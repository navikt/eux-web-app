import { Validation } from 'declarations/types'
import {SvarYtelseTilForeldreloese_V42, SvarYtelseTilForeldreloese_V43} from "../../../declarations/sed";
import {checkIfFilledOut} from "../../../utils/validation";

export interface ValidationYtelseTilForeldreloeseProps {
  svarYtelseTilForeldreloese: SvarYtelseTilForeldreloese_V42 | SvarYtelseTilForeldreloese_V43 | undefined,
  label: string | undefined
}

export const validateYtelseTilForeldreloese = (
  v: Validation,
  namespace: string,
  {
    svarYtelseTilForeldreloese,
    label
  }: ValidationYtelseTilForeldreloeseProps
): boolean => {
  const hasErrors: Array<boolean> = []


  hasErrors.push(checkIfFilledOut(v, {
    needle: svarYtelseTilForeldreloese,
    id: namespace + '-content',
    message: 'validation:du-maa-fylle-ut',
    extra: {
      type: label?.toLowerCase()
    }
  }))

  return hasErrors.find(value => value) !== undefined
}
