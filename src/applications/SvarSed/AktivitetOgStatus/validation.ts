import { Aktivitet, H005Sed } from 'declarations/h005'
import { ReplySed } from 'declarations/sed'
import { Validation } from 'declarations/types'
import { getIdx } from 'utils/namespace'
import { checkIfNotEmpty, checkLength } from 'utils/validation'

export interface ValidationAktivitetItemProps {
  aktivitet: Aktivitet | undefined
  index?: number
  personName?: string
}

export interface ValidationAktivitetOgStatusProps {
  replySed: ReplySed
  personName?: string
}

export const validateAktivitetItem = (
  v: Validation,
  namespace: string,
  {
    aktivitet,
    index,
    personName
  }: ValidationAktivitetItemProps
): boolean => {
  const hasErrors: Array<boolean> = []
  const idx = getIdx(index)

  hasErrors.push(checkLength(v, {
    needle: aktivitet?.beskrivelse,
    id: namespace + idx + '-beskrivelse',
    max: 155,
    message: 'validation:textOverX',
    personName
  }))

  hasErrors.push(checkLength(v, {
    needle: aktivitet?.sted,
    id: namespace + idx + '-sted',
    max: 65,
    message: 'validation:textOverX',
    personName
  }))

  hasErrors.push(checkLength(v, {
    needle: aktivitet?.varighet,
    id: namespace + idx + '-varighet',
    max: 65,
    message: 'validation:textOverX',
    personName
  }))

  hasErrors.push(checkLength(v, {
    needle: aktivitet?.art,
    id: namespace + idx + '-art',
    max: 255,
    message: 'validation:textOverX',
    personName
  }))

  return hasErrors.find(value => value) !== undefined
}

export const validateAktivitetOgStatus = (
  v: Validation,
  namespace: string,
  {
    replySed,
    personName
  }: ValidationAktivitetOgStatusProps
): boolean => {
  const hasErrors: Array<boolean> = []
  const sed = replySed as H005Sed
  const info = sed.informasjonFastslaaBosted

  if (info?.personensStatus === 'annet') {
    hasErrors.push(checkIfNotEmpty(v, {
      needle: info?.personensStatusAnnet,
      id: namespace + '-personensStatusAnnet',
      message: 'validation:noPersonensStatusAnnet',
      personName
    }))

    hasErrors.push(checkLength(v, {
      needle: info?.personensStatusAnnet,
      id: namespace + '-personensStatusAnnet',
      max: 500,
      message: 'validation:textOverX',
      personName
    }))
  }

  info?.aktiviteter?.forEach((aktivitet: Aktivitet, index: number) => {
    hasErrors.push(validateAktivitetItem(v, namespace, {
      aktivitet,
      index,
      personName
    }))
  })

  return hasErrors.find(value => value) !== undefined
}
