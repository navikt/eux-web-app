import { Validation } from 'declarations/types'
import { TFunction } from 'react-i18next'
import { checkIfNotEmpty } from 'utils/validation'

export interface ValidationVedleggProps {
  journalpostID: string | undefined
  dokumentID: string | undefined
  rinasaksnummer: string | undefined
  rinadokumentID: string | undefined
  namespace: string
}

export const validateVedlegg = (
  v: Validation,
  t: TFunction,
  {
    journalpostID,
    dokumentID,
    rinasaksnummer,
    rinadokumentID,
    namespace
  }: ValidationVedleggProps
): boolean => {
  const hasErrors: Array<boolean> = []

  hasErrors.push(checkIfNotEmpty(v, {
    needle: journalpostID,
    id: namespace + '-journalpostID',
    message: 'validation:noJournalpostID'
  }))

  hasErrors.push(checkIfNotEmpty(v, {
    needle: dokumentID,
    id: namespace + '-dokumentID',
    message: 'validation:noDokumentID'
  }))

  hasErrors.push(checkIfNotEmpty(v, {
    needle: rinasaksnummer,
    id: namespace + '-documentSearch-rinasaksnummer',
    message: 'validation:noSaksnummer'
  }))

  hasErrors.push(checkIfNotEmpty(v, {
    needle: rinadokumentID,
    id: namespace + '-documentSearch-rinadokumentID',
    message: 'validation:noRinadokumentID'
  }))

  return hasErrors.find(value => value) !== undefined
}
