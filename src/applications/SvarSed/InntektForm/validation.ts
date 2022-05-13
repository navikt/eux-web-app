import { validatePeriode } from 'components/Forms/validation'
import { Loennsopplysning } from 'declarations/sed'
import { Validation } from 'declarations/types'
import _ from 'lodash'
import { getIdx } from 'utils/namespace'
import { checkIfDuplicate, checkIfNotEmpty } from 'utils/validation'

export interface ValidationLoennsopplysningerProps {
  loennsopplysninger: Array<Loennsopplysning> | undefined
  personName ?: string
}

export interface ValidationLoennsopplysningProps {
  loennsopplysning: Loennsopplysning | undefined
  loennsopplysninger: Array<Loennsopplysning> | undefined
  index?: number
  personName ?: string
}

export const validateLoennsopplysning = (
  v: Validation,
  namespace: string,
  {
    loennsopplysning,
    loennsopplysninger,
    index,
    personName
  }: ValidationLoennsopplysningProps
): boolean => {
  const hasErrors: Array<boolean> = []
  const idx = getIdx(index)

  hasErrors.push(validatePeriode(v, namespace + '-periode', {
    periode: loennsopplysning?.periode,
    personName
  }))

  if (!_.isEmpty(loennsopplysning?.periode?.startdato)) {
    hasErrors.push(checkIfDuplicate(v, {
      needle: loennsopplysning,
      haystack: loennsopplysninger,
      matchFn: (l: Loennsopplysning) => (l.periode.startdato === loennsopplysning?.periode.startdato && l.periode.sluttdato === loennsopplysning.periode?.sluttdato),
      index,
      id: namespace + idx + '-startdato',
      message: 'validation:duplicateStartdato',
      personName
    }))
  }

  hasErrors.push(checkIfNotEmpty(v, {
    needle: loennsopplysning?.periodetype,
    id: namespace + idx + '-periodetype',
    message: 'validation:noPeriodeType',
    personName
  }))

  return hasErrors.find(value => value) !== undefined
}

export const validateLoennsopplysninger = (
  validation: Validation,
  namespace: string,
  {
    loennsopplysninger,
    personName
  }: ValidationLoennsopplysningerProps
): boolean => {
  const hasErrors: Array<boolean> = []
  loennsopplysninger?.forEach((loennsopplysning: Loennsopplysning, index: number) => {
    hasErrors.push(validateLoennsopplysning(validation, namespace, {
      loennsopplysning,
      loennsopplysninger: loennsopplysninger!,
      index,
      personName
    }))
  })
  return hasErrors.find(value => value) !== undefined
}
