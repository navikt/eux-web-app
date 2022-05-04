import { validatePeriode } from 'components/Forms/validation'
import { PensjonPeriode } from 'declarations/sed'
import { Validation } from 'declarations/types'
import { getIdx } from 'utils/namespace'
import { checkIfDuplicate, checkIfNotEmpty } from 'utils/validation'

export interface ValidationWithSubsidiesProps {
  pensjonPeriode: PensjonPeriode
  perioder: Array<PensjonPeriode>
  index?: number
  personName?: string
}

export const validateWithSubsidiesPeriode = (
  v: Validation,
  namespace: string,
  {
    pensjonPeriode,
    perioder,
    index,
    personName
  }: ValidationWithSubsidiesProps
): boolean => {
  const idx = getIdx(index)
  const hasErrors: Array<boolean> = []

  hasErrors.push(validatePeriode(v, namespace + '-periode' + idx, {
    periode: pensjonPeriode.periode,
    personName
  }))

  hasErrors.push(checkIfDuplicate(v, {
    needle: pensjonPeriode,
    haystack: perioder,
    matchFn: (p: PensjonPeriode) => p.periode.startdato === pensjonPeriode.periode?.startdato && p.periode.sluttdato === pensjonPeriode.periode?.sluttdato,
    message: 'validation:duplicateStartdato',
    id: namespace + idx + '-periode-startdato',
    index,
    personName
  }))

  hasErrors.push(checkIfNotEmpty(v, {
    needle: pensjonPeriode.pensjonstype,
    id: namespace + idx + '-pensjontype',
    message: 'validation:noPensjonType',
    personName
  }))

  return hasErrors.find(value => value) !== undefined
}

interface ValidateWithSubsidiesPerioderProps {
  perioder: Array<PensjonPeriode>
  personName?: string
}

export const validateWithSubsidiesPerioder = (
  v: Validation,
  namespace: string,
  {
    perioder,
    personName
  }: ValidateWithSubsidiesPerioderProps
): boolean => {
  const hasErrors: Array<boolean> = []
  perioder?.forEach((pensjonPeriode: PensjonPeriode, index: number) => {
    hasErrors.push(validateWithSubsidiesPeriode(v, namespace, { pensjonPeriode, perioder, index, personName }))
  })

  return hasErrors.find(value => value) !== undefined
}
