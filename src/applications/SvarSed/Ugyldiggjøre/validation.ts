import { X008Sed } from 'declarations/sed'
import { Validation } from 'declarations/types'
import { checkIfNotEmpty } from 'utils/validation'

export interface ValidationUgyldiggjøreProps {
  replySed: X008Sed
  personName ?: string | undefined
}

export const validateUgyldiggjøre = (
  v: Validation,
  namespace: string,
  {
    replySed,
    personName
  }: ValidationUgyldiggjøreProps
): boolean => {
  const hasErrors: Array<boolean> = []

  hasErrors.push(checkIfNotEmpty(v, {
    needle: replySed.begrunnelse,
    id: namespace + '-begrunnelse',
    message: 'validation:noBegrunnelse',
    personName
  }))

  if (replySed.begrunnelse === '99') {
    hasErrors.push(checkIfNotEmpty(v, {
      needle: replySed.begrunnelseAnnen,
      id: namespace + '-begrunnelseAnnen',
      message: 'validation:noBegrunnelseAnnen',
      personName
    }))
  }

  return hasErrors.find(value => value) !== undefined
}
