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

  if (_.isEmpty(fnr)) {
    v[namespace + '-fnr'] = {
      feilmelding: t('message:validation-noFnr'),
      skjemaelementId: namespace + '-fnr'
    }
    hasErrors = true
  }
  if (!_.isEmpty(fnr) && !fnr.match(/^\d{11}$/)) {
    v[namespace + '-fnr'] = {
      feilmelding: t('message:validation-invalidFnr'),
      skjemaelementId: namespace + '-fnr'
    }
    hasErrors = true
  }
  if (_.isEmpty(navn)) {
    v[namespace + '-navn'] = {
      feilmelding: t('message:validation-noName'),
      skjemaelementId: namespace + '-navn'
    }
    hasErrors = true
  }
  if (_.isEmpty(relasjon)) {
    v[namespace + '-relasjon'] = {
      feilmelding: t('message:validation-noRelation'),
      skjemaelementId: namespace + '-relasjon'
    }
    hasErrors = true
  }
  return hasErrors
}
