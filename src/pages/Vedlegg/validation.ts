import { Validation } from 'declarations/types'
import { checkIfNotEmpty } from 'utils/validation'

export interface ValidationVedleggProps {
  journalpostID: string | undefined
  dokumentID: string | undefined
  rinasaksnummer: string | undefined
  rinadokumentID: string | undefined
}

export const validateVedlegg = (
  v: Validation,
  namespace: string,
  {
    journalpostID,
    dokumentID,
    rinasaksnummer,
    rinadokumentID
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
