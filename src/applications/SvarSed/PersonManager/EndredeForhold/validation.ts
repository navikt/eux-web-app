import { H001YtterligereInfo } from 'declarations/sed'
import { Validation } from 'declarations/types'
import { TFunction } from 'react-i18next'
import { checkIfNotEmpty, checkLength, propagateError } from 'utils/validation'

export interface ValidationEndredeForholdProps {
  ytterligereInfo: H001YtterligereInfo
  namespace: string,
  personName: string
}

export const validateEndredeForhold = (
  v: Validation,
  t: TFunction,
  {
    ytterligereInfo,
    namespace,
    personName
  }: ValidationEndredeForholdProps
): boolean => {
  const hasErrors: Array<boolean> = []

  hasErrors.push(checkIfNotEmpty(v, {
    needle: ytterligereInfo.velg,
    id: namespace + '-velg',
    message: 'validation:noVelg',
    personName
  }))

  hasErrors.push(checkLength(v, {
    needle: ytterligereInfo.tekst,
    max: 500,
    id: namespace + '-tekst',
    message: 'validation:textOverX',
    personName
  }))

  const hasError: boolean = hasErrors.find(value => value) !== undefined
  if (hasError) propagateError(v, namespace)
  return hasError
}
