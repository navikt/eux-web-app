import { Arbeidsforholdet, Validation } from 'declarations/types'
import { FeiloppsummeringFeil } from 'nav-frontend-skjema'
import { TFunction } from 'react-i18next'

export interface ValidationArbeidsforholdProps {
  arbeidsforhold: Arbeidsforholdet
  namespace: string
}

export const validateArbeidsforhold = (
  v: Validation,
  t: TFunction,
  {
    arbeidsforhold,
    namespace
  }: ValidationArbeidsforholdProps
): void => {
  if (!arbeidsforhold.arbeidsgiverNavn) {
    v[namespace + '-navn'] = {
      skjemaelementId: 'c-' + namespace + '-navn-text',
      feilmelding: t('message:validation-noName')
    } as FeiloppsummeringFeil
  }
  if (!arbeidsforhold.arbeidsgiverOrgnr) {
    v[namespace + '-orgnr'] = {
      skjemaelementId: 'c-' + namespace + '-orgnr-text',
      feilmelding: t('message:validation-noOrgnr')
    } as FeiloppsummeringFeil
  }
  if (!arbeidsforhold.fraDato) {
    v[namespace + '-startdato'] = {
      skjemaelementId: 'c-' + namespace + '-startdato-date',
      feilmelding: t('message:validation-noDate')
    } as FeiloppsummeringFeil
  }
  if (arbeidsforhold.fraDato && !arbeidsforhold.fraDato.match(/\d{2}\.\d{2}\.\d{4}/)) {
    v[namespace + '-startdato'] = {
      skjemaelementId: 'c-' + namespace + '-startdato-date',
      feilmelding: t('message:validation-invalidDate')
    } as FeiloppsummeringFeil
  }
  if (arbeidsforhold.tilDato && !arbeidsforhold.tilDato.match(/\d{2}\.\d{2}\.\d{4}/)) {
    v[namespace + '-sluttdato'] = {
      skjemaelementId: 'c-' + namespace + '-sluttdato-date',
      feilmelding: t('message:validation-invalidDate')
    } as FeiloppsummeringFeil
  }
}
