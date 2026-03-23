import { ReplySed } from 'declarations/sed'
import { Validation } from 'declarations/types'
import { H120Sed } from 'declarations/h120'
import { checkIfNotEmpty, checkLength } from 'utils/validation'

export interface ValidationKravetsArtProps {
  replySed: ReplySed
  personName?: string
}

export const validateKravetsArt = (
  v: Validation,
  namespace: string,
  {
    replySed,
    personName
  }: ValidationKravetsArtProps
): boolean => {
  const hasErrors: Array<boolean> = []
  const sed = replySed as H120Sed

  hasErrors.push(checkIfNotEmpty(v, {
    needle: sed.kravetsArt?.etterspurtHandling,
    id: namespace + '-etterspurtHandling',
    message: 'validation:noEtterspurtHandling',
    personName
  }))

  if (sed.kravetsArt?.etterspurtDokumentasjon?.includes('annen_medisinsk_dokumentasjon')) {
    hasErrors.push(checkIfNotEmpty(v, {
      needle: sed.kravetsArt?.annenDokumentasjon,
      id: namespace + '-annenDokumentasjon',
      message: 'validation:noAnnenMedisinskDokumentasjon',
      personName
    }))
  }

  hasErrors.push(checkLength(v, {
    needle: sed.kravetsArt?.annenDokumentasjon,
    max: 500,
    id: namespace + '-annenDokumentasjon',
    message: 'validation:textOverX',
    personName
  }))

  hasErrors.push(checkLength(v, {
    needle: sed.kravetsArt?.spesielleKravTilDokumentasjon,
    max: 500,
    id: namespace + '-spesielleKravTilDokumentasjon',
    message: 'validation:textOverX',
    personName
  }))

  return hasErrors.find(value => value) !== undefined
}
