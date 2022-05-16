import { GrunnTilOpphør } from 'declarations/sed'
import { Validation } from 'declarations/types'

export interface ValidationSisteAnsettelseinfoProps {
  sisteAnsettelseInfo: GrunnTilOpphør | undefined
}

export const validateSisteAnsettelseinfo = (
  v: Validation,
  namespace: string,
  {
    sisteAnsettelseInfo
  }: ValidationSisteAnsettelseinfoProps
): boolean => {
  const hasErrors: Array<boolean> = []

  console.log(sisteAnsettelseInfo)

  return hasErrors.find(value => value) !== undefined
}
