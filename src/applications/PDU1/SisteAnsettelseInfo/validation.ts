import { GrunnTilOpphør } from 'declarations/sed'
import { Validation } from 'declarations/types'
import { TFunction } from 'react-i18next'

interface SisteAnsettelseinfoProps {
  sisteAnsettelseInfo: GrunnTilOpphør | undefined
  namespace: string
}

export const validateSisteAnsettelseinfo = (
  v: Validation,
  t: TFunction,
  {
    sisteAnsettelseInfo,
    namespace
  }: SisteAnsettelseinfoProps
): boolean => {
  const hasErrors: Array<boolean> = []

  console.log(sisteAnsettelseInfo)

  return hasErrors.find(value => value) !== undefined
}
