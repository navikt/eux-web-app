import { validatePeriode } from 'components/Forms/validation'
import { PensjonPeriode } from 'declarations/sed'
import { Validation } from 'declarations/types'
import { getIdx } from 'utils/namespace'
import { checkIfDuplicate, checkIfNotEmpty } from 'utils/validation'

export interface ValidationPerioderMedPensjonProps {
  pensjonPeriode: PensjonPeriode | undefined
  perioder: Array<PensjonPeriode> | undefined
  index?: number
  personName?: string
}

export interface ValidateWithSubsidiesPerioderProps {
  perioder: Array<PensjonPeriode> | undefined
  personName?: string
}

export const validatePerioderMedPensjonPeriode = (
  v: Validation,
  namespace: string,
  {
    pensjonPeriode,
    perioder,
    index,
    personName
  }: ValidationPerioderMedPensjonProps
): boolean => {
  const idx = getIdx(index)
  const hasErrors: Array<boolean> = []

  hasErrors.push(validatePeriode(v, namespace + idx, {
    periode: pensjonPeriode?.periode,
    personName
  }))

  hasErrors.push(checkIfDuplicate(v, {
    needle: pensjonPeriode,
    haystack: perioder,
    matchFn: (p: PensjonPeriode) => p.periode.startdato === pensjonPeriode?.periode?.startdato && p.periode.sluttdato === pensjonPeriode.periode?.sluttdato,
    message: 'validation:duplicateStartdato',
    id: namespace + idx + '-startdato',
    index,
    personName
  }))

  hasErrors.push(checkIfNotEmpty(v, {
    needle: pensjonPeriode?.pensjonstype,
    id: namespace + idx + '-pensjontype',
    message: 'validation:noPensjonType',
    personName
  }))

  return hasErrors.find(value => value) !== undefined
}

export const validatePerioderMedPensjonPerioder = (
  v: Validation,
  namespace: string,
  {
    perioder,
    personName
  }: ValidateWithSubsidiesPerioderProps
): boolean => {
  const hasErrors: Array<boolean> = []
  perioder?.forEach((pensjonPeriode: PensjonPeriode, index: number) => {
    hasErrors.push(validatePerioderMedPensjonPeriode(v, namespace, { pensjonPeriode, perioder, index, personName }))
  })

  return hasErrors.find(value => value) !== undefined
}
