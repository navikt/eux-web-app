import { X004Sed } from 'declarations/x004'
import { Validation } from 'declarations/types'
import { checkIfNotEmpty } from 'utils/validation'

export interface ValidationBekreftelseGjenaapningProps {
  replySed: X004Sed
  personName?: string | undefined
}

export const validateBekreftelseGjenaapning = (
  v: Validation,
  namespace: string,
  {
    replySed,
    personName
  }: ValidationBekreftelseGjenaapningProps
): boolean => {
  const hasErrors: Array<boolean> = []

  hasErrors.push(checkIfNotEmpty(v, {
    needle: replySed.gjenaapning?.skalGjenaapnes,
    id: namespace + '-skalGjenaapnes',
    message: 'validation:noSkalGjenaapnes',
    personName
  }))

  return hasErrors.find(value => value) !== undefined
}
