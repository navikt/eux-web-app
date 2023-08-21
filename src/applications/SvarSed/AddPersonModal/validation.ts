import { Validation } from 'declarations/types'
import _ from 'lodash'
import { checkIfNotEmpty, checkIfValidFnr } from 'utils/validation'

export interface ValidationAddPersonModalProps {
  fnr: string
  fornavn: string
  etternavn: string
  fdato: string
  kjoenn: string
  relasjon: string | undefined
}

export const validateAddPersonModal = (
  v: Validation,
  namespace: string,
  {
    fnr,
    fornavn,
    etternavn,
    fdato,
    kjoenn,
    relasjon
  }: ValidationAddPersonModalProps
): boolean => {
  const hasErrors: Array<boolean> = []

  if (!_.isEmpty(fnr?.trim())) {
    hasErrors.push(checkIfValidFnr(v, {
      needle: fnr,
      message: 'validation:invalidFnr',
      id: namespace + '-fnr'
    }))
  }

  hasErrors.push(checkIfNotEmpty(v, {
    needle: fornavn,
    message: 'validation:noFornavn',
    id: namespace + '-fornavn'
  }))

  hasErrors.push(checkIfNotEmpty(v, {
    needle: etternavn,
    message: 'validation:noEtternavn',
    id: namespace + '-etternavn'
  }))

  hasErrors.push(checkIfNotEmpty(v, {
    needle: kjoenn,
    message: 'validation:noKjoenn',
    id: namespace + '-kjoenn'
  }))

  hasErrors.push(checkIfNotEmpty(v, {
    needle: fdato,
    message: 'validation:noFoedselsdato',
    id: namespace + '-fdato'
  }))

  hasErrors.push(checkIfNotEmpty(v, {
    needle: relasjon,
    message: 'validation:noRelation',
    id: namespace + '-relasjon'
  }))

  return hasErrors.find(value => value) !== undefined
}
