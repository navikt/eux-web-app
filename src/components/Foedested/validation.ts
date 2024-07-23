import {Foedested} from 'declarations/sed'
import { Validation } from 'declarations/types'
import { checkIfNotEmpty, checkIfValidLand } from 'utils/validation'

export interface ValidationFoedestedProps {
  foedested: Foedested | null | undefined,
  personName?: string
}

export const validateFoedested = (
  v: Validation,
  namespace: string,
  {
    foedested,
    personName
  }: ValidationFoedestedProps
): boolean => {
  const hasErrors: Array<boolean> = []

  hasErrors.push(checkIfNotEmpty(v, {
    needle: foedested?.land,
    id: namespace + '-land',
    message: 'validation:noLand',
    personName
  }))

  hasErrors.push(checkIfValidLand(v, {
    needle: foedested?.land,
    id: namespace + '-land',
    message: 'validation:invalidLand'
  }))

  return hasErrors.find(value => value) !== undefined
}
