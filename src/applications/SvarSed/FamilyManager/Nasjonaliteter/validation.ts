import { Statsborgerskap } from 'declarations/sed'
import { Validation } from 'declarations/types'
import _ from 'lodash'
import { FeiloppsummeringFeil } from 'nav-frontend-skjema'
import { TFunction } from 'react-i18next'

export interface ValidationNasjonalitetProps {
  statsborgerskap: Statsborgerskap
  statsborgerskaper: Array<Statsborgerskap>
  index: number
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
  const idx = (index >= 0 ? '[' + index + ']' : '')

  if (_.isEmpty(statsborgerskap.land)) {
    v[namespace + idx + '-land'] = {
      feilmelding: t('message:validation-noBirthCountryForPerson', { person: personName }),
      skjemaelementId: 'c-' + namespace + idx + '-land-text'
    } as FeiloppsummeringFeil
    hasErrors = true
  }

  if (_.find(statsborgerskaper, s => s.land === statsborgerskap.land) !== undefined) {
    v[namespace + idx + '-land'] = {
      feilmelding: t('message:validation-duplicateBirthCountry'),
      skjemaelementId: 'c-' + namespace + idx + '-land-text'
    } as FeiloppsummeringFeil
    hasErrors = true
  }

  if (_.isEmpty(statsborgerskap.fradato)) {
    v[namespace + idx + '-fradato'] = {
      feilmelding: t('message:validation-noDateForPerson', { person: personName }),
      skjemaelementId: 'c-' + namespace + idx + '-fradato-date'
    } as FeiloppsummeringFeil
    hasErrors = true
  }

  if (!_.isEmpty(statsborgerskap.fradato) && !statsborgerskap.fradato!.match(datePattern)) {
    v[namespace + idx + '-fradato'] = {
      feilmelding: t('message:validation-invalidDateForPerson', { person: personName }),
      skjemaelementId: 'c-' + namespace + idx + '-fradato-date'
    } as FeiloppsummeringFeil
    hasErrors = true
  }

  if (hasErrors) {
    const namespaceBits = namespace.split('-')
    namespaceBits[0] = 'person'
    const personNamespace = namespaceBits[0] + '-' + namespaceBits[1]
    const categoryNamespace = namespaceBits.join('-')
    v[personNamespace] = { feilmelding: 'notnull', skjemaelementId: '' } as FeiloppsummeringFeil
    v[categoryNamespace] = { feilmelding: 'notnull', skjemaelementId: '' } as FeiloppsummeringFeil
  }
  return hasErrors
}

export const validateNasjonaliteter = (
  validation: Validation,
  t: TFunction,
  statsborgerskaper: Array<Statsborgerskap>,
  namespace: string,
  personName: string
): boolean => {
  let hasErrors: boolean = false
  statsborgerskaper?.forEach((statsborgerskap: Statsborgerskap, index: number) => {
    hasErrors = hasErrors && validateNasjonalitet(validation, t, { statsborgerskap, statsborgerskaper, index, namespace, personName })
  })
  return hasErrors
}
