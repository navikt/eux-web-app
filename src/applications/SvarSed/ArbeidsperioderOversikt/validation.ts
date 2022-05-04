import { validatePeriode } from 'components/Forms/validation'
import { ErrorElement } from 'declarations/app'
import { PeriodeMedForsikring } from 'declarations/sed'
import { Validation } from 'declarations/types'
import _ from 'lodash'

export interface ValidationPeriodeMedForsikringProps {
  periodeMedForsikring: PeriodeMedForsikring,
  namespace: string
  includeAddress ?: boolean
}

export const validatePeriodeMedForsikring = (
  v: Validation,
  {
    periodeMedForsikring,
    namespace,
    includeAddress
  }: ValidationPeriodeMedForsikringProps
): boolean => {
  let hasErrors: boolean = false

  if (_.isEmpty(periodeMedForsikring.arbeidsgiver?.navn?.trim())) {
    v[namespace + '-navn'] = {
      skjemaelementId: namespace + '-navn',
      feilmelding: t('validation:noNavn')
    } as ErrorElement
    hasErrors = true
  }
  if (_.isEmpty(periodeMedForsikring.arbeidsgiver?.identifikatorer?.[0]?.id)) {
    v[namespace + '-identifikatorer'] = {
      skjemaelementId: namespace + '-identifikatorer',
      feilmelding: t('validation:noOrgnr')
    } as ErrorElement
    hasErrors = true
  }

  const periodeError: boolean = validatePeriode(v, {
    periode: periodeMedForsikring,
    namespace
  })
  hasErrors = hasErrors || periodeError

  // allow duplicates

  if (includeAddress && (
    !_.isEmpty(periodeMedForsikring.arbeidsgiver.adresse?.gate) ||
    !_.isEmpty(periodeMedForsikring.arbeidsgiver.adresse?.postnummer) ||
    !_.isEmpty(periodeMedForsikring.arbeidsgiver.adresse?.by) ||
    !_.isEmpty(periodeMedForsikring.arbeidsgiver.adresse?.land)
  )) {
    if (_.isEmpty(periodeMedForsikring.arbeidsgiver.adresse?.gate)) {
      v[namespace + '-adresse-gate'] = {
        skjemaelementId: namespace + '-adresse-gate',
        feilmelding: t('validation:noAddressStreet')
      } as ErrorElement
      hasErrors = true
    }
    if (_.isEmpty(periodeMedForsikring.arbeidsgiver.adresse?.postnummer)) {
      v[namespace + '-adresse-postnummer'] = {
        skjemaelementId: namespace + '-adresse-postnummer',
        feilmelding: t('validation:noAddressPostnummer')
      } as ErrorElement
      hasErrors = true
    }
    if (_.isEmpty(periodeMedForsikring.arbeidsgiver.adresse?.by)) {
      v[namespace + '-adresse-by'] = {
        skjemaelementId: namespace + '-adresse-by',
        feilmelding: t('validation:noAddressCity')
      } as ErrorElement
      hasErrors = true
    }
    if (_.isEmpty(periodeMedForsikring.arbeidsgiver.adresse?.land)) {
      v[namespace + '-adresse-land'] = {
        skjemaelementId: namespace + '-adresse-land',
        feilmelding: t('validation:noAddressCountry')
      } as ErrorElement
      hasErrors = true
    }
  }

  if (hasErrors) {
    const namespaceBits = namespace.split('-')
    const mainNamespace = namespaceBits[0]
    const personNamespace = mainNamespace + '-' + namespaceBits[1]
    const categoryNamespace = personNamespace + '-' + namespaceBits[2]
    v[mainNamespace] = { feilmelding: 'error', skjemaelementId: '' } as ErrorElement
    v[personNamespace] = { feilmelding: 'error', skjemaelementId: '' } as ErrorElement
    v[categoryNamespace] = { feilmelding: 'error', skjemaelementId: '' } as ErrorElement
  }
  return hasErrors
}

interface ValidatePerioderMedForsikringProps {
  perioderMedForsikring: Array<PeriodeMedForsikring> | undefined
  namespace: string
  includeAddress: boolean
}

export const validatePerioderMedForsikring = (
  validation: Validation,
  {
    perioderMedForsikring,
    namespace,
    includeAddress
  }: ValidatePerioderMedForsikringProps
): boolean => {
  let hasErrors: boolean = false
  perioderMedForsikring?.forEach((periodeMedForsikring: PeriodeMedForsikring) => {
    const _errors: boolean = validatePeriodeMedForsikring(validation, {
      periodeMedForsikring,
      namespace,
      includeAddress
    })
    hasErrors = hasErrors || _errors
  })
  return hasErrors
}
