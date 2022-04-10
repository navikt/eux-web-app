import { H002Sed, ReplySed } from 'declarations/sed'
import { Validation } from 'declarations/types'
import _ from 'lodash'
import { TFunction } from 'react-i18next'
import { checkIfNotTrue, checkLength, propagateError } from 'utils/validation'

export interface ValidationSvarPåForespørselProps {
  replySed: ReplySed
  namespace: string,
  personName: string
}

export const validateSvarPåForespørsel = (
  v: Validation,
  t: TFunction,
  {
    replySed,
    namespace,
    personName
  }: ValidationSvarPåForespørselProps
): boolean => {
  const hasErrors: Array<boolean> = []

  const doWeHavePositive: boolean = !_.isEmpty((replySed as H002Sed)?.positivtSvar?.informasjon) ||
    !_.isEmpty((replySed as H002Sed)?.positivtSvar?.dokument) ||
      !_.isEmpty((replySed as H002Sed)?.positivtSvar?.sed)

  const doWeHaveNegative: boolean = !!((replySed as H002Sed)?.negativeSvar?.informasjon) ||
    !_.isEmpty((replySed as H002Sed)?.negativeSvar?.dokument) ||
      !_.isEmpty((replySed as H002Sed)?.negativeSvar?.sed) ||
        !_.isEmpty((replySed as H002Sed)?.negativeSvar?.grunn)

  const target: string | undefined = doWeHavePositive ? 'positivt' : doWeHaveNegative ? 'negative' : undefined

  hasErrors.push(checkIfNotTrue(v, {
    needle: doWeHavePositive || doWeHaveNegative,
    id: namespace + '-svar',
    message: 'validation:noSvarType',
    personName
  }))

  if (target === 'positivt') {
    hasErrors.push(checkLength(v, {
      needle: (replySed as H002Sed).positivtSvar?.informasjon,
      max: 500,
      id: namespace + '-informasjon',
      message: 'validation:textOverX',
      personName
    }))

    hasErrors.push(checkLength(v, {
      needle: (replySed as H002Sed).positivtSvar?.dokument,
      max: 255,
      id: namespace + '-dokument',
      message: 'validation:textOverX',
      personName
    }))

    hasErrors.push(checkLength(v, {
      needle: (replySed as H002Sed).positivtSvar?.sed,
      max: 65,
      id: namespace + '-sed',
      message: 'validation:textOverX',
      personName
    }))
  }

  if (target === 'negative') {
    hasErrors.push(checkLength(v, {
      needle: (replySed as H002Sed).negativeSvar?.informasjon,
      max: 255,
      id: namespace + '-informasjon',
      message: 'validation:textOverX',
      personName
    }))

    hasErrors.push(checkLength(v, {
      needle: (replySed as H002Sed).negativeSvar?.dokument,
      max: 500,
      id: namespace + '-dokument',
      message: 'validation:textOverX',
      personName
    }))

    hasErrors.push(checkLength(v, {
      needle: (replySed as H002Sed).negativeSvar?.sed,
      max: 65,
      id: namespace + '-sed',
      message: 'validation:textOverX',
      personName
    }))

    hasErrors.push(checkLength(v, {
      needle: (replySed as H002Sed).negativeSvar?.grunn,
      max: 500,
      id: namespace + '-grunn',
      message: 'validation:textOverX',
      personName
    }))
  }
  const hasError: boolean = hasErrors.find(value => value) !== undefined
  if (hasError) propagateError(v, namespace)
  return hasError
}
