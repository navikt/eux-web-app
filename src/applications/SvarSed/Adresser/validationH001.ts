import {Adresse, AdresseType, AnmodningMeldingType} from 'declarations/sed'
import { Validation } from 'declarations/types'
import {addError } from 'utils/validation'
import _ from "lodash";

export interface ValidationAdresserH001Props {
  adresser: Array<Adresse> | undefined
  adresseTyper: Array<AdresseType> | undefined

}

export const validateAdresserH001 = (
  validation: Validation,
  namespace: string,
  {
    adresser,
    adresseTyper
  }: ValidationAdresserH001Props
): boolean => {
  const hasErrors: Array<boolean> = []
  if (_.isEmpty(adresseTyper) && _.isEmpty(adresser)) {
    hasErrors.push(addError(validation, {
      id: namespace + '-ingenAdresse',
      message: 'validation:noAddress'
    }))
  }

  return hasErrors.find(value => value) !== undefined
}
