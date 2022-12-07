import { Statsborgerskap } from 'declarations/sed'
import { Validation } from 'declarations/types'
import { getIdx } from 'utils/namespace'
import { checkIfDuplicate, checkIfNotDate, checkIfNotEmpty } from 'utils/validation'

export interface ValidationNasjonalitetProps {
  statsborgerskap: Statsborgerskap | undefined
  statsborgerskaper: Array<Statsborgerskap> | undefined
  index?: number
  personName?: string
}

export interface ValidationNasjonaliteterProps {
  statsborgerskaper: Array<Statsborgerskap> | undefined
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

  hasErrors.push(checkIfDuplicate(v, {
    needle: statsborgerskap,
    haystack: statsborgerskaper,
    matchFn: (s: Statsborgerskap) => s.land === statsborgerskap?.land,
    id: namespace + idx + '-land',
    index,
    message: 'validation:duplicateBirthCountry',
    personName
  }))

  return hasErrors.find(value => value) !== undefined
}

export const validateNasjonaliteter = (
  validation: Validation,
  namespace: string,
  {
    statsborgerskaper,
    personName
  }: ValidationNasjonaliteterProps
): boolean => {
  const hasErrors: Array<boolean> = []
  statsborgerskaper?.forEach((statsborgerskap: Statsborgerskap, index: number) => {
    hasErrors.push(validateNasjonalitet(validation, namespace, { statsborgerskap, statsborgerskaper, index, personName }))
  })
  return hasErrors.find(value => value) !== undefined
}
