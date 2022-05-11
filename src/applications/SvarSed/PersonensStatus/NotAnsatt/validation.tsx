import { validatePeriode } from 'components/Forms/validation'
import { Periode } from 'declarations/sed'
import { Validation } from 'declarations/types'
import _ from 'lodash'
import { getIdx } from 'utils/namespace'
import { checkIfDuplicate } from 'utils/validation'

export interface ValidationNotAnsattPeriodeProps {
  periode: Periode | undefined
  perioder: Array<Periode> | undefined,
  index?: number
  personName?: string
}

export interface ValidationNotAnsattPerioderProps {
  perioder: Array<Periode> | undefined
  personName?: string
}

export const validateNotAnsattPeriode = (
  v: Validation,
  namespace: string,
  {
    periode,
    perioder,
    index,
    personName
  }: ValidationNotAnsattPeriodeProps
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

export const validateNotAnsattPerioder = (
  v: Validation,
  namespace: string,
  {
    perioder,
    personName
  }: ValidationNotAnsattPerioderProps
): boolean => {
  const hasErrors: Array<boolean> = []
  perioder?.forEach((periode: Periode, index: number) => {
    hasErrors.push(validateNotAnsattPeriode(v, namespace, { periode, perioder, index, personName }))
  })
  return hasErrors.find(value => value) !== undefined
}
