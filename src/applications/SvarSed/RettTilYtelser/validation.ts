import { validatePeriode } from 'components/Forms/validation'
import { RettTilYtelse } from 'declarations/sed'
import { Validation } from 'declarations/types'

export interface ValidationRettTilYtelseProps {
  rettTilYtelse: RettTilYtelse | undefined
}

export const validateRettTilYtelse = (
  v: Validation,
  namespace: string,
  {
    rettTilYtelse
  }: ValidationRettTilYtelseProps
): boolean => {
  const hasErrors: Array<boolean> = []

  if (rettTilYtelse?.periode) {
    hasErrors.push(validatePeriode(v, namespace + '-periode', {
      periode: rettTilYtelse.periode
    }))
  }

  return hasErrors.find(value => value) !== undefined
}
