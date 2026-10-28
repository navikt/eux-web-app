import { ReplySed } from 'declarations/sed'
import { Validation } from 'declarations/types'
import { KompetentLand, U007Sed } from 'declarations/u007'
import { validateAdresse } from 'applications/SvarSed/Adresser/validation'
import i18n from 'i18n'
import { addError, checkIfNotEmpty, checkLength } from 'utils/validation'

export interface ValidationInstitusjonDagpengerProps {
  replySed: ReplySed
}

export const validateInstitusjonDagpenger = (
  v: Validation,
  namespace: string,
  { replySed }: ValidationInstitusjonDagpengerProps
): boolean => {
  const kompetentLand: KompetentLand | undefined = (replySed as U007Sed).kompetentLand
  const hasErrors: Array<boolean> = []

  if (kompetentLand?.institusjon) {
    const { id, navn } = kompetentLand.institusjon
    hasErrors.push(checkIfNotEmpty(v, {
      needle: id,
      id: `${namespace}-institusjon-id`,
      message: 'validation:du-maa-fylle-ut',
      extra: { type: i18n.t('label:institusjonens-id').toLowerCase() }
    }))
    hasErrors.push(checkIfNotEmpty(v, {
      needle: navn,
      id: `${namespace}-institusjon-navn`,
      message: 'validation:du-maa-fylle-ut',
      extra: { type: i18n.t('label:institusjonens-navn').toLowerCase() }
    }))
    hasErrors.push(checkLength(v, {
      needle: navn,
      id: `${namespace}-institusjon-navn`,
      max: 155,
      message: 'validation:textOverX'
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
