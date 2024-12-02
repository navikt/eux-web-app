import { Validation } from 'declarations/types'
import {addError, checkIfDuplicate, checkIfNotEmpty, checkLength} from 'utils/validation'
import {getIdx} from "../../../utils/namespace";
import {validatePeriode as validatePeriodeInput} from "../../../components/Forms/validation";
import {Periode, Utdanning as UtdanningDTO} from "../../../declarations/sed";

export interface ValidationPeriodeProps {
  periode: Periode | undefined
  perioder: Array<Periode> | undefined
  index?: number
}

export interface ValidationUtdanningProps {
  utdanning?: UtdanningDTO | undefined
  deltakelsePaaUtdanning?: Array<Periode> | undefined
  label?: string | undefined
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
    deltakelsePaaUtdanning,
    label
  }: ValidationUtdanningProps
): boolean => {
  const hasErrors: Array<boolean> = []

  if(utdanning && deltakelsePaaUtdanning && Object.keys(utdanning).length < 1 && deltakelsePaaUtdanning.length < 1){
    hasErrors.push(true)
    addError(v, {
      id: namespace + '-content',
      message: 'validation:du-maa-fylle-ut',
      extra: {
        type: label?.toLowerCase()
      }
    })
  }

  if(utdanning?.timerPr){
    hasErrors.push(checkIfNotEmpty(v, {
      needle: utdanning?.timer,
      id: namespace + '-timer',
      message: 'validation:noTimer'
    }))
  }

  if(utdanning?.timer){
    hasErrors.push(checkIfNotEmpty(v, {
      needle: utdanning?.timerPr,
      id: namespace + '-timer-pr',
      message: 'validation:noTimerPr'
    }))
  }

  hasErrors.push(checkLength(v, {
    needle: utdanning?.ytterligereInformasjon,
    max: 500,
    id: namespace + '-ytterligereinformasjon',
    message: 'validation:textOverX'
  }))



  return hasErrors.find(value => value) !== undefined
}
