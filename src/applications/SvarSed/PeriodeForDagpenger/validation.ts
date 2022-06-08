import { validatePeriode } from 'components/Forms/validation'
import { PeriodeDagpenger } from 'declarations/sed'
import { Validation } from 'declarations/types'
import _ from 'lodash'
import { getIdx } from 'utils/namespace'
import { checkIfDuplicate, checkIfNotEmpty } from 'utils/validation'

export interface ValidationPeriodeDagpengerProps {
  periodeDagpenger: PeriodeDagpenger | undefined
  perioderDagpenger: Array<PeriodeDagpenger> | undefined
  index?: number
  personName?: string
}

export interface ValidatePerioderDagpengerProps {
  perioderDagpenger: Array<PeriodeDagpenger> | undefined
  personName?: string
}

export const validatePeriodeDagpenger = (
  v: Validation,
  namespace: string,
  {
    periodeDagpenger,
    perioderDagpenger,
    index,
    personName
  }: ValidationPeriodeDagpengerProps
): boolean => {
  const hasErrors: Array<boolean> = []
  const idx = getIdx(index)

  hasErrors.push(validatePeriode(v, namespace + '-periode', {
    periode: periodeDagpenger?.periode
  }))

  if (!_.isEmpty(periodeDagpenger?.periode?.startdato)) {
    hasErrors.push(checkIfDuplicate(v, {
      needle: periodeDagpenger,
      haystack: perioderDagpenger,
      matchFn: (p: PeriodeDagpenger) => p.periode.startdato === periodeDagpenger?.periode.startdato && p.periode.sluttdato === periodeDagpenger.periode?.sluttdato,
      id: namespace + idx + '-periode-startdato',
      index,
      message: 'validation:duplicateStartdato'
    }))
  }

  hasErrors.push(checkIfNotEmpty(v, {
    needle: periodeDagpenger?.institusjon.id,
    id: namespace + idx + '-institusjon-id',
    message: 'validation:noInstitusjonsID',
    personName
  }))

  hasErrors.push(checkIfNotEmpty(v, {
    needle: periodeDagpenger?.institusjon.navn,
    id: namespace + idx + '-institusjon-navn',
    message: 'validation:noInstitusjonensNavn',
    personName
  }))

  return hasErrors.find(value => value) !== undefined
}

export const validatePerioderDagpenger = (
  validation: Validation,
  namespace: string,
  {
    perioderDagpenger,
    personName
  }: ValidatePerioderDagpengerProps
): boolean => {
  const hasErrors: Array<boolean> = []
  perioderDagpenger?.forEach((periodeDagpenger: PeriodeDagpenger, index: number) => {
    hasErrors.push(validatePeriodeDagpenger(validation, namespace, {
      periodeDagpenger,
      perioderDagpenger,
      index,
      personName
    }))
  })
  return hasErrors.find(value => value) !== undefined
}
