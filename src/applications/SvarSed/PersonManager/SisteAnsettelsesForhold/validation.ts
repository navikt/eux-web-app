import { XXXSisteAnsettelsesForhold } from 'declarations/sed'
import { Validation } from 'declarations/types'
import { TFunction } from 'react-i18next'

export interface ValidationSisteAnsettelsesforholdProps {
  sisteansettelsesforhold: XXXSisteAnsettelsesForhold
  namespace: string
  personName: string
}

export const validateSisteansettelsesforhold = (
  v: Validation,
  t: TFunction,
  {
    sisteansettelsesforhold,
    namespace,
    personName
  }: ValidationSisteAnsettelsesforholdProps
): boolean => {
  const hasErrors = true
  console.log(v, t, sisteansettelsesforhold, namespace, personName)
  return hasErrors
}
