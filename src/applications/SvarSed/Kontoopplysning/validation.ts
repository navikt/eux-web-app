import { UtbetalingTilInstitusjon } from 'declarations/sed'
import { Validation } from 'declarations/types'
import _ from 'lodash'
import { addError, checkIfNotEmpty, checkLength } from 'utils/validation'

interface ValidateKontoopplysningProps {
  uti: UtbetalingTilInstitusjon
  formalName: string
}

export const validateKontoopplysning = (
  v: Validation,
  namespace: string,
  {
    uti,
    formalName
  }: ValidateKontoopplysningProps
): boolean => {
  const hasErrors: Array<boolean> = []
  let kontoType
  if (Object.prototype.hasOwnProperty.call(uti, 'kontoOrdinaer')) {
    kontoType = 'ordinaer'
  }
  if (Object.prototype.hasOwnProperty.call(uti, 'kontoSepa')) {
    kontoType = 'sepa'
  }

  hasErrors.push(checkIfNotEmpty(v, {
    needle: uti?.begrunnelse,
    id: namespace + '-begrunnelse',
    message: 'validation:noBegrunnelse',
    personName: formalName
  }))

  if (!_.isEmpty(uti?.begrunnelse?.trim())) {
    hasErrors.push(checkLength(v, {
      needle: uti?.begrunnelse,
      max: 500,
      id: namespace + '-begrunnelse',
      message: 'validation:textOverX',
      personName: formalName
    }))
  }

  hasErrors.push(checkIfNotEmpty(v, {
    needle: uti?.id,
    id: namespace + '-id',
    message: 'validation:noInstitusjonensId',
    personName: formalName
  }))

  hasErrors.push(checkIfNotEmpty(v, {
    needle: uti?.navn,
    id: namespace + '-navn',
    message: 'validation:noInstitusjonensNavn',
    personName: formalName
  }))

  if (!kontoType) {
    hasErrors.push(addError(v, {
      id: namespace + '-kontotype',
      message: 'validation:noKontotype',
      personName: formalName
    }))
  }

  if (kontoType === 'ordinaer') {
    hasErrors.push(checkIfNotEmpty(v, {
      needle: uti?.kontoOrdinaer?.swift,
      id: namespace + '-kontoOrdinaer-swift',
      message: 'validation:noSwift',
      personName: formalName
    }))

    if (!_.isEmpty(uti?.kontoOrdinaer?.swift?.trim())) {
      if (!uti?.kontoOrdinaer?.swift?.trim().match(/^[A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{3})?$/)) {
        hasErrors.push(addError(v, {
          id: namespace + '-kontoOrdinaer-swift',
          message: 'validation:invalidSwift',
          personName: formalName
        }))
      }
    }
  }

  if (kontoType === 'sepa') {
    if (_.isEmpty(uti?.kontoSepa?.iban?.trim()) && _.isEmpty(uti?.kontoSepa?.swift?.trim())) {
      hasErrors.push(addError(v, {
        id: namespace + '-kontoSepa-iban',
        message: 'validation:noIbanOrSwift',
        personName: formalName
      }))
    }

    if (!_.isEmpty(uti?.kontoSepa?.iban?.trim()) && !uti.kontoSepa!.iban.trim().match(/^[a-zA-Z]{2}[0-9]{2}[a-zA-Z0-9]{4}[a-zA-Z0-9]{7}([a-zA-Z0-9]?){0,16}$/)) {
      hasErrors.push(addError(v, {
        id: namespace + '-kontoSepa-iban',
        message: 'validation:invalidIban',
        personName: formalName
      }))
    }

    if (_.isEmpty(uti?.kontoSepa?.iban?.trim()) && _.isEmpty(uti?.kontoSepa?.swift?.trim())) {
      hasErrors.push(addError(v, {
        id: namespace + '-kontoSepa-swift',
        message: 'validation:noIbanOrSwift',
        personName: formalName
      }))
    }

    if (!_.isEmpty(uti?.kontoSepa?.swift?.trim()) && _.isNil(uti?.kontoSepa?.swift?.trim().match(/^[A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{3})?$/))) {
      hasErrors.push(addError(v, {
        id: namespace + '-kontoSepa-swift',
        message: 'validation:invalidSwift',
        personName: formalName
      }))
    }
  }
  return hasErrors.find(value => value) !== undefined
}
