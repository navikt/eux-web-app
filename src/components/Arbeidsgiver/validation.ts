import { PeriodeMedForsikring } from 'declarations/sed'
import { Validation } from 'declarations/types'
import _ from 'lodash'
import { FeiloppsummeringFeil } from 'nav-frontend-skjema'
import { TFunction } from 'react-i18next'
import { getOrgnr } from 'utils/arbeidsgiver'

const datePattern = /^\d{4}-\d{2}-\d{2}$/

export interface ValidationArbeidsgiverProps {
  arbeidsgiver: PeriodeMedForsikring
  namespace: string
  includeAddress: boolean
}

export const validateArbeidsgiver = (
  v: Validation,
  t: TFunction,
  {
    arbeidsgiver,
    namespace,
    includeAddress
  }: ValidationArbeidsgiverProps
): boolean => {
  let hasErrors: boolean = false

  if (_.isEmpty(arbeidsgiver.arbeidsgiver?.navn?.trim())) {
    v[namespace + '-navn'] = {
      skjemaelementId: namespace + '-navn',
      feilmelding: t('message:validation-noNavn')
    } as FeiloppsummeringFeil
    hasErrors = true
  }
  if (_.isEmpty(getOrgnr(arbeidsgiver))) {
    v[namespace + '-orgnr'] = {
      skjemaelementId: namespace + '-orgnr',
      feilmelding: t('message:validation-noOrgnr')
    } as FeiloppsummeringFeil
    hasErrors = true
  }
  if (_.isEmpty(arbeidsgiver.periode?.startdato)) {
    v[namespace + '-startdato'] = {
      skjemaelementId: namespace + '-startdato',
      feilmelding: t('message:validation-noDate')
    } as FeiloppsummeringFeil
    hasErrors = true
  } else {
    if (!(arbeidsgiver.periode?.startdato!.trim().match(datePattern))) {
      v[namespace + '-startdato'] = {
        skjemaelementId: namespace + '-startdato',
        feilmelding: t('message:validation-invalidDate')
      } as FeiloppsummeringFeil
      hasErrors = true
    }
  }
  if (!_.isEmpty(arbeidsgiver.periode?.sluttdato) && !(arbeidsgiver.periode?.sluttdato!.trim().match(datePattern))) {
    v[namespace + '-sluttdato'] = {
      skjemaelementId: namespace + '-sluttdato',
      feilmelding: t('message:validation-invalidDate')
    } as FeiloppsummeringFeil
    hasErrors = true
  }

  if (includeAddress && (
    !_.isEmpty((arbeidsgiver as PeriodeMedForsikring).arbeidsgiver.adresse?.gate) ||
    !_.isEmpty((arbeidsgiver as PeriodeMedForsikring).arbeidsgiver.adresse?.postnummer) ||
    !_.isEmpty((arbeidsgiver as PeriodeMedForsikring).arbeidsgiver.adresse?.by) ||
    !_.isEmpty((arbeidsgiver as PeriodeMedForsikring).arbeidsgiver.adresse?.land)
  )) {
    if (_.isEmpty((arbeidsgiver as PeriodeMedForsikring).arbeidsgiver.adresse?.gate)) {
      v[namespace + '-gate'] = {
        skjemaelementId: namespace + '-gate',
        feilmelding: t('message:validation-noAddressStreet')
      } as FeiloppsummeringFeil
      hasErrors = true
    }
    if (_.isEmpty((arbeidsgiver as PeriodeMedForsikring).arbeidsgiver.adresse?.postnummer)) {
      v[namespace + '-postnummer'] = {
        skjemaelementId: namespace + '-postnummer',
        feilmelding: t('message:validation-noAddressPostnummer')
      } as FeiloppsummeringFeil
      hasErrors = true
    }
    if (_.isEmpty((arbeidsgiver as PeriodeMedForsikring).arbeidsgiver.adresse?.by)) {
      v[namespace + '-by'] = {
        skjemaelementId: namespace + '-by',
        feilmelding: t('message:validation-noAddressCity')
      } as FeiloppsummeringFeil
      hasErrors = true
    }
    if (_.isEmpty((arbeidsgiver as PeriodeMedForsikring).arbeidsgiver.adresse?.land)) {
      v[namespace + '-land'] = {
        skjemaelementId: namespace + '-land',
        feilmelding: t('message:validation-noAddressLand')
      } as FeiloppsummeringFeil
      hasErrors = true
    }
  }

  return hasErrors
}
