import { validatePeriode } from 'components/Forms/validation'
import { FamilieRelasjon } from 'declarations/sed'
import { Validation } from 'declarations/types'
import { getIdx } from 'utils/namespace'
import { checkIfDuplicate, checkIfNotEmpty } from 'utils/validation'

export interface ValidationFamilierelasjonProps {
  familierelasjon: FamilieRelasjon | undefined
  familierelasjoner: Array<FamilieRelasjon> | undefined
  index?: number
  personName?: string
}

export interface ValidationFamilierelasjonerProps {
  familierelasjoner: Array<FamilieRelasjon> | undefined
  personName?: string
}

export const validateFamilierelasjon = (
  v: Validation,
  namespace: string,
  {
    familierelasjon,
    familierelasjoner,
    index,
    personName
  }: ValidationFamilierelasjonProps
): boolean => {
  const hasErrors: Array<boolean> = []
  const idx = getIdx(index)

  hasErrors.push(checkIfNotEmpty(v, {
    needle: familierelasjon?.relasjonType,
    personName,
    id: namespace + idx + '-relasjonType',
    message: 'validation:noRelation'
  }))

  hasErrors.push(validatePeriode(v, namespace + idx + '-periode', {
    periode: familierelasjon?.periode,
    mandatoryStartdato: false,
    personName
  }))

  if (familierelasjon?.relasjonType !== 'annet') {
    hasErrors.push(checkIfDuplicate(v, {
      needle: familierelasjon,
      haystack: familierelasjoner,
      index,
      matchFn: (f: FamilieRelasjon) => f.relasjonType === familierelasjon?.relasjonType && f?.periode?.startdato === familierelasjon?.periode.startdato,
      id: namespace + idx + '-relasjonType',
      message: 'validation:duplicateRelation'
    }))
  }
  return hasErrors.find(value => value) !== undefined
}

export const validateFamilierelasjoner = (
  validation: Validation,
  namespace: string,
  {
    familierelasjoner,
    personName
  }: ValidationFamilierelasjonerProps
): boolean => {
  const hasErrors: Array<boolean> = []
  familierelasjoner?.forEach((familierelasjon: FamilieRelasjon, index: number) => {
    hasErrors.push(validateFamilierelasjon(validation, namespace, {
      familierelasjon,
      familierelasjoner,
      index,
      personName
    }))
  })
  return hasErrors.find(value => value) !== undefined
}
