import { validatePeriode } from 'components/Forms/validation'
import { RettTilYtelse } from 'declarations/sed'
import { Validation } from 'declarations/types'
import { ErrorElement } from 'declarations/app.d'

export interface ValidationvalidateRettTilYtelseProps {
  rettTilTytelse: RettTilYtelse | undefined
  namespace: string
}

export const validateRettTilYtelse = (
  v: Validation,
  {
    rettTilTytelse,
    namespace
  }: ValidationvalidateRettTilYtelseProps
): boolean => {
  let hasErrors = false

  if (rettTilTytelse?.periode) {
    const _error = validatePeriode(v, {
      periode: rettTilTytelse.periode,
      namespace: namespace + '-periode'
    })
    hasErrors = hasErrors || _error
  }

  if (hasErrors) {
    const namespaceBits = namespace.split('-')
    const mainNamespace = namespaceBits[0]
    const personNamespace = mainNamespace + '-' + namespaceBits[1]
    const categoryNamespace = personNamespace + '-' + namespaceBits[2]
    v[mainNamespace] = { feilmelding: 'error', skjemaelementId: '' } as ErrorElement
    v[personNamespace] = { feilmelding: 'error', skjemaelementId: '' } as ErrorElement
    v[categoryNamespace] = { feilmelding: 'error', skjemaelementId: '' } as ErrorElement
  }

  return hasErrors
}
