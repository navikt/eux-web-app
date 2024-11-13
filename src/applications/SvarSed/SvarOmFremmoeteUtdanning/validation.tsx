import { Validation } from 'declarations/types'
import {checkIfDuplicate, checkIfFilledOut} from 'utils/validation'
import {getIdx} from "../../../utils/namespace";
import {validatePeriode as validatePeriodeInput} from "../../../components/Forms/validation";
import {Periode, Utdanning as UtdanningDTO} from "../../../declarations/sed";

export interface ValidationPeriodeProps {
  periode: Periode | undefined
  perioder: Array<Periode> | undefined
  index?: number
}

export interface ValidationUtdanningProps {
  utdanning: UtdanningDTO | undefined
  label: string | undefined
}

export const validatePeriode = (
  v: Validation,
  namespace: string,
  {
    periode,
    perioder,
    index
  }: ValidationPeriodeProps
): boolean => {
  const hasErrors: Array<boolean> = []
  const idx = getIdx(index)

  hasErrors.push(validatePeriodeInput(v, namespace + idx, {
    periode
  }))

  hasErrors.push(checkIfDuplicate(v, {
    needle: periode,
    haystack: perioder,
    matchFn: (p: Periode) => p.startdato === periode?.startdato && p.sluttdato === periode?.sluttdato,
    id: namespace + idx + '-startdato',
    message: 'validation:duplicateStartdato',
    index
  }))

  return hasErrors.find(value => value) !== undefined
}

export const validateUtdanning = (
  v: Validation,
  namespace: string,
  {
    utdanning,
    label
  }: ValidationUtdanningProps
): boolean => {
  const hasErrors: Array<boolean> = []

  //NEED TO CHECK THAT BOTH UTDANNING AND DELTAKELSEPAAUTDANNING IS EMPTY
  hasErrors.push(checkIfFilledOut(v, {
    needle: utdanning,
    id: namespace + '-content',
    message: 'validation:du-maa-fylle-ut',
    extra: {
      type: label?.toLowerCase()
    }
  }))

  return hasErrors.find(value => value) !== undefined
}
