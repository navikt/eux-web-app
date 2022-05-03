import { Barnetilhoerighet } from 'declarations/sed'
import { Validation } from 'declarations/types'
import _ from 'lodash'
import { ErrorElement } from 'declarations/app.d'
import { TFunction } from 'react-i18next'
import { getIdx } from 'utils/namespace'

export interface ValidationBarnetilhoerigheterProps {
  barnetilhorighet: Barnetilhoerighet,
  barnetilhorigheter: Array<Barnetilhoerighet>,
  index?: number
  namespace: string,
  personName?: string
}

export const validateBarnetilhoerighet = (
  v: Validation,
  t: TFunction,
  {
    barnetilhorighet,
    barnetilhorigheter,
    namespace,
    index,
    personName
  }: ValidationBarnetilhoerigheterProps
): boolean => {
  let hasErrors: boolean = false
  const idx = getIdx(index)

  if (_.isEmpty(barnetilhorighet.relasjonTilPerson)) {
    v[namespace + idx + '-relasjonTilPerson'] = {
      feilmelding: t('validation:noRelation') + (personName ? t('validation:til-person', { person: personName }) : ''),
      skjemaelementId: namespace + idx + '-relasjonTilPerson'
    } as ErrorElement
    hasErrors = true
  } else {
    let duplicate: boolean
    if (_.isNil(index)) {
      duplicate = _.find(barnetilhorigheter, { relasjonTilPerson: barnetilhorighet.relasjonTilPerson }) !== undefined
    } else {
      const otherBarnetilhoerigheter: Array<Barnetilhoerighet> = _.filter(barnetilhorigheter, (t, i) => i !== index)
      duplicate = _.find(otherBarnetilhoerigheter, { relasjonTilPerson: barnetilhorighet.relasjonTilPerson }) !== undefined
    }
    if (duplicate) {
      v[namespace + idx + '-relasjonTilPerson'] = {
        feilmelding: t('validation:duplicateRelation') + (personName ? t('validation:til-person', { person: personName }) : ''),
        skjemaelementId: namespace + idx + '-relasjonTilPerson'
      } as ErrorElement
      hasErrors = true
    }
  }

  if (_.isEmpty(barnetilhorighet.relasjonType)) {
    v[namespace + idx + '-relasjonType'] = {
      feilmelding: t('validation:noRelationType') + (personName ? t('validation:til-person', { person: personName }) : ''),
      skjemaelementId: namespace + idx + '-relasjonType'
    } as ErrorElement
    hasErrors = true
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

interface ValidadeBarnetilhoerigheterProps {
  barnetilhorigheter: Array<Barnetilhoerighet>
  namespace: string
  personName?: string
}

export const validateBarnetilhoerigheter = (
  validation: Validation,
  t: TFunction,
  {
    barnetilhorigheter,
    namespace,
    personName
  }: ValidadeBarnetilhoerigheterProps
): boolean => {
  let hasErrors: boolean = false
  barnetilhorigheter?.forEach((barnetilhorighet: Barnetilhoerighet, index) => {
    const _error: boolean = validateBarnetilhoerighet(validation, t, { barnetilhorighet, barnetilhorigheter, index, namespace, personName })
    hasErrors = hasErrors || _error
  })
  return hasErrors
}
