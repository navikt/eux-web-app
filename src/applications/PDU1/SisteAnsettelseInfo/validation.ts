import { GrunnTilOpphør } from 'declarations/sed'
import { Validation } from 'declarations/types'
import { TFunction } from 'react-i18next'
import { checkIfNotEmpty, propagateError } from 'utils/validation'

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

  hasErrors.push(checkIfNotEmpty(v, {
    needle: sisteAnsettelseInfo?.typeGrunnOpphoerAnsatt,
    id: namespace + '-typeGrunnOpphoerAnsatt',
    message: 'validation:noType'
  }))

  const hasError: boolean = hasErrors.find(value => value) !== undefined
  if (hasError) propagateError(v, namespace)
  return hasError
}
