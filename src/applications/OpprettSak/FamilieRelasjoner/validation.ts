import {PersonInfoUtland, Validation} from 'declarations/types'
import {checkIfNotEmpty, checkValidDateFormat} from 'utils/validation'
import _ from "lodash";

export interface RelasjonUtlandValidationProps {
  relation: PersonInfoUtland,
  namespace: string
}

export const validateRelasjonUtland = (
  v: Validation,
  namespace: string,
  {
    relation
  }: RelasjonUtlandValidationProps
): boolean => {
  const hasErrors: Array<boolean> = []

  hasErrors.push(checkIfNotEmpty(v, {
    needle: relation.pin,
    id: namespace + '-pin',
    message: 'validation:noPin'
  }))

  hasErrors.push(checkIfNotEmpty(v, {
    needle: relation.fornavn,
    id: namespace + '-fornavn',
    message: 'validation:noFirstName'
  }))

  hasErrors.push(checkIfNotEmpty(v, {
    needle: relation.etternavn,
    id: namespace + '-etternavn',
    message: 'validation:noLastName'
  }))

  hasErrors.push(checkIfNotEmpty(v, {
    needle: relation.kjoenn,
    id: namespace + '-kjoenn',
    message: 'validation:noGender'
  }))

  hasErrors.push(checkIfNotEmpty(v, {
    needle: relation.foedselsdato,
    id: namespace + '-foedselsdato',
    message: 'validation:noDate'
  }))

  if (!_.isEmpty(relation.foedselsdato?.trim())) {
    hasErrors.push(checkValidDateFormat(v, {
      needle: relation.foedselsdato,
      message: 'validation:invalidDateFormat',
      id: namespace + '-foedselsdato'
    }))
  }

  hasErrors.push(checkIfNotEmpty(v, {
    needle: relation.__rolle,
    id: namespace + '-familierelasjon',
    message: 'validation:noRolle'
  }))

  hasErrors.push(checkIfNotEmpty(v, {
    needle: relation.pinLandkode,
    id: namespace + '-pinLandkode',
    message: 'validation:noLand'
  }))

  return hasErrors.find(value => value) !== undefined
}
