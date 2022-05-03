import { Validation } from 'declarations/types'
import { TFunction } from 'react-i18next'
import { getIdx } from 'utils/namespace'
import { checkIfDuplicate, checkIfNotEmpty } from 'utils/validation'

export interface ValidationStatsborgerskapProps {
  statsborgerskap: string | undefined
  statsborgerskaper: Array<string> |undefined
  index?: number
  namespace: string
}

export const validateStatsborgerskap = (
  v: Validation,
  t: TFunction,
  {
    statsborgerskap,
    statsborgerskaper,
    index,
    namespace
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

interface ValidateStatsborgerskaperProps {
  statsborgerskaper: Array<string> | undefined
  namespace: string
}

export const validateStatsborgerskaper = (
  validation: Validation,
  t: TFunction,
  {
    statsborgerskaper,
    namespace
  }: ValidateStatsborgerskaperProps
): boolean => {
  const hasErrors: Array<boolean> = statsborgerskaper?.map((statsborgerskap: string, index: number) =>
    validateStatsborgerskap(validation, t, { statsborgerskap, statsborgerskaper, index, namespace })
  ) ?? []
  return hasErrors.find(value => value) !== undefined
}
