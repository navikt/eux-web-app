import { validateAdresse } from 'applications/SvarSed/Adresser/validation'
import { validateIdentifikatorer } from 'applications/SvarSed/Identifikator/validation'
import { validatePeriode } from 'components/Forms/validation'
import { PeriodeMedForsikring } from 'declarations/sed'
import { Validation } from 'declarations/types'
import { getIdx } from 'utils/namespace'
import { checkIfNotEmpty } from 'utils/validation'

export interface ValidationPeriodeMedForsikringProps {
  periodeMedForsikring: PeriodeMedForsikring | undefined,
  index ?: number
  personName ?: string
}

export interface ValidatePerioderMedForsikringProps {
  perioderMedForsikring: Array<PeriodeMedForsikring> | undefined
  personName ?: string
}

export const validatePeriodeMedForsikring = (
  v: Validation,
  namespace: string,
  {
    periodeMedForsikring,
    personName,
    index
  }: ValidationPeriodeMedForsikringProps
): boolean => {
  const hasErrors: Array<boolean> = []
  const idx = getIdx(index)

  hasErrors.push(validatePeriode(v, namespace, {
    periode: periodeMedForsikring,
    index,
    personName
  }))

  hasErrors.push(checkIfNotEmpty(v, {
    needle: periodeMedForsikring?.arbeidsgiver?.navn,
    id: namespace + idx + '-arbeidsgiver-navn',
    message: 'validation:noNavn',
    personName
  }))

  hasErrors.push(checkIfNotEmpty(v, {
    needle: periodeMedForsikring?.arbeidsgiver?.identifikatorer,
    id: namespace + idx + '-arbeidsgiver-identifikatorer',
    message: 'validation:noIdentifikatorer',
    personName
  }))

  hasErrors.push(validateIdentifikatorer(v, namespace + idx + '-arbeidsgiver-identifikatorer', {
    identifikatorer: periodeMedForsikring?.arbeidsgiver.identifikatorer,
    personName
  }))

  hasErrors.push(validateAdresse(v, namespace + idx + '-arbeidsgiver-adresse', {
    adresse: periodeMedForsikring?.arbeidsgiver.adresse,
    index,
    checkAdresseType: false,
    personName
  }))

  return hasErrors.find(value => value) !== undefined
}

export const validatePerioderMedForsikring = (
  validation: Validation,
  namespace: string,
  {
    perioderMedForsikring
  }: ValidatePerioderMedForsikringProps
): boolean => {
  const hasErrors: Array<boolean> = []
  perioderMedForsikring?.forEach((periodeMedForsikring: PeriodeMedForsikring) => {
    hasErrors.push(validatePeriodeMedForsikring(validation, namespace, {
      periodeMedForsikring
    }))
  })
  return hasErrors.find(value => value) !== undefined
}
