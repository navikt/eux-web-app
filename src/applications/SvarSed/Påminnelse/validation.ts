import { Dokument } from 'declarations/sed'
import { Validation } from 'declarations/types'
import { getIdx } from 'utils/namespace'
import { checkIfDuplicate, checkIfNotEmpty } from 'utils/validation'

export interface ValidationDokumentProps {
  dokument: Dokument | undefined
  dokumenter: Array<Dokument> | undefined
  index?: number
  personName?: string
}

export interface ValidationDokumenterProps {
  dokumenter: Array<Dokument> | undefined
  personName?: string
}

export const validateDokument = (
  v: Validation,
  namespace: string,
  {
    dokument,
    dokumenter,
    index,
    personName
  }: ValidationDokumentProps
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

  hasErrors.push(checkIfDuplicate(v, {
    needle: dokument,
    haystack: dokumenter,
    matchFn: (s: Dokument) => s.dokumenttype === dokument?.dokumenttype,
    id: namespace + idx + '-dokumenttype',
    index,
    message: 'validation:duplicateType',
    personName
  }))

  return hasErrors.find(value => value) !== undefined
}

export const validateDokumenter = (
  validation: Validation,
  namespace: string,
  {
    dokumenter,
    personName
  }: ValidationDokumenterProps
): boolean => {
  const hasErrors: Array<boolean> = []
  dokumenter?.forEach((dokument: Dokument, index: number) => {
    hasErrors.push(validateDokument(validation, namespace, { dokument, dokumenter, index, personName }))
  })
  return hasErrors.find(value => value) !== undefined
}
