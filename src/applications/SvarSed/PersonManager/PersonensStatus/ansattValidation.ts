import { Arbeidsforholdet, Validation } from 'declarations/types'
import _ from 'lodash'
import { FeiloppsummeringFeil } from 'nav-frontend-skjema'
import { TFunction } from 'react-i18next'

export interface ValidationArbeidsforholdProps {
  arbeidsforhold: Arbeidsforholdet
  namespace: string
}

const datePattern = /^\d{4}-\d{2}-\d{2}$/

export const validateArbeidsforhold = (
  v: Validation,
  t: TFunction,
  {
    arbeidsforhold,
    namespace
  }: ValidationArbeidsforholdProps
): boolean => {
  let hasErrors: boolean = false
  if (_.isEmpty(arbeidsforhold?.arbeidsgiverNavn?.trim())) {
    v[namespace + '-navn'] = {
      skjemaelementId: namespace + '-navn',
      feilmelding: t('message:validation-noName')
    } as FeiloppsummeringFeil
    hasErrors = true
  }
  if (_.isEmpty(arbeidsforhold?.arbeidsgiverOrgnr?.trim())) {
    v[namespace + '-orgnr'] = {
      skjemaelementId: namespace + '-orgnr',
      feilmelding: t('message:validation-noOrgnr')
    } as FeiloppsummeringFeil
    hasErrors = true
  }
  if (_.isEmpty(arbeidsforhold?.fraDato?.trim())) {
    v[namespace + '-startdato'] = {
      skjemaelementId: namespace + '-startdato',
      feilmelding: t('message:validation-noDate')
    } as FeiloppsummeringFeil
    hasErrors = true
  }
  if (!_.isEmpty(arbeidsforhold.fraDato) && !(arbeidsforhold.fraDato!.trim().match(datePattern))) {
    v[namespace + '-startdato'] = {
      skjemaelementId: namespace + '-startdato',
      feilmelding: t('message:validation-invalidDate')
    } as FeiloppsummeringFeil
    hasErrors = true
  }
  if (!_.isEmpty(arbeidsforhold.tilDato) && !(arbeidsforhold.tilDato!.trim().match(datePattern))) {
    v[namespace + '-sluttdato'] = {
      skjemaelementId: namespace + '-sluttdato',
      feilmelding: t('message:validation-invalidDate')
    } as FeiloppsummeringFeil
    hasErrors = true
  }
  return hasErrors
}
