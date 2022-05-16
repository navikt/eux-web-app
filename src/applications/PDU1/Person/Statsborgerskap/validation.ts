import { Validation } from 'declarations/types'
import { getIdx } from 'utils/namespace'
import { checkIfDuplicate, checkIfNotEmpty } from 'utils/validation'

export interface ValidationStatsborgerskapProps {
  statsborgerskap: string | undefined
  statsborgerskaper: Array<string> | undefined
  index?: number
}

export interface ValidationStatsborgerskaperProps {
  statsborgerskaper: Array<string> | undefined
}

export const validateStatsborgerskap = (
  v: Validation,
  namespace: string,
  {
    statsborgerskap,
    statsborgerskaper,
    index
  }: ValidationStatsborgerskapProps
): boolean => {
  const hasErrors: Array<boolean> = []
  const idx = getIdx(index)

  hasErrors.push(checkIfNotEmpty(v, {
    needle: statsborgerskap,
    id: namespace + idx + '-statsborgerskap',
    message: 'validation:noBirthCountry'
  }))

  hasErrors.push(checkIfDuplicate(v, {
    needle: statsborgerskaper,
    haystack: statsborgerskaper,
    matchFn: (s: string) => (s === statsborgerskap),
    index,
    id: namespace + idx + '-statsborgerskap',
    message: 'validation:duplicateBirthCountry'
  }))

  return hasErrors.find(value => value) !== undefined
}

export const validateStatsborgerskaper = (
  validation: Validation,
  namespace: string,
  {
    statsborgerskaper
  }: ValidationStatsborgerskaperProps
): boolean => {
  const hasErrors: Array<boolean> = statsborgerskaper?.map((statsborgerskap: string, index: number) =>
    validateStatsborgerskap(validation, namespace, { statsborgerskap, statsborgerskaper, index })
  ) ?? []
  return hasErrors.find(value => value) !== undefined
}
