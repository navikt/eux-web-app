import { H070Sed } from 'declarations/h070'
import { ReplySed } from 'declarations/sed'
import { Validation } from 'declarations/types'
import { checkIfNotEmpty, checkLength } from 'utils/validation'

export interface ValidationVedlagtDokumentasjonProps {
  replySed: ReplySed
  personName?: string
}

export const validateVedlagtDokumentasjon = (
  v: Validation,
  namespace: string,
  {
    replySed,
    personName
  }: ValidationVedlagtDokumentasjonProps
): boolean => {
  const hasErrors: Array<boolean> = []
  const sed = replySed as H070Sed

  const isAnnetSelected = sed.doedsfall?.forhaandsdefinerteDokumenter?.includes('annet')

  if (isAnnetSelected) {
    hasErrors.push(checkIfNotEmpty(v, {
      needle: sed.doedsfall?.annetDokument,
      id: namespace + '-annetDokument',
      message: 'validation:noAnnetDokument',
      personName
    }))
  }

  hasErrors.push(checkLength(v, {
    needle: sed.doedsfall?.annetDokument,
    max: 255,
    id: namespace + '-annetDokument',
    message: 'validation:textOverX',
    personName
  }))

  return hasErrors.find(value => value) !== undefined
}
