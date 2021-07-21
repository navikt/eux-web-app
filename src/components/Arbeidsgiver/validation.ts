import { Arbeidsgiver, Validation } from 'declarations/types'
import _ from 'lodash'
import { FeiloppsummeringFeil } from 'nav-frontend-skjema'
import { TFunction } from 'react-i18next'

const datePattern = /^\d{4}-\d{2}-\d{2}$/

export interface ValidationArbeidsgiverProps {
  arbeidsgiver: Arbeidsgiver
  namespace: string
}

export const validateArbeidsgiver = (
  v: Validation,
  t: TFunction,
  {
    arbeidsgiver,
    namespace
  }: ValidationArbeidsgiverProps
): boolean => {
  let hasErrors: boolean = false
  if (_.isEmpty(arbeidsgiver?.arbeidsgiversNavn?.trim())) {
    v[namespace + '-arbeidsgiver-navn'] = {
      skjemaelementId: namespace + '-arbeidsgiver-navn',
      feilmelding: t('message:validation-noNavn')
    } as FeiloppsummeringFeil
    hasErrors = true
  }
  if (_.isEmpty(arbeidsgiver?.arbeidsgiversOrgnr?.trim())) {
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
