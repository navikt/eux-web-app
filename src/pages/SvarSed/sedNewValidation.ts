import { Validation } from 'declarations/types'
import { checkIfNotEmpty, checkIfNotTrue } from 'utils/validation'

export interface ValidationSEDNewProps {
  fnr: string
  isFnrValid: boolean
  sektor: string
  buctype: string
  sedtype: string
  landkode: string
  institusjon: string
  tema: string
  saksId: string
  visEnheter: boolean
  unit: string
}

export const validateSEDNew = (
  v: Validation,
  namespace: string,
  {
    fnr,
    isFnrValid,
    sektor,
    buctype,
    sedtype,
    landkode,
    institusjon,
    tema,
    saksId,
    visEnheter,
    unit
  }: ValidationSEDNewProps
): boolean => {
  const hasErrors: Array<boolean> = []

  hasErrors.push(checkIfNotEmpty(v, {
    needle: fnr,
    id: namespace + '-fnr',
    message: 'validation:noFnr'
  }))

  hasErrors.push(checkIfNotTrue(v, {
    needle: isFnrValid,
    id: namespace + '-fnr',
    message: 'validation:uncheckedFnr'
  }))

  hasErrors.push(checkIfNotEmpty(v, {
    needle: sektor,
    id: namespace + '-sektor',
    message: 'validation:noSektor'
  }))

  hasErrors.push(checkIfNotEmpty(v, {
    needle: buctype,
    id: namespace + '-buctype',
    message: 'validation:noBuctype'
  }))

  hasErrors.push(checkIfNotEmpty(v, {
    needle: sedtype,
    id: namespace + '-sedtype',
    message: 'validation:noSedtype'
  }))

  hasErrors.push(checkIfNotEmpty(v, {
    needle: landkode,
    id: namespace + '-landkode',
    message: 'validation:noLand'
  }))

  hasErrors.push(checkIfNotEmpty(v, {
    needle: institusjon,
    id: namespace + '-institusjon',
    message: 'validation:noInstitusjonsID'
  }))

  hasErrors.push(checkIfNotEmpty(v, {
    needle: tema,
    id: namespace + '-tema',
    message: 'validation:noTema'
  }))

  hasErrors.push(checkIfNotEmpty(v, {
    needle: saksId,
    id: namespace + '-saksId',
    message: 'validation:noSaksId'
  }))

  if (visEnheter) {
    hasErrors.push(checkIfNotEmpty(v, {
      needle: unit,
      id: namespace + '-unit',
      message: 'validation:noUnit'
    }))
  }

  return hasErrors.find(value => value) !== undefined
}
