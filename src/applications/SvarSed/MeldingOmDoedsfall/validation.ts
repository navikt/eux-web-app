import { H070Sed } from 'declarations/h070'
import { ReplySed } from 'declarations/sed'
import { Validation } from 'declarations/types'
import { validateAdresse } from 'applications/SvarSed/Adresser/validation'
import { checkIfNotEmpty, checkValidDateFormat } from 'utils/validation'

export interface ValidationMeldingOmDoedsfallProps {
  replySed: ReplySed
  personName?: string
}

export const validateMeldingOmDoedsfall = (
  v: Validation,
  namespace: string,
  {
    replySed,
    personName
  }: ValidationMeldingOmDoedsfallProps
): boolean => {
  const hasErrors: Array<boolean> = []
  const sed = replySed as H070Sed

  hasErrors.push(checkIfNotEmpty(v, {
    needle: sed.doedsdato,
    id: namespace + '-doedsdato',
    message: 'validation:noDoedsdato',
    personName
  }))

  hasErrors.push(checkValidDateFormat(v, {
    needle: sed.doedsdato,
    id: namespace + '-doedsdato',
    message: 'validation:invalidDateFormat',
    personName
  }))

  hasErrors.push(validateAdresse(v, namespace + '-doedssted', {
    adresse: sed.doedssted,
    checkAdresseType: false,
    optional: true,
    personName
  }))

  return hasErrors.find(value => value) !== undefined
}
