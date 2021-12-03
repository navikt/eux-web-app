
import { ProsedyreVedUenighet as IProsedyreVedUenighet, Grunn } from 'declarations/sed'
import { Validation } from 'declarations/types'
import _ from 'lodash'
import { ErrorElement } from 'declarations/app'
import { TFunction } from 'react-i18next'

export interface ValidationProsedyreVedUenighetGrunnProps {
  grunn: Grunn
  prosedyreVedUenighet: IProsedyreVedUenighet | undefined
  index?: number
  namespace: string
  formalName?: string
}

export const validateProsedyreVedUenighetGrunn = (
  v: Validation,
  t: TFunction,
  {
    grunn,
    prosedyreVedUenighet = {} as any,
    namespace,
    formalName
  }: ValidationProsedyreVedUenighetGrunnProps
): boolean => {
  let hasErrors: boolean = false

  if (_.isEmpty(grunn?.person)) {
    v[namespace + '-person'] = {
      feilmelding: formalName
        ? t('validation:noPersonGivenTil', { person: formalName })
        : t('validation:noPersonGiven'),
      skjemaelementId: namespace + '-person'
    } as ErrorElement
    hasErrors = true
  }

  if (_.isEmpty(grunn?.grunn?.trim())) {
    v[namespace + '-grunn'] = {
      feilmelding: formalName
        ? t('validation:noGrunnTil', { person: formalName })
        : t('validation:noGrunn'),
      skjemaelementId: namespace + '-grunn'
    } as ErrorElement
    hasErrors = true
  }

  const duplicate: boolean = Object.prototype.hasOwnProperty.call(prosedyreVedUenighet, grunn.grunn)
  if (duplicate) {
    v[namespace + '-grunn'] = {
      feilmelding: t('validation:duplicateGrunnTil', { person: formalName }),
      skjemaelementId: namespace + '-grunn'
    } as ErrorElement
    hasErrors = true
  }
  return hasErrors
}

interface ValidateProsedyreVedUenighetProps {
  prosedyreVedUenighet: IProsedyreVedUenighet
  namespace: string
  formalName: string
}

export const validateProsedyreVedUenighet = (
  v: Validation,
  t: TFunction, {
    prosedyreVedUenighet = {},
    namespace,
    formalName
  }: ValidateProsedyreVedUenighetProps
): boolean => {
  let hasErrors: boolean = false

  if (!prosedyreVedUenighet.bosted && !prosedyreVedUenighet.medlemsperiode && !prosedyreVedUenighet.personligSituasjon &&
    !prosedyreVedUenighet.pensjon && !prosedyreVedUenighet.oppholdetsVarighet && !prosedyreVedUenighet.ansettelse
  ) {
    v[namespace + '-grunner'] = {
      feilmelding: t('validation:noGrunnTil', { person: formalName }),
      skjemaelementId: namespace + '-grunner'
    } as ErrorElement
    hasErrors = true
  }

  if (prosedyreVedUenighet && prosedyreVedUenighet?.ytterligereGrunner && prosedyreVedUenighet?.ytterligereGrunner?.trim()?.length > 500) {
    v[namespace + '-ytterligereGrunner'] = {
      feilmelding: t('validation:textOver500Til', { person: formalName }),
      skjemaelementId: namespace + '-ytterligereGrunner'
    } as ErrorElement
    hasErrors = true
  }

  if (hasErrors) {
    const namespaceBits = namespace.split('-')
    const mainNamespace = namespaceBits[0]
    const formaalNamespace = mainNamespace + '-' + namespaceBits[1]
    v[mainNamespace] = { feilmelding: 'notnull', skjemaelementId: '' } as ErrorElement
    v[formaalNamespace] = { feilmelding: 'notnull', skjemaelementId: '' } as ErrorElement
  }
  return hasErrors
}
