import { validatePeriod } from 'components/Period/validation'
import { Periode } from 'declarations/sed'
import { Arbeidsgiver, Validation } from 'declarations/types'
import _ from 'lodash'
import { FeiloppsummeringFeil } from 'nav-frontend-skjema'
import { TFunction } from 'react-i18next'

export interface ValidationArbeidsgiverProps {
  arbeidsgiver: Arbeidsgiver
  namespace: string
}

const datePattern = /^\d{4}-\d{2}-\d{2}$/

export const validateArbeidsgiver = (
  v: Validation,
  t: TFunction,
  {
    arbeidsgiver,
    namespace
  }: ValidationArbeidsgiverProps
): boolean => {
  let hasErrors: boolean = false
  if (_.isEmpty(arbeidsgiver?.arbeidsgiverNavn?.trim())) {
    v[namespace + '-arbeidsgiver-navn'] = {
      skjemaelementId: namespace + '-arbeidsgiver-navn',
      feilmelding: t('message:validation-noName')
    } as FeiloppsummeringFeil
    hasErrors = true
  }
  if (_.isEmpty(arbeidsgiver?.arbeidsgiverOrgnr?.trim())) {
    v[namespace + '-arbeidsgiver-orgnr'] = {
      skjemaelementId: namespace + '-arbeidsgiver-orgnr',
      feilmelding: t('message:validation-noOrgnr')
    } as FeiloppsummeringFeil
    hasErrors = true
  }
  if (_.isEmpty(arbeidsgiver?.fraDato?.trim())) {
    v[namespace + '-arbeidsgiver-startdato'] = {
      skjemaelementId: namespace + '-arbeidsgiver-startdato',
      feilmelding: t('message:validation-noDate')
    } as FeiloppsummeringFeil
    hasErrors = true
  }
  if (!_.isEmpty(arbeidsgiver.fraDato) && !(arbeidsgiver.fraDato!.trim().match(datePattern))) {
    v[namespace + '-arbeidsgiver-startdato'] = {
      skjemaelementId: namespace + '-arbeidsgiver-startdato',
      feilmelding: t('message:validation-invalidDate')
    } as FeiloppsummeringFeil
    hasErrors = true
  }
  if (!_.isEmpty(arbeidsgiver.tilDato) && !(arbeidsgiver.tilDato!.trim().match(datePattern))) {
    v[namespace + '-arbeidsgiver-sluttdato'] = {
      skjemaelementId: namespace + '-arbeidsgiver-sluttdato',
      feilmelding: t('message:validation-invalidDate')
    } as FeiloppsummeringFeil
    hasErrors = true
  }
  return hasErrors
}

export interface ValidationArbeidsperiodeProps {
  periode: Periode
  namespace: string
}

export const validateArbeidsperiode = (
  v: Validation,
  t: TFunction,
  {
    periode,
    namespace
  }: ValidationArbeidsperiodeProps
): boolean => {
  const hasErrors: boolean = validatePeriod(v, t, {
    period: periode,
    index: -1,
    namespace: namespace + '-periode'
  })
  return hasErrors
}
