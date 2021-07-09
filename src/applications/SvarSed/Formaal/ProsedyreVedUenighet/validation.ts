import { ProsedyreVedUenighet as IProsedyreVedUenighet, Grunn } from 'declarations/sed'
import { Validation } from 'declarations/types'
import _ from 'lodash'
import { FeiloppsummeringFeil } from 'nav-frontend-skjema'
import { TFunction } from 'react-i18next'

export interface ValidationProsedyreVedUenighetGrunnProps {
  grunn: Grunn
  prosedyre_ved_uenighet: IProsedyreVedUenighet | undefined,
  index?: number
  namespace: string
  personName?: string
}

export const validateProsedyreVedUenighetGrunn = (
  v: Validation,
  t: TFunction,
  {
    grunn,
    prosedyre_ved_uenighet = {} as any,
    namespace,
    personName
  }: ValidationProsedyreVedUenighetGrunnProps
): boolean => {
  let hasErrors: boolean = false

  if (_.isEmpty(grunn?.person)) {
    v[namespace + '-person'] = {
      feilmelding: personName
        ? t('message:validation-noPersonGivenForPerson', { person: personName })
        : t('message:validation-noPersonGiven'),
      skjemaelementId: namespace + '-person'
    } as FeiloppsummeringFeil
    hasErrors = true
  }

  if (_.isEmpty(grunn?.grunn?.trim())) {
    v[namespace + '-grunn'] = {
      feilmelding: personName
        ? t('message:validation-noGrunnForPerson', { person: personName })
        : t('message:validation-noGrunn'),
      skjemaelementId: namespace + '-grunn'
    } as FeiloppsummeringFeil
    hasErrors = true
  }

  const duplicate: boolean = Object.prototype.hasOwnProperty.call(prosedyre_ved_uenighet, grunn.grunn)
  if (duplicate) {
    v[namespace + '-grunn'] = {
      feilmelding: t('message:validation-duplicateGrunnForPerson', { person: personName }),
      skjemaelementId: namespace + '-grunn'
    } as FeiloppsummeringFeil
    hasErrors = true
  }
  return hasErrors
}

export const validateProsedyreVedUenighet = (
  v: Validation,
  t: TFunction,
  prosedyreVedUenighet: IProsedyreVedUenighet = {},
  namespace: string,
  personName?: string
): boolean => {
  let hasErrors: boolean = false

  if (!prosedyreVedUenighet.bosted && !prosedyreVedUenighet.medlemsperiode && !prosedyreVedUenighet.personligSituasjon &&
    !prosedyreVedUenighet.pensjon && !prosedyreVedUenighet.oppholdetsVarighet && !prosedyreVedUenighet.ansettelse
  ) {
    v[namespace + '-grunner'] = {
      feilmelding: t('message:validation-noGrunnForPerson', { person: personName }),
      skjemaelementId: namespace + '-grunner'
    } as FeiloppsummeringFeil
    hasErrors = true
  }

  if (prosedyreVedUenighet && prosedyreVedUenighet?.ytterligereGrunner && prosedyreVedUenighet?.ytterligereGrunner?.trim()?.length > 500) {
    v[namespace + '-ytterligereGrunner'] = {
      feilmelding: t('message:validation-textOver500TilPerson', { person: personName }),
      skjemaelementId: namespace + '-ytterligereGrunner'
    } as FeiloppsummeringFeil
    hasErrors = true
  }

  if (hasErrors) {
    const namespaceBits = namespace.split('-')
    const mainNamespace = namespaceBits[0]
    const formaalNamespace = mainNamespace + '-' + namespaceBits[1]
    v[mainNamespace] = { feilmelding: 'notnull', skjemaelementId: '' } as FeiloppsummeringFeil
    v[formaalNamespace] = { feilmelding: 'notnull', skjemaelementId: '' } as FeiloppsummeringFeil
  }
  return hasErrors
}
