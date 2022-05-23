import { SisteAnsettelseInfo } from 'declarations/sed'
import { Validation } from 'declarations/types'
import { checkIfNotEmpty } from 'utils/validation'

export interface ValidateGrunnTilOpphørProps {
  sisteAnsettelseInfo: SisteAnsettelseInfo | undefined
  personName ?: string
}

export const validateGrunnTilOpphor = (
  v: Validation,
  namespace: string,
  {
    sisteAnsettelseInfo,
    personName
  }: ValidateGrunnTilOpphørProps
): boolean => {
  const hasErrors: Array<boolean> = []

  hasErrors.push(checkIfNotEmpty(v, {
    needle: sisteAnsettelseInfo?.typeGrunnOpphoerAnsatt,
    id: namespace + '-typeGrunnOpphoerAnsatt',
    message: 'validation:noType',
    personName
  }))

  return hasErrors.find(value => value) !== undefined
}
