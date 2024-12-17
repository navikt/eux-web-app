import { validateUtenlandskPin } from 'components/UtenlandskPins/validation'
import {Foedested, PersonInfo, Pin} from 'declarations/sed'
import { Validation } from 'declarations/types'
import _ from 'lodash'
import {addError, checkIfNotDate, checkIfNotEmpty, checkLength, checkValidDateFormat} from 'utils/validation'
import {validateFnrDnrNpid} from "../../../utils/fnrValidator";
import {validateFoedested} from "../../../components/Foedested/validation";

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

  hasErrors.push(checkIfNotEmpty(v, {
    needle: personInfo?.kjoenn?.trim(),
    id: namespace + '-kjoenn',
    message: 'validation:noKjoenn',
    personName
  }))

  const norwegianPin: Pin | undefined = _.find(personInfo?.pin, p => p.landkode === 'NOR')
  const utenlandskePins: Array<Pin> = _.filter(personInfo?.pin, p => p.landkode !== 'NOR')

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

  const foedested: Foedested | undefined = personInfo?.pinMangler?.foedested
  if(foedested){
    hasErrors.push(validateFoedested(v, namespace + '-foedested', {
      foedested,
      personName
    }))
  }
  return hasErrors.find(value => value) !== undefined
}
