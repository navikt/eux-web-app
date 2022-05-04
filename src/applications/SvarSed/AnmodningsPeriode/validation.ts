import { validatePeriode } from 'components/Forms/validation'
import { Periode } from 'declarations/sed'
import { Validation } from 'declarations/types'

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
  {
    anmodningsperiode,
    namespace,
    index
  }: ValidationAnmodningsPeriodeProps
): boolean => {
  return validatePeriode(v, {
    periode: anmodningsperiode!,
    namespace: namespace + '-perioder',
    index
  })
}

export const validateAnmodningsPerioder = (
  v: Validation,
  namespace: string,
  {
    anmodningsperioder
  }: ValidationAnmodningsPerioderProps
): boolean => {
  const hasErrors: Array<boolean> = []

  anmodningsperioder?.forEach((p: Periode, i: number) => {
    hasErrors.push(validateAnmodningsPeriode(v, {
      anmodningsperiode: p,
      index: i,
      namespace
    }))
  })
  return hasErrors.find(value => value) !== undefined
}
