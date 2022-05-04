import { Inntekt } from 'declarations/sed'
import { Validation } from 'declarations/types'
import _ from 'lodash'
import { getIdx } from 'utils/namespace'
import { checkIfNotEmpty, checkIfNotNumber } from 'utils/validation'

export interface ValidationInntekterProps {
  inntekter: Array<Inntekt>
}

export interface ValidationInntektProps {
  inntekt: Inntekt,
  index?: number
}

export const validateInntekt = (
  v: Validation,
  namespace: string,
  {
    inntekt,
    index
  }: ValidationInntektProps
): boolean => {
  const hasErrors: Array<boolean> = []
  const idx = getIdx(index)

  hasErrors.push(checkIfNotEmpty(v, {
    needle: inntekt?.type,
    id: namespace + idx + '-type',
    message: 'validation:noType'
  }))

  hasErrors.push(checkIfNotEmpty(v, {
    needle: inntekt?.beloep,
    id: namespace + idx + '-beloep',
    message: 'validation:noBeløp'
  }))

  hasErrors.push(checkIfNotEmpty(v, {
    needle: inntekt?.beloep,
    id: namespace + idx + '-beloep',
    message: 'validation:noBeløp'
  }))

  if (!_.isEmpty(inntekt?.beloep?.trim())) {
    hasErrors.push(checkIfNotNumber(v, {
      needle: inntekt?.beloep,
      id: namespace + idx + '-beloep',
      message: 'validation:invalidBeløp'
    }))
  }

  hasErrors.push(checkIfNotEmpty(v, {
    needle: inntekt?.valuta,
    id: namespace + idx + '-valuta',
    message: 'validation:noValuta'
  }))

  return hasErrors.find(value => value) !== undefined
}

export const validateInntekter = (
  validation: Validation,
  namespace: string,
  {
    inntekter
  }: ValidationInntekterProps
): boolean => {
  const hasErrors: Array<boolean> = []
  inntekter?.forEach((inntekt: Inntekt, index: number) => {
    hasErrors.push(validateInntekt(validation, namespace, {
      inntekt,
      index
    }))
  })
  return hasErrors.find(value => value) !== undefined
}
