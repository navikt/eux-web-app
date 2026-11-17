import { Validation } from 'declarations/types'
import { U008Sed } from 'declarations/u008'
import { U010Sed } from 'declarations/u010'
import { ReplySed } from 'declarations/sed'
import { validatePeriode } from 'components/Forms/validation'
import i18n from 'i18n'
import { addError, checkIfNotEmpty, checkLength } from 'utils/validation'

export const ANDRE_OMSTENDIGHETER = 'andre_omstendigheter'
export const INGEN_OMSTENDIGHETER = 'ingen'
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
  const omstendigheter = (replySed as U010Sed | U008Sed).omstendigheter
  const typer: Array<string> | undefined = omstendigheter?.typer
  const hasErrors: Array<boolean> = []

  // U008 has no periode; U010 requires it
  if (replySed.sedType !== 'U008') {
    hasErrors.push(validatePeriode(v, `${namespace}-periode`, {
      periode: (omstendigheter as U010Sed['omstendigheter'])?.periode,
      mandatoryStartdato: true,
      periodeType: 'withcheckbox'
    }))
  }

  hasErrors.push(checkIfNotEmpty(v, {
    needle: typer,
    id: `${namespace}-typer`,
    message: 'validation:du-maa-fylle-ut',
    extra: { type: i18n.t('label:u010-omstendigheter-field') }
  }))

  if (typer?.includes(INGEN_OMSTENDIGHETER) && typer.length > 1) {
    hasErrors.push(addError(v, {
      id: `${namespace}-typer`,
      message: 'validation:u008-ingen-omstendigheter-kombinert'
    }))
  }

  return hasErrors.some(Boolean)
}

export const validateAndreOmstendigheter = (
  v: Validation,
  namespace: string,
  { replySed }: ValidationOmstendigheterProps
): boolean => {
  const andreOmstendigheter = (replySed as U010Sed | U008Sed).omstendigheter?.andreOmstendigheter
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
