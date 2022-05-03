import { validatePeriode } from 'components/Forms/validation'
import { Periode } from 'declarations/sed'
import { Validation } from 'declarations/types'
import { TFunction } from 'react-i18next'

export interface ValidationAnmodningsPerioderProps {
  anmodningsperioder: Array<Periode> | undefined
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
    namespace: namespace + '-perioder',
    index
  })
}

export const validateAnmodningsPerioder = (
  v: Validation,
  t: TFunction,
  namespace: string,
  {
    anmodningsperioder
  }: ValidationAnmodningsPerioderProps
): boolean => {
  const hasErrors: Array<boolean> = []

  anmodningsperioder?.forEach((p: Periode, i: number) => {
    hasErrors.push(validateAnmodningsPeriode(v, t, {
      anmodningsperiode: p,
      index: i,
      namespace
    }))
  })
  return hasErrors.find(value => value) !== undefined
}
