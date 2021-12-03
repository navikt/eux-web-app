import { PeriodeMedForsikring } from 'declarations/sed'
import { Validation } from 'declarations/types'
import _ from 'lodash'
import moment from 'moment'
import { ErrorElement } from 'declarations/app.d'
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

const dateSearchPattern = /^\d{4}-\d{2}$/

const datePattern = /^\d{4}-\d{2}-\d{2}$/

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
    } as ErrorElement
    hasErrors = true
  } else {
    if (!(fom.trim().match(dateSearchPattern))) {
      v[namespace + '-startdato'] = {
        skjemaelementId: namespace + '-startdato',
        feilmelding: t('validation:invalidDate')
      } as ErrorElement
      hasErrors = true
    } else {
      const fomDate = moment(fom, 'YYYY-MM')
      if (fomDate.isBefore(new Date(2015, 0, 1))) {
        v[namespace + '-startdato'] = {
          feilmelding: t('validation:invalidDate2015'),
          skjemaelementId: namespace + '-startdato'
        } as ErrorElement
        hasErrors = true
      }
    }
  }

  if (_.isEmpty(tom.trim())) {
    v[namespace + '-sluttdato'] = {
      skjemaelementId: namespace + '-sluttdato',
      feilmelding: t('validation:noDate')
    } as ErrorElement
    hasErrors = true
  } else {
    if (!(tom.trim().match(dateSearchPattern))) {
      v[namespace + '-sluttdato'] = {
        skjemaelementId: namespace + '-sluttdato',
        feilmelding: t('validation:invalidDate')
      } as ErrorElement
      hasErrors = true
    } else {
      const fomDate = moment(fom, 'YYYY-MM')
      const tomDate = moment(tom, 'YYYY-MM')
      if (tomDate.isBefore(fomDate)) {
        v[namespace + '-sluttdato'] = {
          feilmelding: t('validation:invalidDateFomTom'),
          skjemaelementId: namespace + '-sluttdato'
        } as ErrorElement
        hasErrors = true
      }
    }
  }

  if (_.isEmpty(inntektslistetype.trim())) {
    v[namespace + '-inntektslistetype'] = {
      skjemaelementId: namespace + '-inntektslistetype',
      feilmelding: t('validation:noInntektsliste')
    } as ErrorElement
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
    } as ErrorElement
    hasErrors = true
  }
  if (_.isEmpty(getOrgnr(arbeidsgiver, 'organisasjonsnummer'))) {
    v[namespace + '-orgnr'] = {
      skjemaelementId: namespace + '-orgnr',
      feilmelding: t('validation:noOrgnr')
    } as ErrorElement
    hasErrors = true
  }
  if (_.isEmpty(arbeidsgiver.startdato)) {
    v[namespace + '-startdato'] = {
      skjemaelementId: namespace + '-startdato',
      feilmelding: t('validation:noDate')
    } as ErrorElement
    hasErrors = true
  } else {
    if (!(arbeidsgiver.startdato!.trim().match(datePattern))) {
      v[namespace + '-startdato'] = {
        skjemaelementId: namespace + '-startdato',
        feilmelding: t('validation:invalidDate')
      } as ErrorElement
      hasErrors = true
    }
  }
  if (!_.isEmpty(arbeidsgiver.sluttdato) && !(arbeidsgiver.sluttdato!.trim().match(datePattern))) {
    v[namespace + '-sluttdato'] = {
      skjemaelementId: namespace + '-sluttdato',
      feilmelding: t('validation:invalidDate')
    } as ErrorElement
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
      } as ErrorElement
      hasErrors = true
    }
    if (_.isEmpty((arbeidsgiver as PeriodeMedForsikring).arbeidsgiver.adresse?.postnummer)) {
      v[namespace + '-postnummer'] = {
        skjemaelementId: namespace + '-postnummer',
        feilmelding: t('validation:noAddressPostnummer')
      } as ErrorElement
      hasErrors = true
    }
    if (_.isEmpty((arbeidsgiver as PeriodeMedForsikring).arbeidsgiver.adresse?.by)) {
      v[namespace + '-by'] = {
        skjemaelementId: namespace + '-by',
        feilmelding: t('validation:noAddressCity')
      } as ErrorElement
      hasErrors = true
    }
    if (_.isEmpty((arbeidsgiver as PeriodeMedForsikring).arbeidsgiver.adresse?.land)) {
      v[namespace + '-land'] = {
        skjemaelementId: namespace + '-land',
        feilmelding: t('validation:noAddressCountry')
      } as ErrorElement
      hasErrors = true
    }
  }

  return hasErrors
}
