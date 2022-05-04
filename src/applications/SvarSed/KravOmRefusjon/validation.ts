import { Validation } from 'declarations/types'
import _ from 'lodash'
import { checkIfNotEmpty, checkLength } from 'utils/validation'

interface ValidateKravOmRefusjonProps {
  kravOmRefusjon: string | undefined,
  formalName: string
}

export const validateKravOmRefusjon = (
  v: Validation,
  namespace: string,
  {
    kravOmRefusjon,
    formalName
  }: ValidateKravOmRefusjonProps
): boolean => {
  const hasErrors: Array<boolean> = []

  hasErrors.push(checkIfNotEmpty(v, {
    needle: kravOmRefusjon,
    id: namespace + '-krav',
    message: 'validation:noKrav',
    personName: formalName
  }))

  if (!_.isEmpty(kravOmRefusjon?.trim())) {
    hasErrors.push(checkLength(v, {
      needle: kravOmRefusjon,
      max: 500,
      id: namespace + '-krav',
      message: 'validation:textOverX',
      personName: formalName
    }))
  }

  return hasErrors.find(value => value) !== undefined
}
