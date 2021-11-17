import { PeriodeMedForsikring } from 'declarations/sed'
import { Validation } from 'declarations/types'
import _ from 'lodash'
import { FeiloppsummeringFeil } from 'nav-frontend-skjema'
import { TFunction } from 'react-i18next'
import { getOrgnr } from 'utils/arbeidsgiver'

export interface ValidationArbeidsgiverProps {
  arbeidsgiver: PeriodeMedForsikring
  namespace: string
  includeAddress: boolean
}

export interface ValidationArbeidsgiverSøkProps {
  fom: string
  tom: string
  inntektslistetype: string
  namespace: string
}

const datePattern = /^\d{4}-\d{2}$/

export const validateArbeidsgiverSøk = (
  v: Validation,
  t: TFunction,
  {
    fom,
    tom,
    inntektslistetype,
    namespace
  }: ValidationArbeidsgiverSøkProps
): boolean => {
  let hasErrors: boolean = false
  if (_.isEmpty(fom.trim())) {
    v[namespace + '-startdato'] = {
      skjemaelementId: namespace + '-startdato',
      feilmelding: t('validation:noDate')
    } as FeiloppsummeringFeil
    hasErrors = true
  } else {
    if (!(fom.trim().match(datePattern))) {
      v[namespace + '-startdato'] = {
        skjemaelementId: namespace + '-startdato',
        feilmelding: t('validation:invalidDate')
      } as FeiloppsummeringFeil
    }
  }

  if (_.isEmpty(tom.trim())) {
    v[namespace + '-sluttdato'] = {
      skjemaelementId: namespace + '-sluttdato',
      feilmelding: t('validation:noDate')
    } as FeiloppsummeringFeil
    hasErrors = true
  } else {
    if (!(tom.trim().match(datePattern))) {
      v[namespace + '-sluttdato'] = {
        skjemaelementId: namespace + '-sluttdato',
        feilmelding: t('validation:invalidDate')
      } as FeiloppsummeringFeil
    }
  }

  if (_.isEmpty(inntektslistetype.trim())) {
    v[namespace + '-inntektslistetype'] = {
      skjemaelementId: namespace + '-inntektslistetype',
      feilmelding: t('validation:noInntektsliste')
    } as FeiloppsummeringFeil
    hasErrors = true
  }

  return hasErrors
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
      feilmelding: t('validation:noNavn')
    } as FeiloppsummeringFeil
    hasErrors = true
  }
  if (_.isEmpty(getOrgnr(arbeidsgiver, 'organisasjonsnummer'))) {
    v[namespace + '-orgnr'] = {
      skjemaelementId: namespace + '-orgnr',
      feilmelding: t('validation:noOrgnr')
    } as FeiloppsummeringFeil
    hasErrors = true
  }
  if (_.isEmpty(arbeidsgiver.startdato)) {
    v[namespace + '-startdato'] = {
      skjemaelementId: namespace + '-startdato',
      feilmelding: t('validation:noDate')
    } as FeiloppsummeringFeil
    hasErrors = true
  } else {
    if (!(arbeidsgiver.startdato!.trim().match(datePattern))) {
      v[namespace + '-startdato'] = {
        skjemaelementId: namespace + '-startdato',
        feilmelding: t('validation:invalidDate')
      } as FeiloppsummeringFeil
      hasErrors = true
    }
  }
  if (!_.isEmpty(arbeidsgiver.sluttdato) && !(arbeidsgiver.sluttdato!.trim().match(datePattern))) {
    v[namespace + '-sluttdato'] = {
      skjemaelementId: namespace + '-sluttdato',
      feilmelding: t('validation:invalidDate')
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
        feilmelding: t('validation:noAddressStreet')
      } as FeiloppsummeringFeil
      hasErrors = true
    }
    if (_.isEmpty((arbeidsgiver as PeriodeMedForsikring).arbeidsgiver.adresse?.postnummer)) {
      v[namespace + '-postnummer'] = {
        skjemaelementId: namespace + '-postnummer',
        feilmelding: t('validation:noAddressPostnummer')
      } as FeiloppsummeringFeil
      hasErrors = true
    }
    if (_.isEmpty((arbeidsgiver as PeriodeMedForsikring).arbeidsgiver.adresse?.by)) {
      v[namespace + '-by'] = {
        skjemaelementId: namespace + '-by',
        feilmelding: t('validation:noAddressCity')
      } as FeiloppsummeringFeil
      hasErrors = true
    }
    if (_.isEmpty((arbeidsgiver as PeriodeMedForsikring).arbeidsgiver.adresse?.land)) {
      v[namespace + '-land'] = {
        skjemaelementId: namespace + '-land',
        feilmelding: t('validation:noAddressCountry')
      } as FeiloppsummeringFeil
      hasErrors = true
    }
  }

  return hasErrors
}
