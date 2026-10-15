import { ReplySed } from 'declarations/sed'
import { Validation } from 'declarations/types'
import { U009Sed } from 'declarations/u009'
import i18n from 'i18n'
import { checkIfNotEmpty, checkValidDateFormat } from 'utils/validation'

export interface ValidationRegistreringProps {
  replySed: ReplySed
}

export const validateRegistrering = (
  v: Validation,
  namespace: string,
  { replySed }: ValidationRegistreringProps
): boolean => {
  const registreringsdato = (replySed as U009Sed).registreringsdato
  const hasErrors: Array<boolean> = [
    checkIfNotEmpty(v, {
      needle: registreringsdato,
      id: `${namespace}-registreringsdato`,
      message: 'validation:du-maa-fylle-ut',
      extra: { type: i18n.t('label:u009-registreringsdato-field') }
    }),
    checkValidDateFormat(v, {
      needle: registreringsdato,
      id: `${namespace}-registreringsdato`,
      message: 'validation:invalidDateFormat'
    })
  ]
  return hasErrors.some(Boolean)
}
