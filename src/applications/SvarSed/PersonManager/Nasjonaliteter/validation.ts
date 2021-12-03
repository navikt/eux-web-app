import { Statsborgerskap } from 'declarations/sed'
import { Validation } from 'declarations/types'
import _ from 'lodash'
import { ErrorElement } from 'declarations/app.d'
import { TFunction } from 'react-i18next'
import { getIdx } from 'utils/namespace'

export interface ValidationNasjonalitetProps {
  statsborgerskap: Statsborgerskap
  statsborgerskaper: Array<Statsborgerskap>
  index?: number
  namespace: string
  personName: string
}

const datePattern = /^\d{4}-\d{2}-\d{2}$/

export const validateNasjonalitet = (
  v: Validation,
  t: TFunction,
  {
    statsborgerskap,
    statsborgerskaper,
    index,
    namespace,
    personName
  }: ValidationNasjonalitetProps
): boolean => {
  let hasErrors: boolean = false
  const idx = getIdx(index)

  if (_.isEmpty(statsborgerskap?.land?.trim())) {
    v[namespace + idx + '-land'] = {
      feilmelding: t('validation:noBirthCountryTil', { person: personName }),
      skjemaelementId: namespace + idx + '-land'
    } as ErrorElement
    hasErrors = true
  }

  if (!_.isEmpty(statsborgerskaper)) {
    let duplicate: boolean
    if (_.isNil(index)) {
      duplicate = _.find(statsborgerskaper, s => s.land === statsborgerskap.land) !== undefined
    } else {
      const otherLands: Array<Statsborgerskap> = _.filter(statsborgerskaper, (p, i) => i !== index)
      duplicate = _.find(otherLands, s => s.land === statsborgerskap.land) !== undefined
    }
    if (duplicate) {
      v[namespace + idx + '-land'] = {
        feilmelding: t('validation:duplicateBirthCountry'),
        skjemaelementId: namespace + idx + '-land'
      } as ErrorElement
      hasErrors = true
    }
  }

  if (!_.isEmpty(statsborgerskap?.fraDato?.trim()) && !statsborgerskap.fraDato!.match(datePattern)) {
    v[namespace + idx + '-fraDato'] = {
      feilmelding: t('validation:invalidDateTil', { person: personName }),
      skjemaelementId: namespace + idx + '-fraDato'
    } as ErrorElement
    hasErrors = true
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

interface ValidateNasjonaliteterProps {
  statsborgerskaper: Array<Statsborgerskap>
  namespace: string
  personName: string
}

export const validateNasjonaliteter = (
  validation: Validation,
  t: TFunction,
  {
    statsborgerskaper,
    namespace,
    personName
  }: ValidateNasjonaliteterProps
): boolean => {
  let hasErrors: boolean = false
  statsborgerskaper?.forEach((statsborgerskap: Statsborgerskap, index: number) => {
    const _error: boolean = validateNasjonalitet(validation, t, { statsborgerskap, statsborgerskaper, index, namespace, personName })
    hasErrors = hasErrors || _error
  })
  return hasErrors
}
