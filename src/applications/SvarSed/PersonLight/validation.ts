import { PersonLight, Pin } from 'declarations/sed'
import { Validation } from 'declarations/types'
import _ from 'lodash'
import {addError, checkIfNotEmpty, checkValidDateFormat} from 'utils/validation'
import {validateFnrDnrNpid} from "../../../utils/fnrValidator";

export interface ValidationPersonLightProps {
  personLight: PersonLight | undefined
  personName?: string
  // when true, person fields are not required (only their format is validated if filled)
  optional?: boolean
}

export const validatePersonLight = (
  v: Validation,
  namespace: string,
  {
    personLight,
    personName,
    optional = false
  }: ValidationPersonLightProps
): boolean => {
  const hasErrors: Array<boolean> = []

  if (!optional) {
    hasErrors.push(checkIfNotEmpty(v, {
      needle: personLight?.fornavn?.trim(),
      id: namespace + '-fornavn',
      message: 'validation:noFornavn'
    }))

    hasErrors.push(checkIfNotEmpty(v, {
      needle: personLight?.etternavn?.trim(),
      id: namespace + '-etternavn',
      message: 'validation:noEtternavn'
    }))

    hasErrors.push(checkIfNotEmpty(v, {
      needle: personLight?.foedselsdato?.trim(),
      id: namespace + '-foedselsdato',
      message: 'validation:noFoedselsdato',
      personName
    }))
  }

  hasErrors.push(checkValidDateFormat(v, {
    needle: personLight?.foedselsdato?.trim(),
    id: namespace + '-foedselsdato',
    message: 'validation:invalidDateFormat',
    personName
  }))

  if (!optional) {
    hasErrors.push(checkIfNotEmpty(v, {
      needle: personLight?.kjoenn?.trim(),
      id: namespace + '-kjoenn',
      message: 'validation:noKjoenn',
      personName
    }))
  }

  const norwegianPin: Pin | undefined = _.find(personLight?.pin, p => p.landkode === 'NOR')

  if (!_.isEmpty(norwegianPin?.identifikator)) {
    const result = validateFnrDnrNpid(norwegianPin!.identifikator!)
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
