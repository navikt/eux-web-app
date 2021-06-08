import { FormalProsedyreVedUenighet, Grunn } from 'declarations/sed'
import { Validation } from 'declarations/types'
import _ from 'lodash'
import { FeiloppsummeringFeil } from 'nav-frontend-skjema'
import { TFunction } from 'react-i18next'
import { getIdx } from 'utils/namespace'

export interface ValidationProsedyreVedUenighetGrunnProps {
  grunn: Grunn
  grunner: Array<Grunn>,
  index?: number
  namespace: string
  personName?: string
}

export const validateProsedyreVedUenighetGrunn = (
  v: Validation,
  t: TFunction,
  {
    grunn,
    grunner,
    index,
    namespace,
    personName
  }: ValidationProsedyreVedUenighetGrunnProps
): boolean => {
  let hasErrors: boolean = false
  const idx = getIdx(index)

  if (_.isEmpty(grunn?.person)) {
    v[namespace + '-grunner' + idx + '-person'] = {
      feilmelding: personName
        ? t('message:validation-noPersonGivenForPerson', { person: personName })
        : t('message:validation-noPersonGiven'),
      skjemaelementId: namespace + '-grunner' + idx + '-person'
    } as FeiloppsummeringFeil
    hasErrors = true
  }

  if (_.isEmpty(grunn?.grunn?.trim())) {
    v[namespace + '-grunner' + idx + '-grunn'] = {
      feilmelding: personName
        ? t('message:validation-noGrunnForPerson', { person: personName })
        : t('message:validation-noGrunn'),
      skjemaelementId: namespace + '-grunner' + idx + '-grunn'
    } as FeiloppsummeringFeil
    hasErrors = true
  }

  let duplicate: boolean = false
  if (_.isNil(index)) {
    duplicate = _.find(grunner, {grunn: grunn.grunn}) !== undefined
  } else {
    const otherGrunns: Array<Grunn> = _.filter(grunner, (t, i) => i !== index)
    duplicate = _.find(otherGrunns, {grunn: grunn.grunn}) !== undefined
  }
  if (duplicate) {
    v[namespace + '-grunner' + idx + '-grunn'] = {
      feilmelding: t('message:validation-duplicateGrunnForPerson', { person: personName }),
      skjemaelementId: namespace + '-grunner' + idx + '-grunn'
    } as FeiloppsummeringFeil
    hasErrors = true
  }
  return hasErrors
}

export const validateProsedyreVedUenighet = (
  v: Validation,
  t: TFunction,
  prosedyreVedUenighet: FormalProsedyreVedUenighet,
  namespace: string,
  personName?: string
): boolean => {
  let hasErrors: boolean = false

  if (_.isEmpty(prosedyreVedUenighet?.grunner)) {
    v[namespace + '-grunner'] = {
      feilmelding: t('message:validation-noGrunnForPerson', { person: personName }),
      skjemaelementId: namespace + '-grunner'
    } as FeiloppsummeringFeil
    hasErrors = true
  }

  prosedyreVedUenighet?.grunner?.forEach((grunn: Grunn, index: number) => {
    const _error = validateProsedyreVedUenighetGrunn(v, t, { grunn, grunner: prosedyreVedUenighet?.grunner, index, namespace, personName })
    hasErrors = hasErrors || _error
  })

  if (hasErrors) {
    const namespaceBits = namespace.split('-')
    const mainNamespace = namespaceBits[0]
    const formaalNamespace = mainNamespace + '-' + namespaceBits[1]
    v[mainNamespace] = { feilmelding: 'notnull', skjemaelementId: '' } as FeiloppsummeringFeil
    v[formaalNamespace] = { feilmelding: 'notnull', skjemaelementId: '' } as FeiloppsummeringFeil
  }
  return hasErrors
}
