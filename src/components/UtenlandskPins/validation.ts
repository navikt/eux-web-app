import { Pin } from 'declarations/sed'
import { Validation } from 'declarations/types'
import _ from 'lodash'
import { TFunction } from 'react-i18next'
import { getIdx } from 'utils/namespace'
import { checkIfDuplicate, checkIfNotEmpty, checkIfNotGB, checkIfValidLand } from 'utils/validation'

export interface ValidationUtenlandskPinProps {
  pin: Pin
  utenlandskePins: Array<Pin> | undefined
  index ?: number
  namespace: string
}

export interface ValidationUtenlandskPinsProps {
  utenlandskePins: Array<Pin> | undefined
  namespace: string
}

export const validateUtenlandskPin = (
  v: Validation,
  t: TFunction,
  {
    pin,
    utenlandskePins,
    index,
    namespace
  }: ValidationUtenlandskPinProps
): boolean => {
  const hasErrors: Array<boolean> = []
  const idx = getIdx(index)

  hasErrors.push(checkIfNotEmpty(v, {
    needle: pin.identifikator,
    id: namespace + idx + '-identifikator',
    message: 'validation:noId'
  }))

  hasErrors.push(checkIfNotEmpty(v, {
    needle: pin.land,
    id: namespace + idx + '-land',
    message: 'validation:noLand'
  }))

  if (!_.isEmpty(pin?.land)) {
    hasErrors.push(checkIfValidLand(v, {
      needle: pin.land,
      id: namespace + idx + '-land',
      message: 'validation:invalidLand'
    }))
    hasErrors.push(checkIfNotGB(v, {
      needle: pin.land,
      id: namespace + idx + '-land',
      message: 'validation:invalidLand'
    }))
  }

  hasErrors.push(checkIfDuplicate(v, {
    needle: pin.land,
    haystack: utenlandskePins,
    matchFn: (_pin: Pin) => _pin.land === pin.land,
    index,
    id: namespace + idx + '-land',
    message: 'validation:duplicateLand'
  }))

  return hasErrors.find(value => value) !== undefined
}

export const validateUtenlandskPins = (
  v: Validation,
  t: TFunction,
  {
    namespace,
    utenlandskePins
  }: ValidationUtenlandskPinsProps
): boolean => {
  const hasErrors: Array<boolean> = utenlandskePins?.map((pin: Pin, index: number) => {
    return validateUtenlandskPin(v, t, {
      index,
      pin,
      utenlandskePins: utenlandskePins,
      namespace: namespace
    })
  }) ?? []
  return hasErrors.find(value => value) !== undefined
}
