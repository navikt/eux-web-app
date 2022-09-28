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
  const klargjoerInfoItem = (replySed as X012Sed).klargjoerInfo && (replySed as X012Sed).klargjoerInfo[0];

  hasErrors.push(checkIfNotEmpty(v, {
    needle: klargjoerInfoItem?.del,
    id: namespace + '-del',
    message: 'validation:noDel',
    personName
  }))

  hasErrors.push(checkIfNotEmpty(v, {
    needle: klargjoerInfoItem?.punkt,
    id: namespace + '-punkt',
    message: 'validation:noPunkt',
    personName
  }))

  hasErrors.push(checkIfNotEmpty(v, {
    needle: klargjoerInfoItem?.begrunnelseType,
    id: namespace + '-grunn',
    message: 'validation:noGrunn',
    personName
  }))

  if (klargjoerInfoItem?.begrunnelseType === 'annet') {
    hasErrors.push(checkIfNotEmpty(v, {
      needle: klargjoerInfoItem?.begrunnelseAnnen,
      id: namespace + '-grunnAnnet',
      message: 'validation:noGrunnAnnet',
      personName
    }))
  }

  return hasErrors.find(value => value) !== undefined
}
