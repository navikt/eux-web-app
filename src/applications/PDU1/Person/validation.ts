import { ErrorElement } from 'declarations/app'
import { PersonInfo, Pin } from 'declarations/sed'
import { Validation } from 'declarations/types'
import _ from 'lodash'
import { TFunction } from 'react-i18next'
import { getIdx } from 'utils/namespace'

export interface ValidationPersonOpplysningProps {
  personInfo: PersonInfo,
  namespace: string,
  personName: string
}

export interface ValidationPinProps {
  pin: Pin,
  pins: Array<Pin>,
  index ?: number
  namespace: string
  personName: string
}

const datePattern = /^\d{4}-\d{2}-\d{2}$/

export const validatePin = (
  v: Validation,
  t: TFunction,
  {
    pin,
    pins,
    index,
    namespace,
    personName
  }: ValidationPinProps
): boolean => {
  let hasErrors: boolean = false
  const idx = getIdx(index)

  if (_.isEmpty(pin.identifikator?.trim())) {
    v[namespace + idx + '-identifikator'] = {
      feilmelding: t('validation:noIdTil', { person: personName }),
      skjemaelementId: namespace + idx + '-identifikator'
    } as ErrorElement
    hasErrors = true
  }

  if (_.isEmpty(pin.land?.trim())) {
    v[namespace + idx + '-land'] = {
      feilmelding: t('validation:noLandTil', { person: personName }),
      skjemaelementId: namespace + idx + '-land'
    } as ErrorElement
    hasErrors = true
  }

  let duplicate: boolean

  if (!_.isEmpty(pin.land)) {
    if (_.isNil(index)) {
      duplicate = _.find(pins, { land: pin.land }) !== undefined
    } else {
      const otherPins: Array<Pin> = _.filter(pins, (p, i) => i !== index)
      duplicate = _.find(otherPins, { land: pin.land }) !== undefined
    }
    if (duplicate) {
      v[namespace + idx + '-land'] = {
        feilmelding: t('validation:duplicateLandTil', { person: personName }),
        skjemaelementId: namespace + idx + '-land'
      } as ErrorElement
      hasErrors = true
    }
  }
  return hasErrors
}
export const validatePersonOpplysninger = (
  v: Validation,
  t: TFunction,
  {
    personInfo,
    namespace,
    personName
  }: ValidationPersonOpplysningProps
): boolean => {
  let hasErrors: boolean = false

  if (_.isEmpty(personInfo?.fornavn?.trim())) {
    v[namespace + '-fornavn'] = {
      feilmelding: t('validation:noFornavnTil', { person: personName }),
      skjemaelementId: namespace + '-fornavn'
    } as ErrorElement
    hasErrors = true
  }

  if (_.isEmpty(personInfo?.etternavn?.trim())) {
    v[namespace + '-etternavn'] = {
      feilmelding: t('validation:noEtternavnTil', { person: personName }),
      skjemaelementId: namespace + '-etternavn'
    } as ErrorElement
    hasErrors = true
  }

  if (_.isEmpty(personInfo?.foedselsdato?.trim())) {
    v[namespace + '-foedselsdato'] = {
      feilmelding: t('validation:noFoedselsdatoTil', { person: personName }),
      skjemaelementId: namespace + '-foedselsdato'
    } as ErrorElement
    hasErrors = true
  }

  if (!personInfo?.foedselsdato?.trim().match(datePattern)) {
    v[namespace + '-foedselsdato'] = {
      feilmelding: t('validation:invalidFoedselsdatoTil', { person: personName }),
      skjemaelementId: namespace + '-foedselsdato'
    } as ErrorElement
    hasErrors = true
  }

  if (_.isEmpty(personInfo?.kjoenn?.trim())) {
    v[namespace + '-kjoenn'] = {
      feilmelding: t('validation:noKjoennTil', { person: personName }),
      skjemaelementId: namespace + '-kjoenn'
    } as ErrorElement
    hasErrors = true
  }

  personInfo.pin?.forEach((pin: Pin, index: number) => {
    const _errors = validatePin(v, t, {
      index,
      pin: pin,
      pins: personInfo.pin ?? [],
      namespace: namespace + '-pin',
      personName
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