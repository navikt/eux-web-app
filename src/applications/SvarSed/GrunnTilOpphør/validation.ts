import { SisteAnsettelseInfo } from 'declarations/sed'
import { Validation } from 'declarations/types'
import { checkIfNotEmpty } from 'utils/validation'

export interface ValidateGrunnTilOpphørProps {
  sisteAnsettelseInfo: SisteAnsettelseInfo | undefined
  personName ?: string
  doValidate?: boolean
}

export const validateGrunnTilOpphor = (
  v: Validation,
  namespace: string,
  {
    sisteAnsettelseInfo,
    doValidate
  }: ValidateGrunnTilOpphørProps
): boolean => {
  const hasErrors: Array<boolean> = []

  if(doValidate){
    hasErrors.push(checkIfNotEmpty(v, {
      needle: sisteAnsettelseInfo?.typeGrunnOpphoerAnsatt,
      id: namespace + '-typeGrunnOpphoerAnsatt',
      message: 'validation:noGrunnOpphorType'
    }))
  }

  if (sisteAnsettelseInfo?.typeGrunnOpphoerAnsatt === 'annet') {
    hasErrors.push(checkIfNotEmpty(v, {
      needle: sisteAnsettelseInfo?.annenGrunnOpphoerAnsatt,
      id: namespace + '-annenGrunnOpphoerAnsatt',
      message: 'validation:noAnnenOpphør'
    }))

    hasErrors.push(checkIfNotEmpty(v, {
      needle: sisteAnsettelseInfo?.grunnOpphoerSelvstendig,
      id: namespace + '-grunnOpphoerSelvstendig',
      message: 'validation:noÅrsak'
    }))
  }

  return hasErrors.find(value => value) !== undefined
}
