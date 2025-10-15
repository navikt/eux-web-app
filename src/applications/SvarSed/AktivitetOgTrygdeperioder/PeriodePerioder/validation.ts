import { validatePeriode } from 'components/Forms/validation'
import {PeriodePeriode} from 'declarations/sed'
import { Validation } from 'declarations/types'
import { getIdx } from 'utils/namespace'
import { checkIfDuplicate } from 'utils/validation'

export interface ValidationPeriodePeriodeProps {
  periodePeriode: PeriodePeriode | undefined
  perioder: Array<PeriodePeriode> | undefined
  index?: number
  personName?: string
}

export interface ValidationPeriodePerioderProps {
  perioder: Array<PeriodePeriode> | undefined
  personName?: string
}

export const validatePeriodePeriode = (
  v: Validation,
  namespace: string,
  {
    periodePeriode,
    perioder,
    index,
    personName
  }: ValidationPeriodePeriodeProps
): boolean => {
  const idx = getIdx(index)
  const hasErrors: Array<boolean> = []

  hasErrors.push(validatePeriode(v, namespace + idx, {
    periode: periodePeriode?.periode,
    personName
  }))

  hasErrors.push(checkIfDuplicate(v, {
    needle: periodePeriode,
    haystack: perioder,
    matchFn: (p: PeriodePeriode) => p.periode.startdato === periodePeriode?.periode?.startdato && p.periode.sluttdato === periodePeriode.periode?.sluttdato,
    message: 'validation:duplicateStartdato',
    id: namespace + idx + '-startdato',
    index,
    personName
  }))

  return hasErrors.find(value => value) !== undefined
}

export const validatePeriodePerioder = (
  v: Validation,
  namespace: string,
  {
    perioder,
    personName
  }: ValidationPeriodePerioderProps
): boolean => {
  const hasErrors: Array<boolean> = []
  perioder?.forEach((periodePeriode: PeriodePeriode, index: number) => {
    hasErrors.push(validatePeriodePeriode(v, namespace, { periodePeriode: periodePeriode, perioder, index, personName }))
  })

  return hasErrors.find(value => value) !== undefined
}
