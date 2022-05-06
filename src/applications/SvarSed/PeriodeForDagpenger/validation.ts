import { validateAdresse } from 'applications/SvarSed/Adresser/validation'
import { validatePeriode } from 'components/Forms/validation'
import { PeriodeDagpenger } from 'declarations/sed'
import { Validation } from 'declarations/types'
import _ from 'lodash'
import { getIdx } from 'utils/namespace'
import { addError, checkIfDuplicate, checkIfNotEmpty } from 'utils/validation'

export interface ValidationPeriodeDagpengerProps {
  periodeDagpenger: PeriodeDagpenger,
  perioderDagpenger: Array<PeriodeDagpenger> | undefined,
  index?: number
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

  const idmangler = (
    !_.isEmpty(periodeDagpenger.institusjon.idmangler?.navn?.trim()) && periodeDagpenger.institusjon.idmangler?.navn?.trim() !== '-') ||
    !_.isEmpty(periodeDagpenger.institusjon.idmangler?.adresse?.gate?.trim()) ||
    !_.isEmpty(periodeDagpenger.institusjon.idmangler?.adresse?.postnummer?.trim()) ||
    !_.isEmpty(periodeDagpenger.institusjon.idmangler?.adresse?.bygning?.trim()) ||
    !_.isEmpty(periodeDagpenger.institusjon.idmangler?.adresse?.by?.trim()) ||
    !_.isEmpty(periodeDagpenger.institusjon.idmangler?.adresse?.region?.trim()) ||
    !_.isEmpty(periodeDagpenger.institusjon.idmangler?.adresse?.land?.trim())

  if (!idmangler) {
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
  } else {
    if (_.isEmpty(periodeDagpenger?.institusjon.idmangler?.navn?.trim()) || periodeDagpenger?.institusjon.idmangler?.navn?.trim() === '-') {
      hasErrors.push(addError(v, {
        id: namespace + idx + '-institusjon-idmangler-navn',
        message: 'validation:noName',
        personName
      }))
    }

    hasErrors.push(validateAdresse(v, namespace + idx + '-institusjon-idmangler-adresse', {
      adresse: periodeDagpenger?.institusjon.idmangler?.adresse,
      checkAdresseType: true,
      personName
    }))
  }

  return hasErrors.find(value => value) !== undefined
}

interface ValidatePerioderDagpengerProps {
  perioderDagpenger: Array<PeriodeDagpenger> | undefined
  personName?: string
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
