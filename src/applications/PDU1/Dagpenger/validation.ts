import { PDPeriode } from 'declarations/pd'
import { Validation } from 'declarations/types'
import { TFunction } from 'react-i18next'
import { getIdx } from 'utils/namespace'
import { addError, checkIfNotEmpty, checkLength, propagateError } from 'utils/validation'

export interface ValidationDagpengerPeriodeProps {
  startdato: string | undefined
  sluttdato: string |undefined
  info: string |undefined
  index ? : number
  namespace: string
}

export interface ValidationDagpengerProps {
  dagpenger: Array<PDPeriode> | undefined
  namespace: string
}

export const validateDagpengerPeriode = (
  v: Validation,
  t: TFunction,
  {
    startdato,
    sluttdato,
    info,
    index,
    namespace
  }: ValidationDagpengerPeriodeProps
): boolean => {
  const hasErrors: Array<boolean> = []
  const idx = getIdx(index)

  hasErrors.push(checkIfNotEmpty(v, {
    needle: startdato,
    id: namespace + idx + '-startdato',
    message: 'validation:noStartdato'
  }))

  hasErrors.push(checkIfNotEmpty(v, {
    needle: sluttdato,
    id: namespace + idx + '-sluttdato',
    message: 'validation:noSluttdato'
  }))

  hasErrors.push(checkLength(v, {
    needle: info,
    max: 500,
    id: namespace + idx + '-info',
    message: 'validation:textOverX'
  }))

  return hasErrors.find(value => value) !== undefined
}

export const validateDagpenger = (
  v: Validation,
  t: TFunction,
  {
    dagpenger,
    namespace
  }: ValidationDagpengerProps
): boolean => {
  const hasErrors: Array<boolean> = []

  dagpenger?.forEach((periode: PDPeriode, index: number) => {
    hasErrors.push(validateDagpengerPeriode(v, t, {
      startdato: periode.startdato,
      sluttdato: periode.sluttdato,
      info: periode.info,
      index,
      namespace: namespace + '-perioder'
    }))
  })

  if (dagpenger && dagpenger.length > 3) {
    addError(v, {
      id: namespace + '-generic',
      message: 'validation:tooManyPeriodsMaxIs',
      extra: {
        type: t('label:dagpenger'),
        max: '3'
      }
    })
    hasErrors.push(true)
  }

  const hasError: boolean = hasErrors.find(value => value) !== undefined
  if (hasError) propagateError(v, namespace)
  return hasError
}
