import {PersonInfo} from 'declarations/sed'
import { Validation } from 'declarations/types'
import {checkIfNotDate, checkIfNotEmpty, checkLength, checkValidDateFormat} from 'utils/validation'

export interface ValidationPersonBasicProps {
  personInfo: PersonInfo | undefined
  personName?: string
}

export const validatePersonBasic = (
  v: Validation,
  namespace: string,
  {
    personInfo,
    personName
  }: ValidationPersonBasicProps
): boolean => {
  const hasErrors: Array<boolean> = []

  hasErrors.push(checkIfNotEmpty(v, {
    needle: personInfo?.fornavn?.trim(),
    id: namespace + '-fornavn',
    message: 'validation:noFornavn'
  }))

  hasErrors.push(checkIfNotEmpty(v, {
    needle: personInfo?.etternavn?.trim(),
    id: namespace + '-etternavn',
    message: 'validation:noEtternavn'
  }))

  hasErrors.push(checkLength(v, {
    needle: personInfo?.fornavn?.trim(),
    id: namespace + '-fornavn',
    max: 155,
    message: 'validation:textOverX'
  }))

  hasErrors.push(checkLength(v, {
    needle: personInfo?.etternavn?.trim(),
    id: namespace + '-etternavn',
    max: 155,
    message: 'validation:textOverX'
  }))

  hasErrors.push(checkIfNotEmpty(v, {
    needle: personInfo?.foedselsdato?.trim(),
    id: namespace + '-foedselsdato',
    message: 'validation:noFoedselsdato',
    personName
  }))

  hasErrors.push(checkIfNotDate(v, {
    needle: personInfo?.foedselsdato?.trim(),
    id: namespace + '-foedselsdato',
    message: 'validation:invalidFoedselsdato',
    personName
  }))

  hasErrors.push(checkValidDateFormat(v, {
    needle: personInfo?.foedselsdato?.trim(),
    id: namespace + '-foedselsdato',
    message: 'validation:invalidDateFormat',
    personName
  }))

  return hasErrors.find(value => value) !== undefined
}
