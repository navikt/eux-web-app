import { BesvarelseKommer, BesvarelseUmulig } from 'declarations/sed'
import { Validation } from 'declarations/types'
import { getIdx } from 'utils/namespace'
import { checkIfDuplicate, checkIfNotEmpty, checkLength } from 'utils/validation'

export interface ValidationBesvarelseKommerProps {
  dokument: BesvarelseKommer | undefined
  dokumenter: Array<BesvarelseKommer> | undefined
  index?: number
  personName?: string
}

export interface ValidationBesvarelseUmuligProps {
  dokument: BesvarelseUmulig | undefined
  dokumenter: Array<BesvarelseUmulig> | undefined
  index?: number
  personName?: string
}

export interface ValidationSvarPåminnelseProps {
  besvarelseKommer: Array<BesvarelseKommer> | undefined
  besvarelseUmulig: Array<BesvarelseUmulig> | undefined
  personName?: string
}

export const validateBesvarelseKommer = (
  v: Validation,
  namespace: string,
  {
    dokument,
    dokumenter,
    index,
    personName
  }: ValidationBesvarelseKommerProps
): boolean => {
  const hasErrors: Array<boolean> = []
  const idx = getIdx(index)

  hasErrors.push(checkIfNotEmpty(v, {
    needle: dokument?.gjelder,
    id: namespace + idx + '-gjelder',
    message: 'validation:noType',
    personName
  }))

  hasErrors.push(checkIfNotEmpty(v, {
    needle: dokument?.beskrivelse,
    id: namespace + idx + '-beskrivelse',
    message: 'validation:noInfo',
    personName
  }))

  hasErrors.push(checkIfNotEmpty(v, {
    needle: dokument?.innenDato,
    id: namespace + idx + '-innenDato',
    message: 'validation:noDate',
    personName
  }))

  hasErrors.push(checkIfDuplicate(v, {
    needle: dokument,
    haystack: dokumenter,
    matchFn: (s: BesvarelseKommer) => s.gjelder === dokument?.gjelder,
    id: namespace + idx + '-gjelder',
    index,
    message: 'validation:duplicateType',
    personName
  }))

  return hasErrors.find(value => value) !== undefined
}

export const validateBesvarelseUmulig = (
  v: Validation,
  namespace: string,
  {
    dokument,
    dokumenter,
    index,
    personName
  }: ValidationBesvarelseUmuligProps
): boolean => {
  const hasErrors: Array<boolean> = []
  const idx = getIdx(index)

  hasErrors.push(checkIfNotEmpty(v, {
    needle: dokument?.gjelder,
    id: namespace + idx + '-gjelder',
    message: 'validation:noType',
    personName
  }))

  hasErrors.push(checkIfNotEmpty(v, {
    needle: dokument?.beskrivelse,
    id: namespace + idx + '-beskrivelse',
    message: 'validation:noInfo',
    personName
  }))

  hasErrors.push(checkIfNotEmpty(v, {
    needle: dokument?.begrunnelseType,
    id: namespace + idx + '-begrunnelseType',
    message: 'validation:noBegrunnelse',
    personName
  }))

  if (dokument?.begrunnelseType === '99') {
    hasErrors.push(checkIfNotEmpty(v, {
      needle: dokument?.begrunnelseAnnen,
      id: namespace + idx + '-begrunnelseAnnen',
      message: 'validation:noBegrunnelseAnnen',
      personName
    }))

    hasErrors.push(checkLength(v, {
      needle: dokument.begrunnelseAnnen,
      max: 255,
      id: namespace + idx + '-begrunnelseAnnen',
      message: 'validation:textOverX',
      personName
    }))
  }

  hasErrors.push(checkIfDuplicate(v, {
    needle: dokument,
    haystack: dokumenter,
    matchFn: (s: BesvarelseKommer) => s.gjelder === dokument?.gjelder,
    id: namespace + idx + '-gjelder',
    index,
    message: 'validation:duplicateType',
    personName
  }))

  return hasErrors.find(value => value) !== undefined
}

export const validateSvarPåminnelse = (
  validation: Validation,
  namespace: string,
  {
    besvarelseKommer,
    besvarelseUmulig,
    personName
  }: ValidationSvarPåminnelseProps
): boolean => {
  const hasErrors: Array<boolean> = []
  besvarelseKommer?.forEach((dokument: BesvarelseKommer, index: number) => {
    hasErrors.push(validateBesvarelseKommer(validation, namespace + '-BesvarelseKommer',
      { dokument, dokumenter: besvarelseKommer, index, personName }))
  })
  besvarelseUmulig?.forEach((dokument: BesvarelseUmulig, index: number) => {
    hasErrors.push(validateBesvarelseUmulig(validation, namespace + '-BesvarelseUmulig',
      { dokument, dokumenter: besvarelseUmulig, index, personName }))
  })
  return hasErrors.find(value => value) !== undefined
}
