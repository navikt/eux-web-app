import { Pin } from 'declarations/sed'
import { Validation } from 'declarations/types'
import { getIdx } from 'utils/namespace'
import { checkIfDuplicate, checkIfNotEmpty, checkIfNotGB, checkIfValidLand } from 'utils/validation'

export interface ValidationUtenlandskPinProps {
  pin: Pin | null | undefined
  utenlandskePins: Array<Pin> | undefined
  index ?: number
  personName?: string
}

export interface ValidationUtenlandskPinsProps {
  utenlandskePins: Array<Pin> | undefined
  personName ?: string
}

export const validateUtenlandskPin = (
  v: Validation,
  namespace: string,
  {
    pin,
    utenlandskePins,
    index,
    personName
  }: ValidationUtenlandskPinProps
): boolean => {
  const hasErrors: Array<boolean> = []
  const idx = getIdx(index)

  hasErrors.push(checkIfNotEmpty(v, {
    needle: pin?.identifikator,
    id: namespace + idx + '-identifikator',
    message: 'validation:noId',
    personName
  }))

  hasErrors.push(checkIfNotEmpty(v, {
    needle: pin?.land,
    id: namespace + idx + '-land',
    message: 'validation:noLand',
    personName
  }))

  hasErrors.push(checkIfValidLand(v, {
    needle: pin?.land,
    id: namespace + idx + '-land',
    message: 'validation:invalidLand'
  }))

  hasErrors.push(checkIfNotGB(v, {
    needle: pin?.land,
    id: namespace + idx + '-land',
    message: 'validation:invalidLand',
    personName
  }))

  hasErrors.push(checkIfDuplicate(v, {
    needle: pin?.land,
    haystack: utenlandskePins,
    matchFn: (_pin: Pin) => _pin.land === pin?.land,
    index,
    id: namespace + idx + '-land',
    message: 'validation:duplicateLand',
    personName
  }))

  return hasErrors.find(value => value) !== undefined
}

export const validateUtenlandskPins = (
  v: Validation,
  namespace: string,
  {
    utenlandskePins,
    personName
  }: ValidationUtenlandskPinsProps
): boolean => {
  const hasErrors: Array<boolean> = utenlandskePins?.map((pin: Pin, index: number) => {
    return validateUtenlandskPin(v, namespace, {
      index,
      pin,
      utenlandskePins,
      personName
    })
  }) ?? []
  return hasErrors.find(value => value) !== undefined
}
