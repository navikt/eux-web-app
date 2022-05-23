import validator from '@navikt/fnrvalidator'
import { PersonInfo, Pin } from 'declarations/sed'
import { Validation } from 'declarations/types'
import _ from 'lodash'
import { addError, checkIfNotDate, checkIfNotEmpty } from 'utils/validation'

export interface ValidationPersonLightProps {
  personInfo: PersonInfo | undefined
  personName?: string
}

export const validatePersonLight = (
  v: Validation,
  namespace: string,
  {
    personInfo,
    personName
  }: ValidationPersonLightProps
): boolean => {
  const hasErrors: Array<boolean> = []

  hasErrors.push(checkIfNotEmpty(v, {
    needle: personInfo?.fornavn?.trim(),
    id: namespace + '-fornavn',
    message: 'validation:noFornavn',
    personName
  }))

  hasErrors.push(checkIfNotEmpty(v, {
    needle: personInfo?.etternavn?.trim(),
    id: namespace + '-etternavn',
    message: 'validation:noEtternavn',
    personName
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

  hasErrors.push(checkIfNotEmpty(v, {
    needle: personInfo?.kjoenn?.trim(),
    id: namespace + '-kjoenn',
    message: 'validation:noKjoenn',
    personName
  }))

  const norwegianPin: Pin | undefined = _.find(personInfo?.pin, p => p.land === 'NO')

  if (norwegianPin === undefined) {
    hasErrors.push(addError(v, {
      id: namespace + '-norskpin',
      message: 'validation:noId',
      personName
    }))
  }

  if (!_.isEmpty(norwegianPin?.identifikator)) {
    const result = validator.idnr(norwegianPin!.identifikator!)
    if (result.status !== 'valid') {
      hasErrors.push(addError(v, {
        id: namespace + '-norskpin',
        message: 'validation:badId',
        personName
      }))
    }
  }

  return hasErrors.find(value => value) !== undefined
}
