import { H021Sed } from 'declarations/h021'
import { ReplySed } from 'declarations/sed'
import { Validation } from 'declarations/types'
import { checkIfNotEmpty, checkLength, checkValidDateFormat } from 'utils/validation'

export interface ValidationH021PersonopplysningerProps {
  replySed: ReplySed
  personName?: string
}

export const validateH021Personopplysninger = (
  v: Validation,
  namespace: string,
  {
    replySed,
    personName
  }: ValidationH021PersonopplysningerProps
): boolean => {
  const hasErrors: Array<boolean> = []
  const sed = replySed as H021Sed

  hasErrors.push(checkIfNotEmpty(v, {
    needle: sed.bruker?.personInfo?.etternavn,
    id: namespace + '-etternavn',
    message: 'validation:noEtternavn',
    personName
  }))

  hasErrors.push(checkIfNotEmpty(v, {
    needle: sed.bruker?.personInfo?.fornavn,
    id: namespace + '-fornavn',
    message: 'validation:noFornavn',
    personName
  }))

  hasErrors.push(checkIfNotEmpty(v, {
    needle: sed.bruker?.personInfo?.foedselsdato,
    id: namespace + '-foedselsdato',
    message: 'validation:noDate',
    personName
  }))

  hasErrors.push(checkValidDateFormat(v, {
    needle: sed.bruker?.personInfo?.foedselsdato,
    id: namespace + '-foedselsdato',
    message: 'validation:invalidDateFormat',
    personName
  }))

  hasErrors.push(checkIfNotEmpty(v, {
    needle: sed.bruker?.personInfo?.kjoenn,
    id: namespace + '-kjoenn',
    message: 'validation:noKjoenn',
    personName
  }))

  hasErrors.push(checkIfNotEmpty(v, {
    needle: sed.bruker?.personInfo?.pinKompetentLand,
    id: namespace + '-pinKompetentLand',
    message: 'validation:noPIN',
    personName
  }))

  hasErrors.push(checkLength(v, {
    needle: sed.bruker?.personInfo?.pinKompetentLand,
    max: 65,
    id: namespace + '-pinKompetentLand',
    message: 'validation:textOverX',
    personName
  }))

  hasErrors.push(checkLength(v, {
    needle: sed.bruker?.personInfo?.pinOppholdLand,
    max: 65,
    id: namespace + '-pinOppholdLand',
    message: 'validation:textOverX',
    personName
  }))

  return hasErrors.find(value => value) !== undefined
}
