import { validatePeriode } from 'components/Forms/validation'
import { PeriodeMedForsikring } from 'declarations/sed'
import { Validation } from 'declarations/types'
import _ from 'lodash'
import { checkIfNotEmpty } from 'utils/validation'

export interface ValidationPeriodeMedForsikringProps {
  periodeMedForsikring: PeriodeMedForsikring,
  includeAddress ?: boolean
}

export const validatePeriodeMedForsikring = (
  v: Validation,
  namespace: string,
  {
    periodeMedForsikring,
    includeAddress
  }: ValidationPeriodeMedForsikringProps
): boolean => {
  const hasErrors: Array<boolean> = []

  hasErrors.push(checkIfNotEmpty(v, {
    needle: periodeMedForsikring.arbeidsgiver?.navn,
    id: namespace + '-navn',
    message: 'validation:noNavn'
  }))

  hasErrors.push(checkIfNotEmpty(v, {
    needle: periodeMedForsikring.arbeidsgiver?.identifikatorer?.[0]?.id,
    id: namespace + '-identifikatorer',
    message: 'validation:noOrgnr'
  }))

  hasErrors.push(validatePeriode(v, namespace, {
    periode: periodeMedForsikring
  }))

  // allow duplicates

  if (includeAddress && (
    !_.isEmpty(periodeMedForsikring.arbeidsgiver.adresse?.gate) ||
    !_.isEmpty(periodeMedForsikring.arbeidsgiver.adresse?.postnummer) ||
    !_.isEmpty(periodeMedForsikring.arbeidsgiver.adresse?.by) ||
    !_.isEmpty(periodeMedForsikring.arbeidsgiver.adresse?.land)
  )) {
    hasErrors.push(checkIfNotEmpty(v, {
      needle: periodeMedForsikring.arbeidsgiver.adresse?.gate,
      id: namespace + '-adresse-gate',
      message: 'validation:noAddressStreet'
    }))

    hasErrors.push(checkIfNotEmpty(v, {
      needle: periodeMedForsikring.arbeidsgiver.adresse?.postnummer,
      id: namespace + '-adresse-postnummer',
      message: 'validation:noAddressPostnummer'
    }))

    hasErrors.push(checkIfNotEmpty(v, {
      needle: periodeMedForsikring.arbeidsgiver.adresse?.by,
      id: namespace + '-adresse-by',
      message: 'validation:noAddressCity'
    }))

    hasErrors.push(checkIfNotEmpty(v, {
      needle: periodeMedForsikring.arbeidsgiver.adresse?.land,
      id: namespace + '-adresse-land',
      message: 'validation:noAddressCountry'
    }))
  }

  return hasErrors.find(value => value) !== undefined
}

interface ValidatePerioderMedForsikringProps {
  perioderMedForsikring: Array<PeriodeMedForsikring> | undefined
  includeAddress: boolean
}

export const validatePerioderMedForsikring = (
  validation: Validation,
  namespace: string,
  {
    perioderMedForsikring,
    includeAddress
  }: ValidatePerioderMedForsikringProps
): boolean => {
  const hasErrors: Array<boolean> = []
  perioderMedForsikring?.forEach((periodeMedForsikring: PeriodeMedForsikring) => {
    hasErrors.push(validatePeriodeMedForsikring(validation, namespace, {
      periodeMedForsikring,
      includeAddress
    }))
  })
  return hasErrors.find(value => value) !== undefined
}
