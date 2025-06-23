import { validatePeriode } from 'components/Forms/validation'
import { PensjonPeriode, Periode } from 'declarations/sed'
import { Validation } from 'declarations/types'
import _ from 'lodash'
import { getIdx } from 'utils/namespace'
import { checkIfDuplicate } from 'utils/validation'

export interface ValidationAnsattPeriodeProps {
  periode: Periode | undefined,
  perioder: Array<Periode> | undefined,
  index?: number
  personName?: string
}

export interface ValidationAnsattPerioderProps {
  perioder: Array<Periode> | undefined
  personName?: string
}

export const validateAnsattPeriode = (
  v: Validation,
  namespace: string,
  {
    periode,
    perioder,
    index,
    personName
  }: ValidationAnsattPeriodeProps
): boolean => {
  const idx = getIdx(index)
  const hasErrors: Array<boolean> = []

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
      id: namespace + idx + '-startdato',
      index,
      message: 'validation:duplicateStartdato',
      personName
    }))
  }

  return hasErrors.find(value => value) !== undefined
}
