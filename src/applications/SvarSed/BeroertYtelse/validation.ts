import { ReplySed } from 'declarations/sed'
import { Validation } from 'declarations/types'
import { H120Sed } from 'declarations/h120'
import { checkIfNotEmpty } from 'utils/validation'

export interface ValidationBeroertYtelseProps {
  replySed: ReplySed
  personName?: string
}

export const validateBeroertYtelse = (
  v: Validation,
  namespace: string,
  {
    replySed,
    personName
  }: ValidationBeroertYtelseProps
): boolean => {
  const hasErrors: Array<boolean> = []
  const sed = replySed as H120Sed

  hasErrors.push(checkIfNotEmpty(v, {
    needle: sed.beroertYtelse,
    id: namespace + '-beroertYtelse',
    message: 'validation:noBeroertYtelse',
    personName
  }))

  return hasErrors.find(value => value) !== undefined
}
