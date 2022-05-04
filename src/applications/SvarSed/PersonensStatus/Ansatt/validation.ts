import { validatePeriode } from 'components/Forms/validation'
import { PensjonPeriode, Periode } from 'declarations/sed'
import { Validation } from 'declarations/types'
import _ from 'lodash'
import { getIdx } from 'utils/namespace'
import { checkIfDuplicate } from 'utils/validation'

export interface ValidationArbeidsperiodeProps {
  periode: Periode,
  perioder: Array<Periode> | undefined,
  index?: number
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
  }: ValidationArbeidsperiodeProps
): boolean => {
  const idx = getIdx(index)
  const hasErrors: Array<boolean> = []

  hasErrors.push(validatePeriode(v, namespace + '-periode', {
    periode,
    index,
    personName
  }))

  if (!_.isEmpty(periode?.startdato)) {
    hasErrors.push(checkIfDuplicate(v, {
      needle: periode,
      haystack: perioder,
      matchFn: (p: Periode) => p.startdato === periode?.startdato && p.sluttdato === periode?.sluttdato,
      id: namespace + '-periode' + idx + '-startdato',
      message: 'validation:duplicateStartdato',
      personName
    }))
  }

  return hasErrors.find(value => value) !== undefined
}

interface ValidateAnsattPerioderProps {
  perioder: Array<Periode>
  personName?: string
}

export const validateAnsattPerioder = (
  v: Validation,
  namespace: string,
  {
    perioder,
    personName
  }: ValidateAnsattPerioderProps
): boolean => {
  const hasErrors: Array<boolean> = []
  perioder?.forEach((periode: Periode | PensjonPeriode, index: number) => {
    hasErrors.push(validateAnsattPeriode(v, namespace, { periode: (periode as Periode), perioder, index, personName }))
  })
  return hasErrors.find(value => value) !== undefined
}
