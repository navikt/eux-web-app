import { Validation } from 'declarations/types'
import _ from 'lodash'

export interface ValidationAddPersonModalProps {
  fnr: string
  fornavn: string
  etternavn: string
  fdato: string
  kjoenn: string
  relasjon: string | undefined
  namespace: string
}

export const validateAddPersonModal = (
  v: Validation,
  {
    fnr,
    fornavn,
    etternavn,
    fdato,
    kjoenn,
    relasjon,
    namespace
  }: ValidationAddPersonModalProps
): boolean => {
  let hasErrors = false

  if (_.isEmpty(fnr?.trim())) {
    v[namespace + '-fnr'] = {
      feilmelding: t('validation:noFnr'),
      skjemaelementId: namespace + '-fnr'
    }
    hasErrors = true
  }
  if (!_.isEmpty(fnr?.trim()) && !fnr.match(/^\d{11}$/)) {
    v[namespace + '-fnr'] = {
      feilmelding: t('validation:invalidFnr'),
      skjemaelementId: namespace + '-fnr'
    }
    hasErrors = true
  }
  if (_.isEmpty(fornavn?.trim())) {
    v[namespace + '-fornavn'] = {
      feilmelding: t('validation:noFornavn'),
      skjemaelementId: namespace + '-fornavn'
    }
    hasErrors = true
  }
  if (_.isEmpty(etternavn?.trim())) {
    v[namespace + '-etternavn'] = {
      feilmelding: t('validation:noEtternavn'),
      skjemaelementId: namespace + '-etternavn'
    }
    hasErrors = true
  }
  if (_.isEmpty(kjoenn?.trim())) {
    v[namespace + '-kjoenn'] = {
      feilmelding: t('validation:noKjoenn'),
      skjemaelementId: namespace + '-kjoenn'
    }
    hasErrors = true
  }
  if (_.isEmpty(fdato?.trim())) {
    v[namespace + '-fdato'] = {
      feilmelding: t('validation:noFoedselsdato'),
      skjemaelementId: namespace + '-fdato'
    }
    hasErrors = true
  }
  if (_.isEmpty(relasjon?.trim())) {
    v[namespace + '-relasjon'] = {
      feilmelding: t('validation:noRelation'),
      skjemaelementId: namespace + '-relasjon'
    }
    hasErrors = true
  }
  return hasErrors
}
