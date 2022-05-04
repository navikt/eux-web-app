import { Statsborgerskap } from 'declarations/sed'
import { Validation } from 'declarations/types'
import _ from 'lodash'
import { getIdx } from 'utils/namespace'
import { checkIfDuplicate, checkIfNotDate, checkIfNotEmpty } from 'utils/validation'

export interface ValidationNasjonalitetProps {
  statsborgerskap: Statsborgerskap
  statsborgerskaper: Array<Statsborgerskap>
  index?: number
  personName?: string
}

export const validateNasjonalitet = (
  v: Validation,
  namespace: string,
  {
    statsborgerskap,
    statsborgerskaper,
    index,
    personName
  }: ValidationNasjonalitetProps
): boolean => {
  const hasErrors: Array<boolean> = []
  const idx = getIdx(index)

  hasErrors.push(checkIfNotEmpty(v, {
    needle: statsborgerskap?.land,
    id: namespace + idx + '-land',
    message: 'validation:noBirthCountry',
    personName
  }))

  if (!_.isEmpty(statsborgerskaper)) {
    hasErrors.push(checkIfDuplicate(v, {
      needle: statsborgerskap,
      haystack: statsborgerskaper,
      matchFn: (s: Statsborgerskap) => s.land === statsborgerskap.land,
      id: namespace + idx + '-land',
      message: 'validation:duplicateBirthCountry',
      personName
    }))
  }

  hasErrors.push(checkIfNotDate(v, {
    needle: statsborgerskap?.fraDato,
    id: namespace + idx + '-fraDato',
    message: 'validation:invalidDate',
    personName
  }))

  return hasErrors.find(value => value) !== undefined
}

interface ValidateNasjonaliteterProps {
  statsborgerskaper: Array<Statsborgerskap>
  personName?: string
}

export const validateNasjonaliteter = (
  validation: Validation,
  namespace: string,
  {
    statsborgerskaper,
    personName
  }: ValidateNasjonaliteterProps
): boolean => {
  const hasErrors: Array<boolean> = []
  statsborgerskaper?.forEach((statsborgerskap: Statsborgerskap, index: number) => {
    hasErrors.push(validateNasjonalitet(validation, namespace, { statsborgerskap, statsborgerskaper, index, personName }))
  })
  return hasErrors.find(value => value) !== undefined
}
