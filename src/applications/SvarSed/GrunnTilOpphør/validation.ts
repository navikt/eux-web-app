import { GrunnTilOpphør } from 'declarations/sed'
import { Validation } from 'declarations/types'
import { checkIfNotEmpty } from 'utils/validation'

export interface ValidateGrunnTilOpphørProps {
  grunntilopphor: GrunnTilOpphør | undefined
  personName ?: string
}

export const validateGrunnTilOpphor = (
  v: Validation,
  namespace: string,
  {
    grunntilopphor,
    personName
  }: ValidateGrunnTilOpphørProps
): boolean => {
  const hasErrors: Array<boolean> = []

  hasErrors.push(checkIfNotEmpty(v, {
    needle: grunntilopphor?.typeGrunnOpphoerAnsatt,
    id: namespace + '-typeGrunnOpphoerAnsatt',
    message: 'validation:noType',
    personName
  }))

  return hasErrors.find(value => value) !== undefined
}
