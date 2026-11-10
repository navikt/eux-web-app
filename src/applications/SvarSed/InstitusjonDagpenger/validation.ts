import { ReplySed } from 'declarations/sed'
import { CountryCodes, Validation } from 'declarations/types'
import { KompetentLand, U007Sed } from 'declarations/u007'
import { validateAdresse } from 'applications/SvarSed/Adresser/validation'
import i18n from 'i18n'
import { getLandkodeFromInstitusjonsId } from 'utils/institusjon'
import { addError, checkIfNotEmpty, checkLength } from 'utils/validation'

export interface ValidationInstitusjonDagpengerProps {
  replySed: ReplySed
  countryCodes?: CountryCodes | null
  cdmVersjon?: string
}

// With an institution selected, the country comes from the institution; otherwise it follows the address in kompetent land
export const getInstitusjonLandkode = (
  kompetentLand: KompetentLand | undefined,
  countryCodes: CountryCodes | null | undefined,
  cdmVersjon: string | undefined
): string | undefined =>
  kompetentLand?.institusjon?.id
    ? kompetentLand.institusjon.__landkode ?? getLandkodeFromInstitusjonsId(kompetentLand.institusjon.id, countryCodes, cdmVersjon)
    : kompetentLand?.bruker?.adresse?.landkode

export const validateInstitusjonDagpenger = (
  v: Validation,
  namespace: string,
  { replySed, countryCodes, cdmVersjon }: ValidationInstitusjonDagpengerProps
): boolean => {
  const kompetentLand: KompetentLand | undefined = (replySed as U007Sed).kompetentLand
  const hasErrors: Array<boolean> = []

  if (kompetentLand?.institusjon) {
    const landkode = getInstitusjonLandkode(kompetentLand, countryCodes, cdmVersjon)
    hasErrors.push(checkIfNotEmpty(v, {
      needle: landkode,
      id: `${namespace}-institusjon-landkode`,
      message: 'validation:du-maa-fylle-ut',
      extra: { type: i18n.t('label:land').toLowerCase() }
    }))
    hasErrors.push(checkIfNotEmpty(v, {
      needle: kompetentLand.institusjon.id,
      id: `${namespace}-institusjon-id`,
      message: 'validation:du-maa-fylle-ut',
      extra: { type: i18n.t('label:institusjon').toLowerCase() }
    }))
  } else if (kompetentLand?.uregistrertInstitusjon) {
    const { navn, adresse } = kompetentLand.uregistrertInstitusjon
    hasErrors.push(checkIfNotEmpty(v, {
      needle: navn,
      id: `${namespace}-uregistrertInstitusjon-navn`,
      message: 'validation:du-maa-fylle-ut',
      extra: { type: i18n.t('label:institusjonens-navn').toLowerCase() }
    }))
    hasErrors.push(checkLength(v, {
      needle: navn,
      id: `${namespace}-uregistrertInstitusjon-navn`,
      max: 155,
      message: 'validation:textOverX'
    }))
    hasErrors.push(validateAdresse(v, `${namespace}-uregistrertInstitusjon-adresse`, {
      adresse,
      checkAdresseType: false
    }))
  } else {
    hasErrors.push(addError(v, {
      id: `${namespace}-finnesIIR`,
      message: 'validation:du-maa-fylle-ut',
      extra: { type: i18n.t('label:u007-institusjon-finnes-i-ir-field') }
    }))
  }

  return hasErrors.some(Boolean)
}
