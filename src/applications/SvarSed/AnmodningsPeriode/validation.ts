import { validatePeriode } from 'components/Forms/validation'
import { Periode } from 'declarations/sed'
import { Validation } from 'declarations/types'

export interface ValidationAnmodningsPerioderProps {
  anmodningsperioder: Array<Periode> | undefined
}

export interface ValidationAnmodningsPeriodeProps {
  anmodningsperiode: Periode | undefined
  index ?: number
}
export const validateAnmodningsPeriode = (
  v: Validation,
  namespace: string,
  {
    anmodningsperiode,
    index
  }: ValidationAnmodningsPeriodeProps
): boolean => {
  return validatePeriode(v, namespace + '-perioder', {
    periode: anmodningsperiode!,
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

  anmodningsperioder?.forEach((anmodningsperiode: Periode, index: number) => {
    hasErrors.push(validateAnmodningsPeriode(v, namespace, {
      anmodningsperiode,
      index
    }))
  })
  return hasErrors.find(value => value) !== undefined
}
