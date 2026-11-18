import { Validation } from 'declarations/types'
import { U008Sed } from 'declarations/u008'
import { U010Sed } from 'declarations/u010'
import { ReplySed } from 'declarations/sed'
import { validatePeriode } from 'components/Forms/validation'
import i18n from 'i18n'
import { addError, checkIfNotEmpty, checkLength } from 'utils/validation'

export const ANDRE_HENDELSER = 'andre_omstendigheter'
export const INGEN_HENDELSER = 'ingen'
export const ANDRE_HENDELSER_MAX_LENGTH = 255

export const harAndreHendelserTekst = (andreHendelser: Array<string> | undefined): boolean =>
  !!andreHendelser?.some(annenHendelse => !!annenHendelse?.trim())

export interface ValidationHendelserProps {
  replySed: ReplySed
}

export const validateHendelser = (
  v: Validation,
  namespace: string,
  { replySed }: ValidationHendelserProps
): boolean => {
  const hendelser = (replySed as U010Sed | U008Sed).hendelser
  const typer: Array<string> | undefined = hendelser?.typer
  const hasErrors: Array<boolean> = []

  // U008 has no periode; U010 requires it
  if (replySed.sedType !== 'U008') {
    hasErrors.push(validatePeriode(v, `${namespace}-periode`, {
      periode: (hendelser as U010Sed['hendelser'])?.periode,
      mandatoryStartdato: true,
      periodeType: 'withcheckbox'
    }))
  }

  hasErrors.push(checkIfNotEmpty(v, {
    needle: typer,
    id: `${namespace}-typer`,
    message: 'validation:du-maa-fylle-ut',
    extra: { type: i18n.t('label:hendelser-field') }
  }))

  if (typer?.includes(INGEN_HENDELSER) && typer.length > 1) {
    hasErrors.push(addError(v, {
      id: `${namespace}-typer`,
      message: 'validation:u008-ingen-hendelser-kombinert'
    }))
  }

  return hasErrors.some(Boolean)
}

export const validateAndreHendelser = (
  v: Validation,
  namespace: string,
  { replySed }: ValidationHendelserProps
): boolean => {
  const andreHendelser = (replySed as U010Sed | U008Sed).hendelser?.andreHendelser
  const hasErrors: Array<boolean> = []

  if (harAndreHendelserTekst(andreHendelser)) {
    andreHendelser!.forEach((annenHendelse, index) => {
      hasErrors.push(checkIfNotEmpty(v, {
        needle: annenHendelse,
        id: `${namespace}-${index}`,
        message: 'validation:du-maa-fylle-ut',
        extra: { type: i18n.t('label:annen-hendelse-field') }
      }))
      hasErrors.push(checkLength(v, {
        needle: annenHendelse,
        id: `${namespace}-${index}`,
        max: ANDRE_HENDELSER_MAX_LENGTH,
        message: 'validation:textOverX'
      }))
    })
  }

  return hasErrors.some(Boolean)
}
