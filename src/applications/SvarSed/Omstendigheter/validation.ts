import { Validation } from 'declarations/types'
import { U010Sed } from 'declarations/u010'
import { ReplySed } from 'declarations/sed'
import { validatePeriode } from 'components/Forms/validation'
import i18n from 'i18n'
import { checkIfNotEmpty, checkLength } from 'utils/validation'

export const ANDRE_OMSTENDIGHETER = 'andre_omstendigheter'
export const ANDRE_OMSTENDIGHETER_MAX_LENGTH = 255

export const harAndreOmstendigheterTekst = (andreOmstendigheter: Array<string> | undefined): boolean =>
  !!andreOmstendigheter?.some(annenOmstendighet => !!annenOmstendighet?.trim())

export interface ValidationOmstendigheterProps {
  replySed: ReplySed
}

export const validateOmstendigheter = (
  v: Validation,
  namespace: string,
  { replySed }: ValidationOmstendigheterProps
): boolean => {
  const omstendigheter = (replySed as U010Sed).omstendigheter
  const hasErrors: Array<boolean> = [
    validatePeriode(v, `${namespace}-periode`, {
      periode: omstendigheter?.periode,
      mandatoryStartdato: true,
      periodeType: 'withcheckbox'
    }),
    checkIfNotEmpty(v, {
      needle: omstendigheter?.typer,
      id: `${namespace}-typer`,
      message: 'validation:du-maa-fylle-ut',
      extra: { type: i18n.t('label:u010-omstendigheter-field') }
    })
  ]

  return hasErrors.some(Boolean)
}

export const validateAndreOmstendigheter = (
  v: Validation,
  namespace: string,
  { replySed }: ValidationOmstendigheterProps
): boolean => {
  const andreOmstendigheter = (replySed as U010Sed).omstendigheter?.andreOmstendigheter
  const hasErrors: Array<boolean> = []

  if (harAndreOmstendigheterTekst(andreOmstendigheter)) {
    andreOmstendigheter!.forEach((annenOmstendighet, index) => {
      hasErrors.push(checkIfNotEmpty(v, {
        needle: annenOmstendighet,
        id: `${namespace}-${index}`,
        message: 'validation:du-maa-fylle-ut',
        extra: { type: i18n.t('label:u010-annen-omstendighet-field') }
      }))
      hasErrors.push(checkLength(v, {
        needle: annenOmstendighet,
        id: `${namespace}-${index}`,
        max: ANDRE_OMSTENDIGHETER_MAX_LENGTH,
        message: 'validation:textOverX'
      }))
    })
  }

  return hasErrors.some(Boolean)
}
