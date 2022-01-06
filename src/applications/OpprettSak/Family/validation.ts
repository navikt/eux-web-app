import { OldFamilieRelasjon, Person, Validation } from 'declarations/types'
import { TFunction } from 'react-i18next'
import { addError, checkIfNotEmpty } from 'utils/validation'

export interface AbroadPersonFormValidationProps {
  relation: OldFamilieRelasjon,
  namespace: string
}

export const validateAbroadPersonForm = (
  v: Validation,
  t: TFunction,
  {
    relation,
    namespace
  }: AbroadPersonFormValidationProps
): boolean => {
  const hasErrors: Array<boolean> = []

  hasErrors.push(checkIfNotEmpty(v, {
    needle: relation.fnr,
    id: namespace + '-fnr',
    message: 'validation:noFnr'
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
    needle: relation.fdato,
    id: namespace + '-fdato',
    message: 'validation:noDate'
  }))

  hasErrors.push(checkIfNotEmpty(v, {
    needle: relation.rolle,
    id: namespace + '-familierelasjon',
    message: 'validation:noRolle'
  }))

  hasErrors.push(checkIfNotEmpty(v, {
    needle: relation.land,
    id: namespace + '-land',
    message: 'validation:noLand'
  }))

  hasErrors.push(checkIfNotEmpty(v, {
    needle: relation.statsborgerskap,
    id: namespace + '-statsborgerskap',
    message: 'validation:noNationality'
  }))

  return hasErrors.find(value => value) !== undefined
}

export interface TPSPersonFormValidationProps {
  fnr: string,
  namespace: string
  tpsperson: OldFamilieRelasjon | undefined
  person: Person
}

export const validateTPSPersonForm = (
  v: Validation,
  t: TFunction,
  {
    person,
    fnr,
    namespace
  }: TPSPersonFormValidationProps
): boolean => {
  const hasErrors: Array<boolean> = []

  hasErrors.push(checkIfNotEmpty(v, {
    needle: fnr,
    id: namespace + '-fnr-dnr',
    message: 'validation:noFnr'
  }))

  if (person.fnr === fnr) {
    hasErrors.push(true)
    addError(v, {
      id: namespace + '-fnr-dnr',
      message: t('message:error-fnr-is-user', { sok: fnr })
    })
  }

  return hasErrors.find(value => value) !== undefined
}
