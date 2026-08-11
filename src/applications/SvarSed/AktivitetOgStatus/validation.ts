import { Aktivitet, BostedInformasjon } from '../../../declarations/h'
import { Validation } from 'declarations/types'
import { getIdx } from 'utils/namespace'
import { checkIfNotEmpty, checkLength } from 'utils/validation'

export interface ValidationAktivitetItemProps {
  aktivitet: Aktivitet | undefined
  index?: number
  personName?: string
}

export interface ValidationAktivitetOgStatusProps {
  info: BostedInformasjon | undefined
  inntektskildeStudenterMaxLength: number
  personName?: string
}

export const validateAktivitetItem = (
  v: Validation,
  namespace: string,
  {
    aktivitet,
    index,
    personName
  }: ValidationAktivitetItemProps
): boolean => {
  const hasErrors: Array<boolean> = []
  const idx = getIdx(index)

  hasErrors.push(checkLength(v, {
    needle: aktivitet?.beskrivelse,
    id: namespace + idx + '-beskrivelse',
    max: 155,
    message: 'validation:textOverX',
    personName
  }))

  hasErrors.push(checkLength(v, {
    needle: aktivitet?.sted,
    id: namespace + idx + '-sted',
    max: 65,
    message: 'validation:textOverX',
    personName
  }))

  hasErrors.push(checkLength(v, {
    needle: aktivitet?.varighet,
    id: namespace + idx + '-varighet',
    max: 65,
    message: 'validation:textOverX',
    personName
  }))

  hasErrors.push(checkLength(v, {
    needle: aktivitet?.art,
    id: namespace + idx + '-art',
    max: 255,
    message: 'validation:textOverX',
    personName
  }))

  return hasErrors.find(value => value) !== undefined
}

export const validateAktivitetOgStatus = (
  v: Validation,
  namespace: string,
  {
    info,
    inntektskildeStudenterMaxLength,
    personName
  }: ValidationAktivitetOgStatusProps
): boolean => {
  const hasErrors: Array<boolean> = []

  if (info?.personensStatus === 'annet') {
    hasErrors.push(checkIfNotEmpty(v, {
      needle: info?.personensStatusAnnet,
      id: namespace + '-personensStatusAnnet',
      message: 'validation:noPersonensStatusAnnet',
      personName
    }))

    hasErrors.push(checkLength(v, {
      needle: info?.personensStatusAnnet,
      id: namespace + '-personensStatusAnnet',
      max: 500,
      message: 'validation:textOverX',
      personName
    }))
  }

  hasErrors.push(checkLength(v, {
    needle: info?.inntektskildeStudenter,
    id: namespace + '-inntektskildeStudenter',
    max: inntektskildeStudenterMaxLength,
    message: 'validation:textOverX',
    personName
  }))

  hasErrors.push(checkLength(v, {
    needle: info?.bosituasjonHvorPermanent,
    id: namespace + '-bosituasjonHvorPermanent',
    max: 155,
    message: 'validation:textOverX',
    personName
  }))

  hasErrors.push(checkLength(v, {
    needle: info?.permanentOppholdSkattemessig,
    id: namespace + '-permanentOppholdSkattemessig',
    max: 65,
    message: 'validation:textOverX',
    personName
  }))

  info?.aktiviteter?.forEach((aktivitet: Aktivitet, index: number) => {
    hasErrors.push(validateAktivitetItem(v, namespace, {
      aktivitet,
      index,
      personName
    }))
  })

  return hasErrors.find(value => value) !== undefined
}
