import { ReplySed } from 'declarations/sed'
import { H002Sed, NegativtSvar, PositivtSvar } from 'declarations/h002'
import { Validation } from 'declarations/types'
import _ from 'lodash'
import { checkLength } from 'utils/validation'
import { PDU1 } from 'declarations/pd'

export type SvarType = 'positivt' | 'negativt'

export interface ValidationSvarPåForespørselProps {
  replySed: ReplySed | PDU1 | null | undefined
  personName?: string
}

export const getSvarType = (replySed: ReplySed | PDU1 | null | undefined): SvarType | undefined => {
  const bruker = (replySed as H002Sed)?.bruker

  const doWeHavePositive: boolean = !_.isEmpty(bruker?.positivtSvar?.informasjon) ||
    !_.isEmpty(bruker?.positivtSvar?.dokument) ||
    !_.isEmpty(bruker?.positivtSvar?.sed)

  const doWeHaveNegative: boolean = !!bruker?.negativtSvar?.some((negativtSvar: NegativtSvar) =>
    !_.isEmpty(negativtSvar?.informasjon) ||
    !_.isEmpty(negativtSvar?.dokument) ||
    !_.isEmpty(negativtSvar?.sed) ||
    !_.isEmpty(negativtSvar?.grunn)
  )

  return doWeHavePositive ? 'positivt' : doWeHaveNegative ? 'negativt' : undefined
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
  const bruker = (replySed as H002Sed)?.bruker
  const target: SvarType | undefined = getSvarType(replySed)

  if (target === 'positivt') {
    const positivtSvar: PositivtSvar | undefined = bruker?.positivtSvar

    hasErrors.push(checkLength(v, {
      needle: positivtSvar?.informasjon,
      max: 500,
      id: namespace + '-informasjon',
      message: 'validation:textOverX',
      personName
    }))

    hasErrors.push(checkLength(v, {
      needle: positivtSvar?.dokument,
      max: 255,
      id: namespace + '-dokument',
      message: 'validation:textOverX',
      personName
    }))

    hasErrors.push(checkLength(v, {
      needle: positivtSvar?.sed,
      max: 65,
      id: namespace + '-sed',
      message: 'validation:textOverX',
      personName
    }))
  }

  if (target === 'negativt') {
    // the form only edits the first negative answer, so that is the one being validated
    const negativtSvar: NegativtSvar | undefined = bruker?.negativtSvar?.[0]

    hasErrors.push(checkLength(v, {
      needle: negativtSvar?.dokument,
      max: 255,
      id: namespace + '-dokument',
      message: 'validation:textOverX',
      personName
    }))

    hasErrors.push(checkLength(v, {
      needle: negativtSvar?.informasjon,
      max: 500,
      id: namespace + '-informasjon',
      message: 'validation:textOverX',
      personName
    }))

    hasErrors.push(checkLength(v, {
      needle: negativtSvar?.sed,
      max: 65,
      id: namespace + '-sed',
      message: 'validation:textOverX',
      personName
    }))

    hasErrors.push(checkLength(v, {
      needle: negativtSvar?.grunn,
      max: 500,
      id: namespace + '-grunn',
      message: 'validation:textOverX',
      personName
    }))
  }
  return hasErrors.find(value => value) !== undefined
}
