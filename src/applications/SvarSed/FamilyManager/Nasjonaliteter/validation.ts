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
): void => {
  let generalFail: boolean = false
  const idx = (index >= 0 ? '[' + index + ']' : '')
  let value: FeiloppsummeringFeil |undefined

  value = (!_.isEmpty(statsborgerskap.land))
    ? undefined
    : {
      feilmelding: t('message:validation-noBirthCountryForPerson', { person: personName }),
      skjemaelementId: 'c-' + namespace + idx + '-land-text'
    } as FeiloppsummeringFeil
  v[namespace + idx + '-land'] = value
  if (value) {
    generalFail = true
  }

  value = _.find(statsborgerskaper, s => s.land === statsborgerskap.land) === undefined
    ? undefined
    : {
      feilmelding: t('message:validation-duplicateBirthCountry'),
      skjemaelementId: 'c-' + namespace + idx + '-land-text'
    } as FeiloppsummeringFeil

  if (!v[namespace + idx + '-land']) {
    v[namespace + idx + '-land'] = value
  }
  if (value) {
    generalFail = true
  }

  value = (!_.isEmpty(statsborgerskap.fradato))
    ? undefined
    : {
      feilmelding: t('message:validation-noDateForPerson', { person: personName }),
      skjemaelementId: 'c-' + namespace + idx + '-fradato-date'
    } as FeiloppsummeringFeil
  v[namespace + idx + '-fradato'] = value
  if (value) {
    generalFail = true
  }

  if (!_.isEmpty(statsborgerskap.fradato)) {
    value = statsborgerskap.fradato!.match(datePattern)
      ? undefined
      : {
        feilmelding: t('message:validation-invalidDateForPerson', { person: personName }),
        skjemaelementId: 'c-' + namespace + idx + '-fradato-date'
      } as FeiloppsummeringFeil

    if (!v[namespace + idx + '-fradato']) {
      v[namespace + idx + '-fradato'] = value
    }
    if (value) {
      generalFail = true
    }
  }

  if (generalFail) {
    const namespaceBits = namespace.split('-')
    namespaceBits[0] = 'person'
    const personNamespace = namespaceBits[0] + '-' + namespaceBits[1]
    const categoryNamespace = namespaceBits.join('-')
    v[personNamespace] = { feilmelding: 'notnull', skjemaelementId: '' } as FeiloppsummeringFeil
    v[categoryNamespace] = { feilmelding: 'notnull', skjemaelementId: '' } as FeiloppsummeringFeil
  }
}

export const validateNasjonaliteter = (
  validation: Validation,
  t: TFunction,
  statsborgerskaper: Array<Statsborgerskap>,
  namespace: string,
  personName: string
): void => {
  statsborgerskaper?.forEach((statsborgerskap: Statsborgerskap, index: number) => {
    validateNasjonalitet(validation, t, { statsborgerskap, statsborgerskaper, index, namespace, personName })
  })
}
