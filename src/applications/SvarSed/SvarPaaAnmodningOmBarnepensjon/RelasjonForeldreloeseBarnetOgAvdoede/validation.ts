import { validatePeriode } from 'components/Forms/validation'
import {RelasjonBarn, SvarYtelseTilForeldreloese_V42, SvarYtelseTilForeldreloese_V43} from 'declarations/sed'
import { Validation } from 'declarations/types'
import { getIdx } from 'utils/namespace'
import {checkIfDuplicate, checkIfNotEmpty, checkLength} from 'utils/validation'
import {ValidationYtelseTilForeldreloeseProps} from "../validation";

export interface ValidationRelasjonProps {
  relasjon: RelasjonBarn | undefined
  relasjoner: Array<RelasjonBarn> | undefined
  index?: number
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
    needle: relasjon?.typeRelasjon,
    id: namespace + idx + '-type-relasjon',
    message: 'validation:noRelation'
  }))

  hasErrors.push(checkIfNotEmpty(v, {
    needle: relasjon?.relasjonTilPerson,
    id: namespace + idx + '-relasjon-til-person',
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
    matchFn: (r: RelasjonBarn) => r.typeRelasjon === relasjon?.typeRelasjon && r?.periode?.startdato === relasjon?.periode?.startdato,
    id: namespace + idx + '-type-relasjon',
    message: 'validation:duplicateRelation'
  }))


  return hasErrors.find(value => value) !== undefined
}

export const validateRelasjoner = (
  validation: Validation,
  namespace: string,
  {
    svarYtelseTilForeldreloese,
    CDM_VERSJON
  }: ValidationYtelseTilForeldreloeseProps
): boolean => {
  const hasErrors: Array<boolean> = []

  if(CDM_VERSJON === "4.3"){
    const relasjoner = (svarYtelseTilForeldreloese as SvarYtelseTilForeldreloese_V43)?.barnet?.relasjoner
    relasjoner?.forEach((relasjon: RelasjonBarn, index: number) => {
      hasErrors.push(validateRelasjon(validation, namespace, {
        relasjon,
        relasjoner,
        index
      }))
    })
  } else {
    const relasjonTilAvdoedeFritekst = (svarYtelseTilForeldreloese as SvarYtelseTilForeldreloese_V42)?.barnet?.relasjontilavdoedefritekst
    hasErrors.push(checkLength(validation, {
      needle: relasjonTilAvdoedeFritekst,
      max: 500,
      id: namespace + '-barnet-relasjoner',
      message: 'validation:textOverX'
    }))
  }

  return hasErrors.find(value => value) !== undefined
}
