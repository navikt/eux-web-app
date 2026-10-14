import { Validation } from 'declarations/types'
import { U010Sed } from 'declarations/u010'
import { ReplySed } from 'declarations/sed'
import { validatePeriode } from 'components/Forms/validation'
import i18n from 'i18n'
import { checkIfNotEmpty, checkLength } from 'utils/validation'

export const ANDRE_OMSTENDIGHETER = 'andre_omstendigheter'
export const ANDRE_OMSTENDIGHETER_MAX_LENGTH = 255

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

  if (omstendigheter?.typer?.includes(ANDRE_OMSTENDIGHETER)) {
    const andreOmstendigheter = omstendigheter.andreOmstendigheter?.length ? omstendigheter.andreOmstendigheter : ['']
    andreOmstendigheter.forEach((annenOmstendighet, index) => {
      hasErrors.push(checkIfNotEmpty(v, {
        needle: annenOmstendighet,
        id: `${namespace}-andreOmstendigheter-${index}`,
        message: 'validation:du-maa-fylle-ut',
        extra: { type: i18n.t('label:u010-annen-omstendighet-field') }
      }))
      hasErrors.push(checkLength(v, {
        needle: annenOmstendighet,
        id: `${namespace}-andreOmstendigheter-${index}`,
        max: ANDRE_OMSTENDIGHETER_MAX_LENGTH,
        message: 'validation:textOverX'
      }))
    })
  }

  return hasErrors.some(Boolean)
}
