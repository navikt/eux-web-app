import { validatePeriode } from 'components/Forms/validation'
import { FamilieRelasjon } from 'declarations/sed'
import { Validation } from 'declarations/types'

import _ from "lodash";
import {checkIfNotEmpty} from "../../../utils/validation";

export interface ValidationFamilierelasjonProps {
  familierelasjon: FamilieRelasjon | undefined
  personName?: string
}


export const validateFamilierelasjon = (
  v: Validation,
  namespace: string,
  {
    familierelasjon,
    personName
  }: ValidationFamilierelasjonProps
): boolean => {
  const hasErrors: Array<boolean> = []

  if (familierelasjon?.periode && (familierelasjon?.periode.startdato || familierelasjon?.periode.sluttdato)) {
    hasErrors.push(checkIfNotEmpty(v, {
      needle: familierelasjon?.forelderType,
      personName,
      id: namespace + '-forelderType',
      message: 'validation:noRelation'
    }))

  }

  if (!_.isEmpty(familierelasjon?.forelderType) || (familierelasjon?.periode && familierelasjon?.periode.sluttdato)) {
    hasErrors.push(validatePeriode(v, namespace + '-periode', {
      periode: familierelasjon?.periode,
      mandatoryStartdato: true,
      personName
    }))
  }


  return hasErrors.find(value => value) !== undefined
}
