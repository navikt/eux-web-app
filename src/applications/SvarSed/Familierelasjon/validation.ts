import { validatePeriode } from 'components/Forms/validation'
import { FamilieRelasjon } from 'declarations/sed'
import { Validation } from 'declarations/types'
import { getIdx } from 'utils/namespace'

export interface ValidationFamilierelasjonProps {
  familierelasjon: FamilieRelasjon
  index?: number
  personName?: string
}

export const validateFamilierelasjon = (
  v: Validation,
  namespace: string,
  {
    familierelasjon,
    index,
    personName
  }: ValidationFamilierelasjonProps
): boolean => {
  const hasErrors: Array<boolean> = []
  const idx = getIdx(index)

  hasErrors.push(validatePeriode(v, namespace + idx + '-periode', {
    periode: familierelasjon.periode,
    mandatoryStartdato: false,
    personName
  }))

  return hasErrors.find(value => value) !== undefined
}

interface ValidateFamilierelasjonerProps {
  familierelasjoner: Array<FamilieRelasjon>
  personName?: string
}

export const validateFamilierelasjoner = (
  validation: Validation,
  namespace: string,
  {
    familierelasjoner,
    personName
  }: ValidateFamilierelasjonerProps
): boolean => {
  const hasErrors: Array<boolean> = []
  familierelasjoner?.forEach((familierelasjon: FamilieRelasjon, index: number) => {
    hasErrors.push(validateFamilierelasjon(validation, namespace, {
      familierelasjon,
      index,
      personName
    }))
  })
  return hasErrors.find(value => value) !== undefined
}
