import { validatePeriode } from 'components/Forms/validation'
import { InntektOgTime } from 'declarations/sed'
import { Validation } from 'declarations/types'
import { getIdx } from 'utils/namespace'
import { checkIfNotEmpty } from 'utils/validation'

export interface ValidationInntektOgTimeProps {
  inntektOgTime: InntektOgTime
  index?: number
  personName?: string
}

interface ValidationInntektOgTimerProps {
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
    periode: inntektOgTime.inntektsperiode
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

  hasErrors.push(checkIfNotEmpty(v, {
    needle: inntektOgTime?.arbeidstimer,
    id: namespace + idx + '-arbeidstimer',
    message: 'validation:noArbeidstimer',
    personName
  }))

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
