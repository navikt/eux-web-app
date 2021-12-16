import { Validation } from 'declarations/types'
import { TFunction } from 'react-i18next'
import { getIdx } from 'utils/namespace'
import { checkIfDuplicate, checkIfNotEmpty, checkIfNotGB, checkIfValidLand } from 'utils/validation'

export interface ValidationUtenlandskPinProps {
  land: string,
  identifikator: string
  utenlandskePins: Array<string> | undefined
  index ?: number
  namespace: string
}

export interface ValidationUtenlandskPinsProps {
  utenlandskePins: Array<string> | undefined
  namespace: string
}

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
  const hasErrors: Array<boolean> = []
  const idx = getIdx(index)

  hasErrors.push(checkIfNotEmpty(v, {
    needle: identifikator,
    id: namespace + idx + '-identifikator',
    message: 'validation:noId'
  }))

  hasErrors.push(checkIfNotEmpty(v, {
    needle: land,
    id: namespace + idx + '-land',
    message: 'validation:noLand'
  }))

  if (land?.length > 0) {
    hasErrors.push(checkIfValidLand(v, {
      needle: land,
      id: namespace + idx + '-land',
      message: 'validation:invalidLand'
    }))
    hasErrors.push(checkIfNotGB(v, {
      needle: land,
      id: namespace + idx + '-land',
      message: 'validation:invalidLand'
    }))
  }

  hasErrors.push(checkIfDuplicate(v, {
    needle: land,
    haystack: utenlandskePins,
    matchFn: (pin: string) => pin.split(' ')[0] === land,
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
  const hasErrors: Array<boolean> = utenlandskePins?.map((pin: string, index: number) => {
    const els = pin.split(/\s+/)
    return validateUtenlandskPin(v, t, {
      index,
      land: els[0],
      identifikator: els[1],
      utenlandskePins: utenlandskePins,
      namespace: namespace
    })
  }) ?? []
  return hasErrors.find(value => value) !== undefined
}
