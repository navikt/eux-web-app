import { Barnetilhoerighet } from 'declarations/sed'
import { Validation } from 'declarations/types'
import { getIdx } from 'utils/namespace'
import { checkIfDuplicate, checkIfNotEmpty } from 'utils/validation'

interface ValidadeBarnetilhoerigheterProps {
  barnetilhorigheter: Array<Barnetilhoerighet>
  personName?: string
}

export interface ValidationBarnetilhoerigheterProps {
  barnetilhorighet: Barnetilhoerighet,
  barnetilhorigheter: Array<Barnetilhoerighet>,
  index?: number
  personName?: string
}

export const validateBarnetilhoerighet = (
  v: Validation,
  namespace: string,
  {
    barnetilhorighet,
    barnetilhorigheter,
    index,
    personName
  }: ValidationBarnetilhoerigheterProps
): boolean => {
  const hasErrors: Array<boolean> = []
  const idx = getIdx(index)

  hasErrors.push(checkIfNotEmpty(v, {
    needle: barnetilhorighet.relasjonTilPerson,
    id: namespace + idx + '-relasjonTilPerson',
    message: 'validation:noRelation',
    personName
  }))

  hasErrors.push(checkIfDuplicate(v, {
    needle: barnetilhorighet,
    haystack: barnetilhorigheter,
    matchFn: (b: Barnetilhoerighet) => b.relasjonTilPerson === barnetilhorighet.relasjonTilPerson,
    id: namespace + idx + '-relasjonTilPerson',
    message: 'validation:duplicateRelation',
    index,
    personName
  }))

  hasErrors.push(checkIfNotEmpty(v, {
    needle: barnetilhorighet.relasjonType,
    id: namespace + idx + '-relasjonType',
    message: 'validation:noRelationType',
    personName
  }))

  return hasErrors.find(value => value) !== undefined
}

export const validateBarnetilhoerigheter = (
  validation: Validation,
  namespace: string,
  {
    barnetilhorigheter,
    personName
  }: ValidadeBarnetilhoerigheterProps
): boolean => {
  const hasErrors: Array<boolean> = []
  barnetilhorigheter?.forEach((barnetilhorighet: Barnetilhoerighet, index) => {
    hasErrors.push(validateBarnetilhoerighet(validation, namespace, { barnetilhorighet, barnetilhorigheter, index, personName }))
  })
  return hasErrors.find(value => value) !== undefined
}
