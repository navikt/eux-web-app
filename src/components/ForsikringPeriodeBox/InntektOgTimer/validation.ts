import { validatePeriode } from 'components/Forms/validation'
import { InntektOgTime } from 'declarations/sed'
import { Validation } from 'declarations/types'
import { getIdx } from 'utils/namespace'
import {checkIfNotEmpty, checkIfNotNumber} from 'utils/validation'
import _ from "lodash";

export interface ValidationInntektOgTimeProps {
  inntektOgTime: InntektOgTime | undefined
  index?: number
  personName?: string
}

export interface ValidationInntektOgTimerProps {
  inntektOgTimer: Array<InntektOgTime> | undefined
  personName?: string
}

export const validateInntektOgTime = (
  v: Validation,
  namespace: string,
  {
    inntektOgTime,
    index,
    personName
  }: ValidationInntektOgTimeProps
): boolean => {
  const hasErrors: Array<boolean> = []
  const idx = getIdx(index)

  hasErrors.push(validatePeriode(v, namespace + idx + '-inntektsperiode', {
    periode: inntektOgTime?.inntektsperiode
  }))

  hasErrors.push(checkIfNotEmpty(v, {
    needle: inntektOgTime?.bruttoinntekt,
    id: namespace + idx + '-bruttoinntekt',
    message: 'validation:noInntekt',
    personName
  }))

  hasErrors.push(checkIfNotEmpty(v, {
    needle: inntektOgTime?.valuta,
    id: namespace + idx + '-valuta',
    message: 'validation:noValuta',
    personName
  }))

  if(!_.isEmpty(inntektOgTime?.arbeidstimer)){
    hasErrors.push(checkIfNotNumber(v, {
      needle: inntektOgTime?.arbeidstimer,
      id: namespace + idx + '-arbeidstimer',
      message: 'validation:notANumber',
      personName
    }))
  }

  return hasErrors.find(value => value) !== undefined
}

export const validateInntektOgTimer = (
  validation: Validation,
  namespace: string,
  {
    inntektOgTimer,
    personName
  }: ValidationInntektOgTimerProps
): boolean => {
  const hasErrors: Array<boolean> = []
  inntektOgTimer?.forEach((inntektOgTime: InntektOgTime, index: number) => {
    hasErrors.push(validateInntektOgTime(validation, namespace, {
      inntektOgTime,
      index,
      personName
    }))
  })
  return hasErrors.find(value => value) !== undefined
}
