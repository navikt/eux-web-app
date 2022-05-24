import { Inntekt } from 'declarations/sed'
import { Validation } from 'declarations/types'
import { getIdx } from 'utils/namespace'
import { checkIfNotEmpty, checkIfNotNumber } from 'utils/validation'

export interface ValidationInntekterProps {
  inntekter: Array<Inntekt> | undefined
  personName ?: string
}

export interface ValidationInntektProps {
  inntekt: Inntekt | undefined,
  index?: number,
  personName ?: string
}

export const validateInntekt = (
  v: Validation,
  namespace: string,
  {
    inntekt,
    index,
    personName
  }: ValidationInntektProps
): boolean => {
  const hasErrors: Array<boolean> = []
  const idx = getIdx(index)

  hasErrors.push(checkIfNotEmpty(v, {
    needle: inntekt?.type,
    id: namespace + idx + '-type',
    message: 'validation:noType',
    personName
  }))

  hasErrors.push(checkIfNotEmpty(v, {
    needle: inntekt?.beloep,
    id: namespace + idx + '-beloep',
    message: 'validation:noBeløp',
    personName
  }))

  hasErrors.push(checkIfNotNumber(v, {
    needle: inntekt?.beloep,
    id: namespace + idx + '-beloep',
    message: 'validation:invalidBeløp',
    personName
  }))

  hasErrors.push(checkIfNotEmpty(v, {
    needle: inntekt?.valuta,
    id: namespace + idx + '-valuta',
    message: 'validation:noValuta',
    personName
  }))

  return hasErrors.find(value => value) !== undefined
}

export const validateInntekter = (
  validation: Validation,
  namespace: string,
  {
    inntekter,
    personName
  }: ValidationInntekterProps
): boolean => {
  const hasErrors: Array<boolean> = []
  inntekter?.forEach((inntekt: Inntekt, index: number) => {
    hasErrors.push(validateInntekt(validation, namespace, {
      inntekt,
      index,
      personName
    }))
  })
  return hasErrors.find(value => value) !== undefined
}
