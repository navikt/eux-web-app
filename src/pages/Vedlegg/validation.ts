import { Validation } from 'declarations/types'
import { checkIfNotEmpty } from 'utils/validation'

export interface ValidationVedleggProps {
  rinasaksnummer: string | undefined
  rinadokumentID: string | undefined
}

export const validateVedlegg = (
  v: Validation,
  namespace: string,
  {
    rinasaksnummer,
    rinadokumentID
  }: ValidationVedleggProps
): boolean => {
  const hasErrors: Array<boolean> = []

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
