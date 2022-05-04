import { GrunnTilOpphør } from 'declarations/sed'
import { Validation } from 'declarations/types'

interface SisteAnsettelseinfoProps {
  sisteAnsettelseInfo: GrunnTilOpphør | undefined
}

export const validateSisteAnsettelseinfo = (
  v: Validation,
  namespace: string,
  {
    sisteAnsettelseInfo
  }: SisteAnsettelseinfoProps
): boolean => {
  const hasErrors: Array<boolean> = []

  console.log(sisteAnsettelseInfo)

  return hasErrors.find(value => value) !== undefined
}
