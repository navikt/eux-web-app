import { Validation } from 'declarations/types'
import _ from 'lodash'
import { ErrorElement } from 'declarations/app.d'
import { TFunction } from 'react-i18next'
import { getIdx } from 'utils/namespace'

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
  let hasErrors: boolean = false
  const idx = getIdx(index)

  if (_.isEmpty(statsborgerskap?.trim())) {
    v[namespace + idx + '-statsborgerskap'] = {
      feilmelding: t('validation:noBirthCountry'),
      skjemaelementId: namespace + idx + '-statsborgerskap'
    } as ErrorElement
    hasErrors = true
  }

  if (!_.isEmpty(statsborgerskaper)) {
    let duplicate: boolean
    if (_.isNil(index)) {
      duplicate = _.find(statsborgerskaper, s => s === statsborgerskap) !== undefined
    } else {
      const otherLands: Array<string> = _.filter(statsborgerskaper, (p, i) => i !== index)
      duplicate = _.find(otherLands, s => s === statsborgerskap) !== undefined
    }
    if (duplicate) {
      v[namespace + idx + '-statsborgerskap'] = {
        feilmelding: t('validation:duplicateBirthCountry'),
        skjemaelementId: namespace + idx + '-statsborgerskap'
      } as ErrorElement
      hasErrors = true
    }
  }

  if (hasErrors) {
    const namespaceBits = namespace.split('-')
    const mainNamespace = namespaceBits[0]
    const personNamespace = mainNamespace + '-' + namespaceBits[1]
    const categoryNamespace = personNamespace + '-' + namespaceBits[2]
    v[mainNamespace] = { feilmelding: 'notnull', skjemaelementId: '' } as ErrorElement
    v[personNamespace] = { feilmelding: 'notnull', skjemaelementId: '' } as ErrorElement
    v[categoryNamespace] = { feilmelding: 'notnull', skjemaelementId: '' } as ErrorElement
  }
  return hasErrors
}

interface ValidateStatsborgerskaperProps {
  statsborgerskaper: Array<string>
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
  let hasErrors: boolean = false
  statsborgerskaper?.forEach((statsborgerskap: string, index: number) => {
    const _error: boolean = validateStatsborgerskap(validation, t, { statsborgerskap, statsborgerskaper, index, namespace })
    hasErrors = hasErrors || _error
  })
  return hasErrors
}
