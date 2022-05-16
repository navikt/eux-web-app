import { PDPeriode } from 'declarations/pd'
import { Validation } from 'declarations/types'
import { getIdx } from 'utils/namespace'
import { addError, checkIfNotEmpty, checkLength } from 'utils/validation'
import i18n from 'i18n'

export interface ValidationDagpengerPeriodeProps {
  periode: PDPeriode |undefined
  index? : number
}

export interface ValidationDagpengerPerioderProps {
  dagpenger: Array<PDPeriode> | undefined
}

export const validateDagpengerPeriode = (
  v: Validation,
  namespace: string,
  {
    periode,
    index
  }: ValidationDagpengerPeriodeProps
): boolean => {
  const hasErrors: Array<boolean> = []
  const idx = getIdx(index)

  hasErrors.push(checkIfNotEmpty(v, {
    needle: periode?.startdato,
    id: namespace + idx + '-startdato',
    message: 'validation:noStartdato'
  }))

  hasErrors.push(checkIfNotEmpty(v, {
    needle: periode?.sluttdato,
    id: namespace + idx + '-sluttdato',
    message: 'validation:noSluttdato'
  }))

  hasErrors.push(checkLength(v, {
    needle: periode?.info,
    max: 500,
    id: namespace + idx + '-info',
    message: 'validation:textOverX'
  }))

  return hasErrors.find(value => value) !== undefined
}

export const validateDagpengerPerioder = (
  v: Validation,
  namespace: string,
  {
    dagpenger
  }: ValidationDagpengerPerioderProps
): boolean => {
  const hasErrors: Array<boolean> = []

  dagpenger?.forEach((periode: PDPeriode, index: number) => {
    hasErrors.push(validateDagpengerPeriode(v, namespace, {
      periode,
      index
    }))
  })

  if (dagpenger && dagpenger.length > 40) {
    addError(v, {
      id: namespace + '-generic',
      message: 'validation:tooManyPeriodsMaxIs',
      extra: {
        type: i18n.t('label:dagpenger'),
        max: '40'
      }
    })
    hasErrors.push(true)
  }

  return hasErrors.find(value => value) !== undefined
}
