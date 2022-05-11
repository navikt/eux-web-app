import { validatePeriode } from 'components/Forms/validation'
import { PensjonPeriode, Periode } from 'declarations/sed'
import { Validation } from 'declarations/types'
import _ from 'lodash'
import { getIdx } from 'utils/namespace'
import { checkIfDuplicate } from 'utils/validation'

export interface ValidationAvsenderlandetProps {
  periode: Periode | undefined
  perioder: Array<Periode> | undefined
  index?: number
  personName?: string
}

export interface ValidateAvsenderlandetPerioderProps {
  perioder: Array<Periode> | undefined
  personName?: string
}

export const validateAvsenderlandetPeriode = (
  v: Validation,
  namespace: string,
  {
    periode,
    perioder,
    index,
    personName
  }: ValidationAvsenderlandetProps
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

export const validateAvsenderlandetPerioder = (
  v: Validation,
  namespace: string,
  {
    perioder,
    personName
  }: ValidateAvsenderlandetPerioderProps
): boolean => {
  const hasErrors: Array<boolean> = []
  perioder?.forEach((periode: Periode | PensjonPeriode, index: number) => {
    hasErrors.push(validateAvsenderlandetPeriode(v, namespace, { periode: (periode as Periode), perioder, index, personName }))
  })
  return hasErrors.find(value => value) !== undefined
}
