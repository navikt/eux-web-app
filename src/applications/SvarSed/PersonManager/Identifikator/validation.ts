import { ArbeidsgiverIdentifikator } from 'declarations/sed'
import { Validation } from 'declarations/types'
import _ from 'lodash'
import { FeiloppsummeringFeil } from 'nav-frontend-skjema'
import { TFunction } from 'react-i18next'
import { getIdx } from 'utils/namespace'

export interface ValidationIdentifikatorProps {
  identifikatorer: Array<ArbeidsgiverIdentifikator> | undefined
  identifikator: ArbeidsgiverIdentifikator
  index?: number,
  namespace: string
  personName: string
}

const getId = (it: ArbeidsgiverIdentifikator | null): string => it?.type + '-' + it?.id

export const validateIdentifikator = (
  v: Validation,
  t: TFunction,
  {
    identifikatorer,
    identifikator,
    index,
    namespace,
    personName
  }: ValidationIdentifikatorProps
): boolean => {
  let hasErrors: boolean = false
  const idx = getIdx(index)

  if (_.isEmpty(identifikator?.type)) {
    v[namespace + idx + '-type'] = {
      feilmelding: t('validation:noTypeTil', { person: personName }),
      skjemaelementId: namespace + idx + '-type'
    } as FeiloppsummeringFeil
    hasErrors = true
  }

  if (_.isEmpty(identifikator?.id)) {
    v[namespace + idx + '-id'] = {
      feilmelding: t('validation:noIdTil', { person: personName }),
      skjemaelementId: namespace + idx + '-id'
    } as FeiloppsummeringFeil
    hasErrors = true
  }

  if (!_.isEmpty(identifikator?.id) && _.isEmpty(identifikator?.type)) {
    let duplicate: boolean
    if (_.isNil(index)) {
      duplicate = _.find(identifikatorer, id => getId(id) === getId(identifikator)) !== undefined
    } else {
      const otherIentifikatorer: Array<ArbeidsgiverIdentifikator> = _.filter(identifikatorer, (p, i) => i !== index)
      duplicate = _.find(otherIentifikatorer, id => getId(id) === getId(identifikator)) !== undefined
    }

    if (duplicate) {
      v[namespace + idx + '-id'] = {
        feilmelding: t('validation:duplicateIdTil', { person: personName }),
        skjemaelementId: namespace + idx + '-id'
      } as FeiloppsummeringFeil
      hasErrors = true
    }
  }

  if (hasErrors) {
    const namespaceBits = namespace.split('-')
    const mainNamespace = namespaceBits[0]
    const personNamespace = mainNamespace + '-' + namespaceBits[1]
    const categoryNamespace = personNamespace + '-' + namespaceBits[2]
    v[mainNamespace] = { feilmelding: 'notnull', skjemaelementId: '' } as FeiloppsummeringFeil
    v[personNamespace] = { feilmelding: 'notnull', skjemaelementId: '' } as FeiloppsummeringFeil
    v[categoryNamespace] = { feilmelding: 'notnull', skjemaelementId: '' } as FeiloppsummeringFeil
  }
  return hasErrors
}