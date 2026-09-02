import { ReplySed } from 'declarations/sed'
import { U013Sed } from 'declarations/u013'
import { Validation } from 'declarations/types'
import i18n from 'i18n'
import { checkIfNotEmpty, checkLength } from 'utils/validation'

export interface ValidationRegistrertPersonProps {
  replySed: ReplySed
}

export const validateRegistrertPerson = (
  v: Validation,
  namespace: string,
  { replySed }: ValidationRegistrertPersonProps
): boolean => {
  const registrertPerson = (replySed as U013Sed).registrertPerson
  const hasErrors: Array<boolean> = [
    checkIfNotEmpty(v, {
      needle: registrertPerson?.overholdtProsedyrer,
      id: `${namespace}-overholdtProsedyrer`,
      message: 'validation:du-maa-fylle-ut',
      extra: { type: i18n.t('label:u013-overholdt-prosedyrer-field') }
    }),
    checkLength(v, {
      needle: registrertPerson?.ytterligereInfo,
      id: `${namespace}-ytterligereInfo`,
      max: 500,
      message: 'validation:textOverX'
    })
  ]

  if (registrertPerson?.overholdtProsedyrer === 'nei') {
    hasErrors.push(checkIfNotEmpty(v, {
      needle: registrertPerson.somRapportertIU10,
      id: `${namespace}-somRapportertIU10`,
      message: 'validation:du-maa-fylle-ut',
      extra: { type: i18n.t('label:u013-som-rapportert-i-u010-field') }
    }))
  }

  return hasErrors.some(Boolean)
}
