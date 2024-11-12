import { validatePeriode } from 'components/Forms/validation'
import {RelasjonAnnenPerson} from 'declarations/sed'
import { Validation } from 'declarations/types'
import { getIdx } from 'utils/namespace'
import { checkIfDuplicate, checkIfNotEmpty } from 'utils/validation'

export interface ValidationRelasjonProps {
  relasjon: RelasjonAnnenPerson | undefined
  relasjoner: Array<RelasjonAnnenPerson> | undefined
  index?: number
}

export interface ValidationRelasjonerProps {
  relasjoner: Array<RelasjonAnnenPerson> | undefined
}

export const validateRelasjon = (
  v: Validation,
  namespace: string,
  {
    relasjon,
    relasjoner,
    index
  }: ValidationRelasjonProps
): boolean => {
  const hasErrors: Array<boolean> = []
  const idx = getIdx(index)

  hasErrors.push(checkIfNotEmpty(v, {
    needle: relasjon?.familierelasjonstype,
    id: namespace + idx + '-type-relasjon',
    message: 'validation:noRelation'
  }))

  hasErrors.push(validatePeriode(v, namespace + idx + '-periode', {
    periode: relasjon?.periode,
    mandatoryStartdato: false,
  }))

  hasErrors.push(checkIfDuplicate(v, {
    needle: relasjon,
    haystack: relasjoner,
    index,
    matchFn: (r: RelasjonAnnenPerson) => r.familierelasjonstype === relasjon?.familierelasjonstype && r?.periode?.startdato === relasjon?.periode?.startdato,
    id: namespace + idx + '-type-relasjon',
    message: 'validation:duplicateRelation'
  }))


  return hasErrors.find(value => value) !== undefined
}

export const validateRelasjoner = (
  validation: Validation,
  namespace: string,
  {
    relasjoner
  }: ValidationRelasjonerProps
): boolean => {
  const hasErrors: Array<boolean> = []
  relasjoner?.forEach((relasjon: RelasjonAnnenPerson, index: number) => {
    hasErrors.push(validateRelasjon(validation, namespace, {
      relasjon,
      relasjoner,
      index
    }))
  })
  return hasErrors.find(value => value) !== undefined
}
