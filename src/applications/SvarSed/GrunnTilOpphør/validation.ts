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
  
  if (sisteAnsettelseInfo?.typeGrunnOpphoerAnsatt === 'annet') {
    hasErrors.push(checkIfNotEmpty(v, {
      needle: sisteAnsettelseInfo?.annenGrunnOpphoerAnsatt,
      id: namespace + '-annenGrunnOpphoerAnsatt',
      message: 'validation:noAnnenOpphør',
      personName
    }))

    hasErrors.push(checkIfNotEmpty(v, {
      needle: sisteAnsettelseInfo?.grunnOpphoerSelvstendig,
      id: namespace + '-grunnOpphoerSelvstendig',
      message: 'validation:noÅrsak',
      personName
    }))
  }

  return hasErrors.find(value => value) !== undefined
}
