import { validateUtenlandskPin } from 'components/UtenlandskPins/validation'
import { PersonInfo, Pin } from 'declarations/sed'
import { Validation } from 'declarations/types'
import _ from 'lodash'
import { addError, checkIfNotDate, checkIfNotEmpty } from 'utils/validation'
import {validateFnrDnrNpid} from "../../../utils/fnrValidator";

export interface ValidationPersonopplysningerProps {
  personInfo: PersonInfo | undefined
  personName?: string
}

export const validatePersonopplysninger = (
  v: Validation,
  namespace: string,
  {
    personInfo,
    personName
  }: ValidationPersonopplysningerProps
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
  const utenlandskePins: Array<Pin> = _.filter(personInfo?.pin, p => p.land !== 'NO')

  if (norwegianPin === undefined && _.isEmpty(utenlandskePins)) {
    hasErrors.push(addError(v, {
      id: namespace + '-norskpin',
      message: 'validation:noId',
      personName
    }))
  }

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

  utenlandskePins?.forEach((pin: Pin, index: number) => {
    hasErrors.push(validateUtenlandskPin(v, namespace + '-pin', {
      pin,
      utenlandskePins,
      index,
      personName
    }))
  })

  return hasErrors.find(value => value) !== undefined
}
