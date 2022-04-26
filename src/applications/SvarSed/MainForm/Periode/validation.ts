import { validatePeriode } from 'components/Forms/validation'
import { Periode } from 'declarations/sed'
import { Validation } from 'declarations/types'
import { TFunction } from 'react-i18next'
import { propagateError } from 'utils/validation'

export interface ValidationAnmodningsPerioderProps {
  anmodningsperioder: Array<Periode> | undefined
  namespace: string
}

export interface ValidationAnmodningsPeriodeProps {
  anmodningsperiode: Periode | undefined
  namespace: string
  index ?: number
}
export const validateAnmodningsPeriode = (
  v: Validation,
  t: TFunction,
  {
    anmodningsperiode,
    namespace,
    index
  }: ValidationAnmodningsPeriodeProps
): boolean => {
  return validatePeriode(v, t, {
    periode: anmodningsperiode!,
    namespace: namespace + '-periode',
    index
  })
}

export const validateAnmodningsPerioder = (
  v: Validation,
  t: TFunction,
  {
    anmodningsperioder,
    namespace
  }: ValidationAnmodningsPerioderProps
): boolean => {
  let hasErrors: Array<boolean> = []


  anmodningsperioder?.forEach((p: Periode, i: number) => {
    hasErrors.push(validateAnmodningsPeriode(v, t, {
      anmodningsperiode: p,
      index: i,
      namespace
    }))
  })

  const hasError: boolean = hasErrors.find(value => value) !== undefined
  if (hasError) propagateError(v, namespace)
  return hasError
}
