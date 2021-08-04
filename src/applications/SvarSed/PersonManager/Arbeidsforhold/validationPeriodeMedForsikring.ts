import { validatePeriod } from 'components/Period/validation'
import { PeriodeMedForsikring } from 'declarations/sed'
import { Validation } from 'declarations/types'
import _ from 'lodash'
import { FeiloppsummeringFeil } from 'nav-frontend-skjema'
import { TFunction } from 'react-i18next'
import { getIdx } from 'utils/namespace'

export interface ValidationPeriodeMedForsikringProps {
  periodeMedForsikring: PeriodeMedForsikring,
  perioderMedForsikring: Array<PeriodeMedForsikring>,
  index?: number
  namespace: string
  includeAddress ?: boolean
}

export const validatePeriodeMedForsikring = (
  v: Validation,
  t: TFunction,
  {
    periodeMedForsikring,
    perioderMedForsikring,
    index,
    namespace,
    includeAddress
  }: ValidationPeriodeMedForsikringProps
): boolean => {
  let hasErrors: boolean = false
  const idx = getIdx(index)

  if (_.isEmpty(periodeMedForsikring.arbeidsgiver?.navn?.trim())) {
    v[namespace + '-navn'] = {
      skjemaelementId: namespace + '-navn',
      feilmelding: t('message:validation-noNavn')
    } as FeiloppsummeringFeil
    hasErrors = true
  }
  if (_.isEmpty(periodeMedForsikring.arbeidsgiver.identifikator)) {
    v[namespace + '-orgnr'] = {
      skjemaelementId: namespace + '-orgnr',
      feilmelding: t('message:validation-noOrgnr')
    } as FeiloppsummeringFeil
    hasErrors = true
  }

  const periodeError: boolean = validatePeriod(v, t, {
    period: periodeMedForsikring?.periode,
    namespace
  })
  hasErrors = hasErrors || periodeError

  if (!_.isEmpty(periodeMedForsikring?.periode?.startdato)) {
    let duplicate: boolean
    if (_.isNil(index)) {
      duplicate = _.find(perioderMedForsikring, p => p.periode.startdato === periodeMedForsikring?.periode.startdato) !== undefined
    } else {
      const otherPerioder: Array<PeriodeMedForsikring> = _.filter(perioderMedForsikring, (p, i) => i !== index)
      duplicate = _.find(otherPerioder, e => e.periode.startdato === periodeMedForsikring?.periode?.startdato) !== undefined
    }
    if (duplicate) {
      v[namespace + idx + '-startdato'] = {
        feilmelding: t('message:validation-duplicateStartdato'),
        skjemaelementId: namespace + idx + '-startdato'
      } as FeiloppsummeringFeil
      hasErrors = true
    }
  }

  if (includeAddress && (
    !_.isEmpty(periodeMedForsikring.arbeidsgiver.adresse?.gate) ||
    !_.isEmpty(periodeMedForsikring.arbeidsgiver.adresse?.postnummer) ||
    !_.isEmpty(periodeMedForsikring.arbeidsgiver.adresse?.by) ||
    !_.isEmpty(periodeMedForsikring.arbeidsgiver.adresse?.land)
  )) {
    if (_.isEmpty(periodeMedForsikring.arbeidsgiver.adresse?.gate)) {
      v[namespace + '-gate'] = {
        skjemaelementId: namespace + '-gate',
        feilmelding: t('message:validation-noAddressStreet')
      } as FeiloppsummeringFeil
      hasErrors = true
    }
    if (_.isEmpty(periodeMedForsikring.arbeidsgiver.adresse?.postnummer)) {
      v[namespace + '-postnummer'] = {
        skjemaelementId: namespace + '-postnummer',
        feilmelding: t('message:validation-noAddressPostnummer')
      } as FeiloppsummeringFeil
      hasErrors = true
    }
    if (_.isEmpty(periodeMedForsikring.arbeidsgiver.adresse?.by)) {
      v[namespace + '-by'] = {
        skjemaelementId: namespace + '-by',
        feilmelding: t('message:validation-noAddressCity')
      } as FeiloppsummeringFeil
      hasErrors = true
    }
    if (_.isEmpty(periodeMedForsikring.arbeidsgiver.adresse?.land)) {
      v[namespace + '-land'] = {
        skjemaelementId: namespace + '-land',
        feilmelding: t('message:validation-noAddressLand')
      } as FeiloppsummeringFeil
      hasErrors = true
    }
  }

  if (hasErrors) {
    const namespaceBits = namespace.split('-')
    const mainNamespace = namespaceBits[0]
    const personNamespace = mainNamespace + '-' + namespaceBits[1]
    const categoryNamespace = personNamespace + '-' + namespaceBits[2]
    v[mainNamespace] = { feilmelding: 'notnull', skjemaelementId: '' } as FeiloppsummeringFeil
    v[personNamespace] = { feilmelding: 'notnull', skjemaelementId: '' } as FeiloppsummeringFeil
    v[categoryNamespace] = { feilmelding: 'notnull', skjemaelementId: '' } as FeiloppsummeringFeil
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
  t: TFunction,
  {
    perioderMedForsikring,
    namespace,
    includeAddress
  }: ValidatePerioderMedForsikringProps
): boolean => {
  let hasErrors: boolean = false
  perioderMedForsikring?.forEach((periodeMedForsikring: PeriodeMedForsikring, index: number) => {
    const _errors: boolean = validatePeriodeMedForsikring(validation, t, {
      periodeMedForsikring,
      perioderMedForsikring,
      index,
      namespace,
      includeAddress
    })
    hasErrors = hasErrors || _errors
  })
  return hasErrors
}
