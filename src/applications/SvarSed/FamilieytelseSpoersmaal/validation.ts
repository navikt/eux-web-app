import { ReplySed } from 'declarations/sed'
import { Validation } from 'declarations/types'
import { H120Sed } from 'declarations/h120'
import { checkIfNotEmpty, checkLength } from 'utils/validation'

export interface ValidationFamilieytelseSpoersmaalProps {
  replySed: ReplySed
  personName?: string
}

export const validateFamilieytelseSpoersmaal = (
  v: Validation,
  namespace: string,
  {
    replySed,
    personName
  }: ValidationFamilieytelseSpoersmaalProps
): boolean => {
  const hasErrors: Array<boolean> = []
  const sed = replySed as H120Sed

  if (sed.familie?.annenDokumentasjon?.trim()) {
    hasErrors.push(checkIfNotEmpty(v, {
      needle: sed.familie?.etterspurtDokumentasjon,
      id: namespace + '-etterspurtDokumentasjon',
      message: 'validation:noEtterspurtDokumentasjonFamilieytelser',
      personName
    }))
  }

  hasErrors.push(checkLength(v, {
    needle: sed.familie?.annenDokumentasjon,
    max: 500,
    id: namespace + '-annenDokumentasjon',
    message: 'validation:textOverX',
    personName
  }))

  return hasErrors.find(value => value) !== undefined
}
