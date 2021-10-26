import { Validation } from 'declarations/types'
import _ from 'lodash'
import { FeiloppsummeringFeil } from 'nav-frontend-skjema'
import { TFunction } from 'react-i18next'

export interface ValidationOpprettSakProps {
  fnr: string
  isFnrValid: boolean
  sektor: string
  buctype: string
  sedtype: string
  landkode: string
  institusjon: string
  namespace: string
  tema: string
  saksId: string
  visEnheter: boolean
  unit: string
}

export const validateOpprettSak = (
  v: Validation,
  t: TFunction,
  {
    fnr,
    isFnrValid,
    sektor,
    buctype,
    sedtype,
    landkode,
    institusjon,
    namespace,
    tema,
    saksId,
    visEnheter,
    unit
  }: ValidationOpprettSakProps
): boolean => {
  let hasErrors: boolean = false

  if (_.isEmpty(fnr)) {
    v[namespace + '-fnr'] = {
      feilmelding: t('validation:noFnr'),
      skjemaelementId: namespace + '-fnr'
    } as FeiloppsummeringFeil
    hasErrors = true
  }

  if (!isFnrValid) {
    v[namespace + '-fnr'] = {
      feilmelding: t('validation:uncheckedFnr'),
      skjemaelementId: namespace + '-fnr'
    } as FeiloppsummeringFeil
    hasErrors = true
  }

  if (_.isEmpty(sektor)) {
    v[namespace + '-sektor'] = {
      feilmelding: t('validation:noSektor'),
      skjemaelementId: namespace + '-sektor'
    } as FeiloppsummeringFeil
    hasErrors = true
  }

  if (_.isEmpty(buctype)) {
    v[namespace + '-buctype'] = {
      feilmelding: t('validation:noBuctype'),
      skjemaelementId: namespace + '-buctype'
    } as FeiloppsummeringFeil
    hasErrors = true
  }

  if (_.isEmpty(sedtype)) {
    v[namespace + '-sedtype'] = {
      feilmelding: t('validation:noSedtype'),
      skjemaelementId: namespace + '-sedtype'
    } as FeiloppsummeringFeil
    hasErrors = true
  }
  if (_.isEmpty(landkode)) {
    v[namespace + '-landkode'] = {
      feilmelding: t('validation:noLand'),
      skjemaelementId: namespace + '-landkode'
    } as FeiloppsummeringFeil
    hasErrors = true
  }
  if (_.isEmpty(institusjon)) {
    v[namespace + '-institusjon'] = {
      feilmelding: t('validation:noInstitusjonsID'),
      skjemaelementId: namespace + '-institusjon'
    } as FeiloppsummeringFeil
    hasErrors = true
  }
  if (_.isEmpty(tema)) {
    v[namespace + '-tema'] = {
      feilmelding: t('validation:noTema'),
      skjemaelementId: namespace + '-tema'
    } as FeiloppsummeringFeil
    hasErrors = true
  }
  if (_.isEmpty(saksId)) {
    v[namespace + '-saksId'] = {
      feilmelding: t('validation:noSaksId'),
      skjemaelementId: namespace + '-saksId'
    } as FeiloppsummeringFeil
    hasErrors = true
  }
  if (_.isEmpty(saksId)) {
    v[namespace + '-saksId'] = {
      feilmelding: t('validation:noSaksId'),
      skjemaelementId: namespace + '-saksId'
    } as FeiloppsummeringFeil
    hasErrors = true
  }
  if (visEnheter && _.isEmpty(unit)) {
    v[namespace + '-unit'] = {
      feilmelding: t('validation:noUnit'),
      skjemaelementId: namespace + '-unit'
    } as FeiloppsummeringFeil
    hasErrors = true
  }

  return hasErrors
}
