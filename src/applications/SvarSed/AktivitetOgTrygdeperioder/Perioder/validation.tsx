import { validatePeriode } from 'components/Forms/validation'
import { Periode } from 'declarations/sed'
import { Validation } from 'declarations/types'
import _ from 'lodash'
import { getIdx } from 'utils/namespace'
import { checkIfDuplicate } from 'utils/validation'

export interface ValidationAktivitetPeriodeProps {
  periode: Periode | undefined
  perioder: Array<Periode> | undefined,
  index?: number
  personName?: string
}

export interface ValidationAktivitetPerioderProps {
  perioder: Array<Periode> | undefined
  personName?: string
}

export const validateThePeriode = (
  v: Validation,
  namespace: string,
  {
    periode,
    perioder,
    index,
    personName
  }: ValidationAktivitetPeriodeProps
): boolean => {
  const hasErrors: Array<boolean> = []
  const idx = getIdx(index)

  hasErrors.push(validatePeriode(v, namespace, {
    periode,
    index,
    personName
  }))

  if (!_.isEmpty(periode?.startdato)) {
    hasErrors.push(checkIfDuplicate(v, {
      needle: periode,
      haystack: perioder,
      matchFn: (p: Periode) => p.startdato === periode?.startdato && p.sluttdato === periode?.sluttdato,
      message: 'validation:duplicateStartdato',
      id: namespace + idx + '-startdato',
      index,
      personName
    }))
  }

  return hasErrors.find(value => value) !== undefined
}

export const validatePerioder = (
  v: Validation,
  namespace: string,
  {
    perioder,
    personName
  }: ValidationAktivitetPerioderProps
): boolean => {
  const hasErrors: Array<boolean> = []
  perioder?.forEach((periode: Periode, index: number) => {
    hasErrors.push(validateThePeriode(v, namespace, { periode, perioder, index, personName }))
  })
  return hasErrors.find(value => value) !== undefined
}
