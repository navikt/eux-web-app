import { validatePeriode } from 'components/Forms/validation'
import { RettTilYtelse } from 'declarations/sed'
import { Validation } from 'declarations/types'

export interface ValidationvalidateRettTilYtelseProps {
  rettTilTytelse: RettTilYtelse | undefined
}

export const validateRettTilYtelse = (
  v: Validation,
  namespace: string,
  {
    rettTilTytelse
  }: ValidationvalidateRettTilYtelseProps
): boolean => {
  const hasErrors: Array<boolean> = []

  if (rettTilTytelse?.periode) {
    hasErrors.push(validatePeriode(v, namespace + '-periode', {
      periode: rettTilTytelse.periode
    }))
  }

  return hasErrors.find(value => value) !== undefined
}
