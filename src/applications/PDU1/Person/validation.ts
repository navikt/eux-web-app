import { ErrorElement } from 'declarations/app'
import { Pdu1Person } from 'declarations/pd'
import { Validation } from 'declarations/types'
import _ from 'lodash'
import { TFunction } from 'react-i18next'
import { getIdx } from 'utils/namespace'

export interface ValidationPersonProps {
  person: Pdu1Person,
  namespace: string
}

export interface ValidationUtenlandskPinProps {
  land: string,
  identifikator: string
  utenlandskePins: Array<string> | undefined
  index ?: number
  namespace: string
}

const datePattern = /^\d{4}-\d{2}-\d{2}$/

export const validateUtenlandskPin = (
  v: Validation,
  t: TFunction,
  {
    land,
    identifikator,
    utenlandskePins,
    index,
    namespace
  }: ValidationUtenlandskPinProps
): boolean => {
  let hasErrors: boolean = false
  const idx = getIdx(index)

  if (_.isEmpty(identifikator?.trim())) {
    v[namespace + idx + '-identifikator'] = {
      feilmelding: t('validation:noId'),
      skjemaelementId: namespace + idx + '-identifikator'
    } as ErrorElement
    hasErrors = true
  }

  if (_.isEmpty(land?.trim())) {
    v[namespace + idx + '-land'] = {
      feilmelding: t('validation:noLand'),
      skjemaelementId: namespace + idx + '-land'
    } as ErrorElement
    hasErrors = true
  }

  let duplicate: boolean

  if (!_.isEmpty(land)) {
    if (_.isNil(index)) {
      duplicate = _.find(utenlandskePins, (pin: string) => pin.split(' ')[0] === land) !== undefined
    } else {
      const otherPins: Array<string> = _.filter(utenlandskePins, (p, i) => i !== index)
      duplicate = _.find(otherPins, (pin: string) => pin.split(' ')[0] === land) !== undefined
    }
    if (duplicate) {
      v[namespace + idx + '-land'] = {
        feilmelding: t('validation:duplicateLand'),
        skjemaelementId: namespace + idx + '-land'
      } as ErrorElement
      hasErrors = true
    }
  }
  return hasErrors
}
export const validatePerson = (
  v: Validation,
  t: TFunction,
  {
    person,
    namespace
  }: ValidationPersonProps
): boolean => {
  let hasErrors: boolean = false

  if (_.isEmpty(person?.fornavn?.trim())) {
    v[namespace + '-fornavn'] = {
      feilmelding: t('validation:noFornavnTil'),
      skjemaelementId: namespace + '-fornavn'
    } as ErrorElement
    hasErrors = true
  }

  if (_.isEmpty(person?.etternavn?.trim())) {
    v[namespace + '-etternavn'] = {
      feilmelding: t('validation:noEtternavnTil'),
      skjemaelementId: namespace + '-etternavn'
    } as ErrorElement
    hasErrors = true
  }

  if (_.isEmpty(person?.foedselsdato?.trim())) {
    v[namespace + '-foedselsdato'] = {
      feilmelding: t('validation:noFoedselsdatoTil'),
      skjemaelementId: namespace + '-foedselsdato'
    } as ErrorElement
    hasErrors = true
  }

  if (!person?.foedselsdato?.trim().match(datePattern)) {
    v[namespace + '-foedselsdato'] = {
      feilmelding: t('validation:invalidFoedselsdatoTil'),
      skjemaelementId: namespace + '-foedselsdato'
    } as ErrorElement
    hasErrors = true
  }

  if (_.isEmpty(person?.kjoenn?.trim())) {
    v[namespace + '-kjoenn'] = {
      feilmelding: t('validation:noKjoennTil'),
      skjemaelementId: namespace + '-kjoenn'
    } as ErrorElement
    hasErrors = true
  }

  person.utenlandskePin.forEach((pin: string, index: number) => {
    const els = pin.split(/\s+/)
    const _errors = validateUtenlandskPin(v, t, {
      index,
      land: els[0],
      identifikator: els[1],
      utenlandskePins: person.utenlandskePin ?? [],
      namespace: namespace + '-utenlandskePin'
    })
    hasErrors = hasErrors || _errors
  })

  if (hasErrors) {
    const namespaceBits = namespace.split('-')
    const mainNamespace = namespaceBits[0]
    const personNamespace = mainNamespace + '-' + namespaceBits[1]
    const categoryNamespace = personNamespace + '-' + namespaceBits[2]
    v[mainNamespace] = { feilmelding: 'notnull', skjemaelementId: '' } as ErrorElement
    v[personNamespace] = { feilmelding: 'notnull', skjemaelementId: '' } as ErrorElement
    v[categoryNamespace] = { feilmelding: 'notnull', skjemaelementId: '' } as ErrorElement
  }
  return hasErrors
}
