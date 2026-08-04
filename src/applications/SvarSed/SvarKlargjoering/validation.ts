import { Klargjoering, KanIkkeKlargjoere, X013Sed } from 'declarations/x013'
import { Validation } from 'declarations/types'
import { checkIfNotEmpty, checkLength } from 'utils/validation'

export interface ValidationSvarKlargjoeringProps {
  replySed: X013Sed
  personName?: string | undefined
}

const rowKey = (namespace: string, status: 'klargjor' | 'kanikke', index: number): string =>
  `${namespace}-${status}-${index}`

export const validateSvarKlargjoering = (
  v: Validation,
  namespace: string,
  {
    replySed,
    personName
  }: ValidationSvarKlargjoeringProps
): boolean => {
  const hasErrors: Array<boolean> = []

  const klargjoeringer: Array<Klargjoering> = replySed.klargjoeringer ?? []
  const kanIkkeKlargjoere: Array<KanIkkeKlargjoere> = replySed.kanIkkeKlargjoere ?? []

  klargjoeringer.forEach((k: Klargjoering, index: number) => {
    const key = rowKey(namespace, 'klargjor', index)

    hasErrors.push(checkIfNotEmpty(v, {
      needle: k.klargjoering,
      id: key + '-klargjoering',
      message: 'validation:noKlargjoering',
      personName
    }))

    hasErrors.push(checkLength(v, {
      needle: k.klargjoering,
      max: 16500,
      id: key + '-klargjoering',
      message: 'validation:textOverX',
      personName
    }))
  })

  kanIkkeKlargjoere.forEach((k: KanIkkeKlargjoere, index: number) => {
    const key = rowKey(namespace, 'kanikke', index)

    hasErrors.push(checkIfNotEmpty(v, {
      needle: k.grunnType,
      id: key + '-grunnType',
      message: 'validation:noGrunnType',
      personName
    }))

    if (k.grunnType === 'annet') {
      hasErrors.push(checkIfNotEmpty(v, {
        needle: k.grunnAnnet,
        id: key + '-grunnAnnet',
        message: 'validation:noGrunnAnnet',
        personName
      }))

      hasErrors.push(checkLength(v, {
        needle: k.grunnAnnet,
        max: 255,
        id: key + '-grunnAnnet',
        message: 'validation:textOverX',
        personName
      }))
    }
  })

  return hasErrors.find(value => value) !== undefined
}
