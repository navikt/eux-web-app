import { validatePeriode } from 'components/Forms/validation'
import { Periode } from 'declarations/sed'
import { Validation } from 'declarations/types'
import _ from 'lodash'
import { getIdx } from 'utils/namespace'
import { checkIfDuplicate } from 'utils/validation'

export interface ValidationNotAnsattProps {
  periode: Periode
  perioder: Array<Periode> | undefined,
  index?: number
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
  }: ValidationNotAnsattProps
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

interface ValidateNotAnsattPerioderProps {
  perioder: Array<Periode>
  personName?: string
}

export const validateNotAnsattPerioder = (
  v: Validation,
  namespace: string,
  {
    perioder,
    personName
  }: ValidateNotAnsattPerioderProps
): boolean => {
  const hasErrors: Array<boolean> = []
  perioder?.forEach((periode: Periode, index: number) => {
    hasErrors.push(validateNotAnsattPeriode(v, namespace, { periode, perioder, index, personName }))
  })
  return hasErrors.find(value => value) !== undefined
}
