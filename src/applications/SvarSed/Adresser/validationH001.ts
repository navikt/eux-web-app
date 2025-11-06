import {Adresse, AnmodningMeldingType} from 'declarations/sed'
import { Validation } from 'declarations/types'
import {addError } from 'utils/validation'
import _ from "lodash";

export interface ValidationAdresserH001Props {
  adresser: Array<Adresse> | undefined
  anmodningMeldingType: AnmodningMeldingType | undefined

}

export const validateAdresserH001 = (
  validation: Validation,
  namespace: string,
  {
    adresser,
    anmodningMeldingType
  }: ValidationAdresserH001Props
): boolean => {
  const hasErrors: Array<boolean> = []
  console.log("validationH001");
  console.log("anmodningMeldingType" + anmodningMeldingType);
  if (anmodningMeldingType === 'melding' && _.isEmpty(adresser)) {
    hasErrors.push(addError(validation, {
      id: namespace + '-ingenAdresse',
      message: 'validation:noAddress'
    }))
  }

  return hasErrors.find(value => value) !== undefined
}
