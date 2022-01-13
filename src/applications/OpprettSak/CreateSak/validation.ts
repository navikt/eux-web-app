import { Validation } from 'declarations/types'
import { TFunction } from 'react-i18next'
import { checkIfNotEmpty, checkIfNotTrue } from 'utils/validation'

export interface ValidationOpprettSakProps {
  fnr: string
  isFnrValid: boolean
  sektor: string
  buctype: string
  sedtype: string
  landkode: string
  institusjon: string
  namespace: string
  tema: string
  saksId: string
  visEnheter: boolean
  unit: string
}

export const validateOpprettSak = (
  v: Validation,
  t: TFunction,
  {
    fnr,
    isFnrValid,
    sektor,
    buctype,
    sedtype,
    landkode,
    institusjon,
    namespace,
    tema,
    saksId,
    visEnheter,
    unit
  }: ValidationOpprettSakProps
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
