import { Validation } from 'declarations/types'
import {checkValidDateFormat} from 'utils/validation'

export interface ValidationKravProps {
  krav: any | undefined
}

export const validateKrav = (
  v: Validation,
  namespace: string,
  {
    krav
  }: ValidationKravProps
): boolean => {
  const hasErrors: Array<boolean> = []

  if(krav?.kravMottattDato){
    hasErrors.push(checkValidDateFormat(v, {
      needle: krav?.kravMottattDato,
      id: namespace + '-kravMottattDato',
      message: 'validation:invalidDateFormat',
    }))
  }

  return hasErrors.find(value => value) !== undefined
}
