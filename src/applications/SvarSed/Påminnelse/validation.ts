import { Purring } from 'declarations/sed'
import { Validation } from 'declarations/types'
import { getIdx } from 'utils/namespace'
import { checkIfDuplicate, checkIfNotEmpty, checkLength } from 'utils/validation'

export interface ValidationPurringProps {
  purring: Purring | undefined
  purringer: Array<Purring> | undefined
  index?: number
  personName?: string
}

export interface ValidationPurringerProps {
  purringer: Array<Purring> | undefined
  personName?: string
}

export const validatePurring = (
  v: Validation,
  namespace: string,
  {
    purring,
    purringer,
    index,
    personName
  }: ValidationPurringProps
): boolean => {
  const hasErrors: Array<boolean> = []
  const idx = getIdx(index)

  hasErrors.push(checkIfNotEmpty(v, {
    needle: purring?.gjelder,
    id: namespace + idx + '-gjelder',
    message: 'validation:noType',
    personName
  }))

  hasErrors.push(checkIfNotEmpty(v, {
    needle: purring?.beskrivelse,
    id: namespace + idx + '-beskrivelse',
    message: 'validation:noInfo',
    personName
  }))

  hasErrors.push(checkLength(v, {
    needle: purring?.beskrivelse,
    max: 65,
    id: namespace + idx + '-beskrivelse',
    message: 'validation:textOverX',
    personName
  }))

  hasErrors.push(checkIfDuplicate(v, {
    needle: purring,
    haystack: purringer,
    matchFn: (p: Purring) => p.gjelder === purring?.gjelder,
    id: namespace + idx + '-gjelder',
    index,
    message: 'validation:duplicateType',
    personName
  }))

  return hasErrors.find(value => value) !== undefined
}

export const validatePurringer = (
  v: Validation,
  namespace: string,
  {
    purringer,
    personName
  }: ValidationPurringerProps
): boolean => {
  const hasErrors: Array<boolean> = []

  hasErrors.push(checkIfNotEmpty(v, {
    needle: purringer,
    id: namespace + '-purringer',
    message: 'validation:noPurring',
    personName
  }))

  purringer?.forEach((purring: Purring, index: number) => {
    hasErrors.push(validatePurring(v, namespace, { purring, purringer, index, personName }))
  })
  return hasErrors.find(value => value) !== undefined
}
