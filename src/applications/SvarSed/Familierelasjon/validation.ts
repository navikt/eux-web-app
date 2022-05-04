import { validatePeriode } from 'components/Forms/validation'
import { FamilieRelasjon } from 'declarations/sed'
import { Validation } from 'declarations/types'
import { ErrorElement } from 'declarations/app.d'
import { getIdx } from 'utils/namespace'

export interface ValidationFamilierelasjonProps {
  familierelasjon: FamilieRelasjon
  index?: number
  namespace: string
  personName?: string
}

export const validateFamilierelasjon = (
  v: Validation,
  {
    familierelasjon,
    index,
    namespace,
    personName
  }: ValidationFamilierelasjonProps
): boolean => {
  let hasErrors: boolean = false
  const idx = getIdx(index)

  const periodErrors : boolean = validatePeriode(v, {
    periode: familierelasjon.periode,
    namespace: namespace + idx + '-periode',
    mandatoryStartdato: false,
    personName
  })
  hasErrors = hasErrors || periodErrors

  if (hasErrors) {
    const namespaceBits = namespace.split('-')
    const mainNamespace = namespaceBits[0]
    const personNamespace = mainNamespace + '-' + namespaceBits[1]
    const categoryNamespace = personNamespace + '-' + namespaceBits[2]
    v[mainNamespace] = { feilmelding: 'error', skjemaelementId: '' } as ErrorElement
    v[personNamespace] = { feilmelding: 'error', skjemaelementId: '' } as ErrorElement
    v[categoryNamespace] = { feilmelding: 'error', skjemaelementId: '' } as ErrorElement
  }
  return hasErrors
}

interface ValidateFamilierelasjonerProps {
  familierelasjoner: Array<FamilieRelasjon>
  namespace: string
  personName?: string
}

export const validateFamilierelasjoner = (
  validation: Validation,
  {
    familierelasjoner,
    namespace,
    personName
  }: ValidateFamilierelasjonerProps
): boolean => {
  let hasErrors: boolean = false
  familierelasjoner?.forEach((familierelasjon: FamilieRelasjon, index: number) => {
    const _errors : boolean = validateFamilierelasjon(validation, {
      familierelasjon,
      index,
      namespace,
      personName
    })
    hasErrors = hasErrors || _errors
  })
  return hasErrors
}
