import { GrunnTilOpphør } from 'declarations/sed'
import { Validation } from 'declarations/types'
import { checkIfNotEmpty } from 'utils/validation'

interface ValidateGrunnTilOpphørProps {
  grunntilopphor: GrunnTilOpphør | undefined
}

export const validateGrunnTilOpphor = (
  v: Validation,
  namespace: string,
  {
    grunntilopphor
  }: ValidateGrunnTilOpphørProps
): boolean => {
  const hasErrors: Array<boolean> = []

  hasErrors.push(checkIfNotEmpty(v, {
    needle: grunntilopphor?.typeGrunnOpphoerAnsatt,
    id: namespace + '-typeGrunnOpphoerAnsatt',
    message: 'validation:noType'
  }))

  return hasErrors.find(value => value) !== undefined
}
