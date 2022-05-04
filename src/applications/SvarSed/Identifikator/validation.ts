import { ArbeidsgiverIdentifikator } from 'declarations/sed'
import { Validation } from 'declarations/types'
import _ from 'lodash'
import { ErrorElement } from 'declarations/app.d'
import { getIdx } from 'utils/namespace'

export interface ValidationIdentifikatorProps {
  identifikatorer: Array<ArbeidsgiverIdentifikator> | undefined
  identifikator: ArbeidsgiverIdentifikator
  index?: number,
  namespace: string
  personName?: string
}

const getId = (it: ArbeidsgiverIdentifikator | null): string => it?.type + '-' + it?.id

export const validateIdentifikator = (
  v: Validation,
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
      feilmelding: t('validation:noType') + (personName ? t('validation:til-person', { person: personName }) : ''),
      skjemaelementId: namespace + idx + '-type'
    } as ErrorElement
    hasErrors = true
  }

  if (_.isEmpty(identifikator?.id)) {
    v[namespace + idx + '-id'] = {
      feilmelding: t('validation:noId') + (personName ? t('validation:til-person', { person: personName }) : ''),
      skjemaelementId: namespace + idx + '-id'
    } as ErrorElement
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
        feilmelding: t('validation:duplicateId') + (personName ? t('validation:til-person', { person: personName }) : ''),
        skjemaelementId: namespace + idx + '-id'
      } as ErrorElement
      hasErrors = true
    }
  }

  if (hasErrors) {
    const namespaceBits = namespace.split('-')
    const mainNamespace = namespaceBits[0]
    const personNamespace = mainNamespace + '-' + namespaceBits[1]
    const categoryNamespace = personNamespace + '-' + namespaceBits[2]
    v[mainNamespace] = { feilmelding: 'error', skjemaelementId: '' } as ErrorElement
    v[personNamespace] = { feilmelding: 'error', skjemaelementId: '' } as ErrorElement
    v[categoryNamespace] = { feilmelding: 'error', skjemaelementId: '' } as ErrorElement
  }
  return hasErrors
}
