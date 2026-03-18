import { ReplySed } from 'declarations/sed'
import { Validation } from 'declarations/types'
import { H120Sed } from 'declarations/h120'
import { checkLength } from 'utils/validation'

export interface ValidationAWODSpoersmaalProps {
  replySed: ReplySed
  personName?: string
}

export const validateAWODSpoersmaal = (
  v: Validation,
  namespace: string,
  {
    replySed,
    personName
  }: ValidationAWODSpoersmaalProps
): boolean => {
  const hasErrors: Array<boolean> = []
  const sed = replySed as H120Sed

  hasErrors.push(checkLength(v, {
    needle: sed.arbeidsulykkeyrkessykdom?.brukerStatusAnnet,
    max: 500,
    id: namespace + '-brukerStatusAnnet',
    message: 'validation:textOverX',
    personName
  }))

  return hasErrors.find(value => value) !== undefined
}
