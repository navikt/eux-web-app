import { H002Sed, ReplySed } from 'declarations/sed'
import { Validation } from 'declarations/types'
import _ from 'lodash'
import { checkLength } from 'utils/validation'
import { PDU1 } from 'declarations/pd'

export interface ValidationSvarPåForespørselProps {
  replySed: ReplySed | PDU1 | null | undefined
  personName?: string
}

export const validateSvarPåForespørsel = (
  v: Validation,
  namespace: string,
  {
    replySed,
    personName
  }: ValidationSvarPåForespørselProps
): boolean => {
  const hasErrors: Array<boolean> = []

  const doWeHavePositive: boolean = !_.isEmpty((replySed as H002Sed)?.positivtSvar?.informasjon) ||
    !_.isEmpty((replySed as H002Sed)?.positivtSvar?.dokument) ||
      !_.isEmpty((replySed as H002Sed)?.positivtSvar?.sed)

  const doWeHaveNegative: boolean = !!((replySed as H002Sed)?.negativtSvar?.informasjon) ||
    !_.isEmpty((replySed as H002Sed)?.negativtSvar?.dokument) ||
      !_.isEmpty((replySed as H002Sed)?.negativtSvar?.sed) ||
        !_.isEmpty((replySed as H002Sed)?.negativtSvar?.grunn)

<<<<<<< HEAD
  const target: string | undefined = doWeHavePositive ? 'positivt' : doWeHaveNegative ? 'negative' : undefined
=======
  const target: string | undefined = doWeHavePositive ? 'positivt' : doWeHaveNegative ? 'negativt' : undefined
>>>>>>> v7

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

  if (target === 'negativt') {
    hasErrors.push(checkLength(v, {
      needle: (replySed as H002Sed).negativtSvar?.informasjon,
      max: 255,
      id: namespace + '-informasjon',
      message: 'validation:textOverX',
      personName
    }))

    hasErrors.push(checkLength(v, {
      needle: (replySed as H002Sed).negativtSvar?.dokument,
      max: 500,
      id: namespace + '-dokument',
      message: 'validation:textOverX',
      personName
    }))

    hasErrors.push(checkLength(v, {
      needle: (replySed as H002Sed).negativtSvar?.sed,
      max: 65,
      id: namespace + '-sed',
      message: 'validation:textOverX',
      personName
    }))

    hasErrors.push(checkLength(v, {
      needle: (replySed as H002Sed).negativtSvar?.grunn,
      max: 500,
      id: namespace + '-grunn',
      message: 'validation:textOverX',
      personName
    }))
  }
  return hasErrors.find(value => value) !== undefined
}
