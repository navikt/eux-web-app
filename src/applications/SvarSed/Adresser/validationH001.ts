import { Adresse } from 'declarations/sed'
import { Validation } from 'declarations/types'
import {addError } from 'utils/validation'
import _ from "lodash";

export interface ValidationAdresserH001Props {
  adresser: Array<Adresse> | undefined
}

export const validateAdresserH001 = (
  validation: Validation,
  namespace: string,
  {
    adresser
  }: ValidationAdresserH001Props
): boolean => {
  const hasErrors: Array<boolean> = []
  if (_.isEmpty(adresser)) {
    hasErrors.push(addError(validation, {
      id: namespace,
      message: 'validation:noAddresss'
    }))
  }

  return hasErrors.find(value => value) !== undefined
}
