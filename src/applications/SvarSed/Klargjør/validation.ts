import { X012Sed } from 'declarations/sed'
import { Validation } from 'declarations/types'
import { checkIfNotEmpty } from 'utils/validation'

export interface ValidationKlargjørProps {
  replySed: X012Sed
  personName ?: string | undefined
}

export const validateKlargjør = (
  v: Validation,
  namespace: string,
  {
    replySed,
    personName
  }: ValidationKlargjørProps
): boolean => {
  const hasErrors: Array<boolean> = []

  hasErrors.push(checkIfNotEmpty(v, {
    needle: (replySed as X012Sed).del,
    id: namespace + '-del',
    message: 'validation:noDel',
    personName
  }))

  hasErrors.push(checkIfNotEmpty(v, {
    needle: replySed.punkt,
    id: namespace + '-punkt',
    message: 'validation:noPunkt',
    personName
  }))

  hasErrors.push(checkIfNotEmpty(v, {
    needle: replySed.grunn,
    id: namespace + '-grunn',
    message: 'validation:noGrunn',
    personName
  }))

  if (replySed.grunn === '99') {
    hasErrors.push(checkIfNotEmpty(v, {
      needle: replySed.grunnAnnet,
      id: namespace + '-grunnAnnet',
      message: 'validation:noGrunnAnnet',
      personName
    }))
  }

  return hasErrors.find(value => value) !== undefined
}
