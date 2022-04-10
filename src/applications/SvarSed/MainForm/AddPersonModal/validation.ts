import { Validation } from 'declarations/types'
import _ from 'lodash'
import { TFunction } from 'react-i18next'

export interface ValidationAddPersonModalProps {
  fnr: string
  navn: string
  relasjon: string | undefined
  namespace: string
}

export const validateAddPersonModal = (
  v: Validation,
  t: TFunction,
  {
    fnr,
    navn,
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
  if (_.isEmpty(navn?.trim())) {
    v[namespace + '-navn'] = {
      feilmelding: t('validation:noNavn'),
      skjemaelementId: namespace + '-navn'
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
