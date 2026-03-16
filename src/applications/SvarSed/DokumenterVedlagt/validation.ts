import { H065Sed, ReplySed } from 'declarations/sed'
import { Validation } from 'declarations/types'
import { checkIfNotEmpty, checkLength } from 'utils/validation'

export interface ValidationDokumenterVedlagtProps {
  replySed: ReplySed
  personName?: string
}

export const validateDokumenterVedlagt = (
  v: Validation,
  namespace: string,
  {
    replySed,
    personName
  }: ValidationDokumenterVedlagtProps
): boolean => {
  const hasErrors: Array<boolean> = []
  const sed = replySed as H065Sed

  const isAnnetSelected = sed.overfoeringInfo?.dokumenterVedlagt?.type?.includes('annet')

  if (isAnnetSelected) {
    hasErrors.push(checkIfNotEmpty(v, {
      needle: sed.overfoeringInfo?.dokumenterVedlagt?.annet?.[0],
      id: namespace + '-dokumenterVedlagt-annet',
      message: 'validation:noAnnetDokument',
      personName
    }))
  }

  hasErrors.push(checkLength(v, {
    needle: sed.overfoeringInfo?.dokumenterVedlagt?.annet?.[0],
    max: 255,
    id: namespace + '-dokumenterVedlagt-annet',
    message: 'validation:textOverX',
    personName
  }))

  return hasErrors.find(value => value) !== undefined
}
