import {Foedested} from 'declarations/sed'
import { Validation } from 'declarations/types'
import {checkIfNotEmpty, checkLength} from 'utils/validation'
import _ from "lodash";

export interface ValidationFoedestedProps {
  foedested: Foedested | null | undefined,
  personName?: string
}

export const validateFoedested = (
  v: Validation,
  namespace: string,
  {
    foedested,
    personName
  }: ValidationFoedestedProps
): boolean => {
  const hasErrors: Array<boolean> = []

  if(!_.isEmpty(foedested)){
    hasErrors.push(checkIfNotEmpty(v, {
      needle: foedested?.landkode,
      id: namespace + '-land',
      message: 'validation:noLand',
      personName
    }))

    hasErrors.push(checkLength(v, {
      needle: foedested?.by,
      id: namespace + '-by',
      max: 65,
      message: 'validation:textOverX'
    }))

    hasErrors.push(checkLength(v, {
      needle: foedested?.region,
      id: namespace + '-region',
      max: 65,
      message: 'validation:textOverX'
    }))

  }

  return hasErrors.find(value => value) !== undefined
}
