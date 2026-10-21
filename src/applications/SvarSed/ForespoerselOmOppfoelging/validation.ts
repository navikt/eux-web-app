import { JaNei, ReplySed } from 'declarations/sed'
import { Validation } from 'declarations/types'
import { U010Sed } from 'declarations/u010'
import i18n from 'i18n'
import { checkIfNotEmpty } from 'utils/validation'

export interface ValidationForespoerselOmOppfoelgingProps {
  replySed: ReplySed
}

export const validateForespoerselOmOppfoelging = (
  v: Validation,
  namespace: string,
  { replySed }: ValidationForespoerselOmOppfoelgingProps
): boolean => {
  const oenskerOppfoelging: JaNei | undefined = (replySed as U010Sed).oenskerOppfoelging
  return checkIfNotEmpty(v, {
    needle: oenskerOppfoelging,
    id: `${namespace}-oenskerOppfoelging`,
    message: 'validation:du-maa-fylle-ut',
    extra: { type: i18n.t('label:u010-oensker-oppfoelging-field') }
  })
}
