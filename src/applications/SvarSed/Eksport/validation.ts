import { ReplySed } from 'declarations/sed'
import { Validation } from 'declarations/types'
import { U008Sed } from 'declarations/u008'
import i18n from 'i18n'
import { checkIfNotEmpty, checkValidDateFormat } from 'utils/validation'

export interface ValidationEksportProps {
  replySed: ReplySed
}

export const validateEksport = (
  v: Validation,
  namespace: string,
  { replySed }: ValidationEksportProps
): boolean => {
  const sed = replySed as U008Sed
  const hasErrors: Array<boolean> = [
    checkIfNotEmpty(v, {
      needle: sed.erInnvilgetEksport,
      id: `${namespace}-erInnvilgetEksport`,
      message: 'validation:du-maa-fylle-ut',
      extra: { type: i18n.t('label:u008-er-innvilget-eksport-field') }
    })
  ]

  if (sed.erInnvilgetEksport === 'ja') {
    hasErrors.push(checkIfNotEmpty(v, {
      needle: sed.eksportperiode?.sisteMuligeSluttdato,
      id: `${namespace}-sisteMuligeSluttdato`,
      message: 'validation:du-maa-fylle-ut',
      extra: { type: i18n.t('label:u008-siste-mulige-sluttdato-field') }
    }))
    hasErrors.push(checkValidDateFormat(v, {
      needle: sed.eksportperiode?.sisteMuligeSluttdato,
      id: `${namespace}-sisteMuligeSluttdato`,
      message: 'validation:invalidDateFormat'
    }))
    hasErrors.push(checkValidDateFormat(v, {
      needle: sed.eksportperiode?.estimertSluttdato,
      id: `${namespace}-estimertSluttdato`,
      message: 'validation:invalidDateFormat'
    }))
  }

  return hasErrors.some(Boolean)
}
