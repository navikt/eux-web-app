import { DokumentTilSend, DokumentIkkeTilgjengelige } from 'declarations/sed'
import { Validation } from 'declarations/types'
import { getIdx } from 'utils/namespace'
import { checkIfDuplicate, checkIfNotEmpty } from 'utils/validation'

export interface ValidationDokumentTilSendProps {
  dokument: DokumentTilSend | undefined
  dokumenter: Array<DokumentTilSend> | undefined
  index?: number
  personName?: string
}

export interface ValidationDokumentIkkeTilgjengeligeProps {
  dokument: DokumentIkkeTilgjengelige | undefined
  dokumenter: Array<DokumentIkkeTilgjengelige> | undefined
  index?: number
  personName?: string
}

export interface ValidationSvarPåminnelseProps {
  dokumenterTilSend: Array<DokumentTilSend> | undefined
  dokumenterIkkeTilgjengelige: Array<DokumentIkkeTilgjengelige> | undefined
  personName?: string
}

export const validateDokumentTilSend = (
  v: Validation,
  namespace: string,
  {
    dokument,
    dokumenter,
    index,
    personName
  }: ValidationDokumentTilSendProps
): boolean => {
  const hasErrors: Array<boolean> = []
  const idx = getIdx(index)

  hasErrors.push(checkIfNotEmpty(v, {
    needle: dokument?.dokumenttype,
    id: namespace + idx + '-dokumenttype',
    message: 'validation:noType',
    personName
  }))

  hasErrors.push(checkIfNotEmpty(v, {
    needle: dokument?.dokumentinfo,
    id: namespace + idx + '-dokumentinfo',
    message: 'validation:noInfo',
    personName
  }))

  hasErrors.push(checkIfNotEmpty(v, {
    needle: dokument?.dato,
    id: namespace + idx + '-dato',
    message: 'validation:noDate',
    personName
  }))

  hasErrors.push(checkIfDuplicate(v, {
    needle: dokument,
    haystack: dokumenter,
    matchFn: (s: DokumentTilSend) => s.dokumenttype === dokument?.dokumenttype,
    id: namespace + idx + '-dokumenttype',
    index,
    message: 'validation:duplicateType',
    personName
  }))

  return hasErrors.find(value => value) !== undefined
}

export const validateDokumentIkkeTilgjengelige = (
  v: Validation,
  namespace: string,
  {
    dokument,
    dokumenter,
    index,
    personName
  }: ValidationDokumentIkkeTilgjengeligeProps
): boolean => {
  const hasErrors: Array<boolean> = []
  const idx = getIdx(index)

  hasErrors.push(checkIfNotEmpty(v, {
    needle: dokument?.dokumenttype,
    id: namespace + idx + '-dokumenttype',
    message: 'validation:noType',
    personName
  }))

  hasErrors.push(checkIfNotEmpty(v, {
    needle: dokument?.dokumentinfo,
    id: namespace + idx + '-dokumentinfo',
    message: 'validation:noInfo',
    personName
  }))

  hasErrors.push(checkIfNotEmpty(v, {
    needle: dokument?.begrunnelse,
    id: namespace + idx + '-begrunnelse',
    message: 'validation:noBegrunnelse',
    personName
  }))

  if (dokument?.begrunnelse === '99') {
    hasErrors.push(checkIfNotEmpty(v, {
      needle: dokument?.begrunnelseAnnen,
      id: namespace + idx + '-begrunnelseAnnen',
      message: 'validation:noBegrunnelseAnnen',
      personName
    }))
  }

  hasErrors.push(checkIfDuplicate(v, {
    needle: dokument,
    haystack: dokumenter,
    matchFn: (s: DokumentTilSend) => s.dokumenttype === dokument?.dokumenttype,
    id: namespace + idx + '-dokumenttype',
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
    dokumenterTilSend,
    dokumenterIkkeTilgjengelige,
    personName
  }: ValidationSvarPåminnelseProps
): boolean => {
  const hasErrors: Array<boolean> = []
  dokumenterTilSend?.forEach((dokument: DokumentTilSend, index: number) => {
    hasErrors.push(validateDokumentTilSend(validation, namespace + '-dokumentTilSend',
      { dokument, dokumenter: dokumenterTilSend, index, personName }))
  })
  dokumenterIkkeTilgjengelige?.forEach((dokument: DokumentIkkeTilgjengelige, index: number) => {
    hasErrors.push(validateDokumentIkkeTilgjengelige(validation, namespace + '-dokumentIkkeTilgjengelige',
      { dokument, dokumenter: dokumenterIkkeTilgjengelige, index, personName }))
  })
  return hasErrors.find(value => value) !== undefined
}
