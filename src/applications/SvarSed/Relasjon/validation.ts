import { Barnetilhoerighet } from 'declarations/sed'
import { Validation } from 'declarations/types'
import { getIdx } from 'utils/namespace'
import { checkIfDuplicate, checkIfNotEmpty } from 'utils/validation'

export interface ValidationBarnetilhoerigheterProps {
  barnetilhoerigheter: Array<Barnetilhoerighet> | undefined
  personName?: string
}

export interface ValidationBarnetilhoerighetProps {
  barnetilhoerighet: Barnetilhoerighet | undefined,
  barnetilhoerigheter: Array<Barnetilhoerighet> | undefined,
  index?: number
  personName?: string
}

export const validateBarnetilhoerighet = (
  v: Validation,
  namespace: string,
  {
    barnetilhoerighet,
    barnetilhoerigheter,
    index,
    personName
  }: ValidationBarnetilhoerighetProps
): boolean => {
  const hasErrors: Array<boolean> = []
  const idx = getIdx(index)

  hasErrors.push(checkIfNotEmpty(v, {
    needle: barnetilhoerighet?.relasjonTilPerson,
    id: namespace + idx + '-relasjonTilPerson',
    message: 'validation:noRelation',
    personName
  }))

  hasErrors.push(checkIfDuplicate(v, {
    needle: barnetilhoerighet,
    haystack: barnetilhoerigheter,
    matchFn: (b: Barnetilhoerighet) => b.relasjonTilPerson === barnetilhoerighet?.relasjonTilPerson,
    id: namespace + idx + '-relasjonTilPerson',
    message: 'validation:duplicateRelation',
    index,
    personName
  }))

  hasErrors.push(checkIfNotEmpty(v, {
    needle: barnetilhoerighet?.relasjonType,
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
    barnetilhoerigheter,
    personName
  }: ValidationBarnetilhoerigheterProps
): boolean => {
  const hasErrors: Array<boolean> = []
  barnetilhoerigheter?.forEach((barnetilhoerighet: Barnetilhoerighet, index) => {
    hasErrors.push(validateBarnetilhoerighet(validation, namespace, { barnetilhoerighet, barnetilhoerigheter, index, personName }))
  })
  return hasErrors.find(value => value) !== undefined
}
