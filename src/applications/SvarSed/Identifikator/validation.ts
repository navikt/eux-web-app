import { ArbeidsgiverIdentifikator } from 'declarations/sed'
import { Validation } from 'declarations/types'
import _ from 'lodash'
import { getIdx } from 'utils/namespace'
import { checkIfDuplicate, checkIfNotEmpty } from 'utils/validation'

export interface ValidationIdentifikatorProps {
  identifikatorer: Array<ArbeidsgiverIdentifikator> | undefined
  identifikator: ArbeidsgiverIdentifikator | undefined
  index?: number
  personName?: string
}

export interface ValidationIdentifikatorerProps {
  identifikatorer: Array<ArbeidsgiverIdentifikator> | undefined
  personName?: string
}

const getId = (it: ArbeidsgiverIdentifikator | null | undefined): string => it?.type + '-' + it?.id

export const validateIdentifikator = (
  v: Validation,
  namespace: string,
  {
    identifikatorer,
    identifikator,
    index,
    personName
  }: ValidationIdentifikatorProps
): boolean => {
  const hasErrors: Array<boolean> = []
  const idx = getIdx(index)

  hasErrors.push(checkIfNotEmpty(v, {
    needle: identifikator?.type,
    id: namespace + idx + '-type',
    message: 'validation:noType',
    personName
  }))

  hasErrors.push(checkIfNotEmpty(v, {
    needle: identifikator?.id,
    id: namespace + idx + '-id',
    message: 'validation:noId',
    personName
  }))

  if (!_.isEmpty(identifikator?.id) && _.isEmpty(identifikator?.type)) {
    hasErrors.push(checkIfDuplicate(v, {
      needle: identifikator,
      haystack: identifikatorer,
      matchFn: (id: ArbeidsgiverIdentifikator) => getId(id) === getId(identifikator),
      index,
      id: namespace + idx + '-id',
      message: 'validation:duplicateId'
    }))
  }

  return hasErrors.find(value => value) !== undefined
}

export const validateIdentifikatorer = (
  validation: Validation,
  namespace: string,
  {
    identifikatorer,
    personName
  }: ValidationIdentifikatorerProps
): boolean => {
  const hasErrors: Array<boolean> = []
  identifikatorer?.forEach((identifikator: ArbeidsgiverIdentifikator, index: number) => {
    hasErrors.push(validateIdentifikator(validation, namespace, {
      identifikator,
      identifikatorer,
      index,
      personName
    }))
  })
  return hasErrors.find(value => value) !== undefined
}
