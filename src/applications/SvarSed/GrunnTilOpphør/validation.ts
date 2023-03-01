import { SisteAnsettelseInfo } from 'declarations/sed'
import { Validation } from 'declarations/types'
import {checkIfNotEmpty, checkLength} from 'utils/validation'
import _ from "lodash";

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
    if(_.isEmpty(sisteAnsettelseInfo?.grunnOpphoerSelvstendig)){
      hasErrors.push(checkIfNotEmpty(v, {
        needle: sisteAnsettelseInfo?.annenGrunnOpphoerAnsatt,
        id: namespace + '-annenGrunnOpphoerAnsatt',
        message: 'validation:noAnnenOpphør'
      }))
    }

    if(_.isEmpty(sisteAnsettelseInfo?.annenGrunnOpphoerAnsatt)){
      hasErrors.push(checkIfNotEmpty(v, {
        needle: sisteAnsettelseInfo?.grunnOpphoerSelvstendig,
        id: namespace + '-grunnOpphoerSelvstendig',
        message: 'validation:noÅrsak'
      }))
    }

    hasErrors.push(checkLength(v, {
      needle: sisteAnsettelseInfo?.annenGrunnOpphoerAnsatt,
      max: 65,
      id: namespace + '-annenGrunnOpphoerAnsatt',
      message: 'validation:textOverX'
    }))

    hasErrors.push(checkLength(v, {
      needle: sisteAnsettelseInfo?.grunnOpphoerSelvstendig,
      max: 65,
      id: namespace + '-grunnOpphoerSelvstendig',
      message: 'validation:textOverX'
    }))

  }

  return hasErrors.find(value => value) !== undefined
}
