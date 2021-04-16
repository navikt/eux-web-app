import { Statsborgerskap } from 'declarations/sed'
import { Validation } from 'declarations/types'
import _ from 'lodash'
import { FeiloppsummeringFeil } from 'nav-frontend-skjema'

export const validateNasjonalitet = (
  v: Validation,
  statsborgerskap: Statsborgerskap,
  statsborgerskaper: Array<Statsborgerskap>,
  index: number,
  t: any,
  namespace: string,
  personName: string
): void => {
  let generalFail: boolean = false

  let value = (!_.isEmpty(statsborgerskap.land))
    ? undefined
    : {
      feilmelding: t('message:validation-noBirthCountryForPerson', { person: personName }),
      skjemaelementId: 'c-' + namespace + (index < 0 ? '' : '[' + index + ']') + '-land-text'
    } as FeiloppsummeringFeil
  v[namespace + (index < 0 ? '' : '[' + index + ']') + '-land'] = value
  if (value) {
    generalFail = true
  }

  value = _.find(statsborgerskaper, s => s.land === statsborgerskap.land) === undefined
    ? undefined
    : {
      feilmelding: t('message:validation-duplicateBirthCountry'),
      skjemaelementId: 'c-' + namespace + (index < 0 ? '' : '[' + index + ']') + '-land-text'
    } as FeiloppsummeringFeil

  if (!v[namespace + (index < 0 ? '' : '[' + index + ']') + '-land']) {
    v[namespace + (index < 0 ? '' : '[' + index + ']') + '-land'] = value
  }
  if (value) {
    generalFail = true
  }

  value = (!_.isEmpty(statsborgerskap.fradato))
    ? undefined
    : {
      feilmelding: t('message:validation-noDateForPerson', { person: personName }),
      skjemaelementId: 'c-' + namespace + (index < 0 ? '' : '[' + index + ']') + '-fradato-date'
    } as FeiloppsummeringFeil
  v[namespace + (index < 0 ? '' : '[' + index + ']') + '-fradato'] = value
  if (value) {
    generalFail = true
  }

  if (!_.isEmpty(statsborgerskap.fradato)) {
    value = statsborgerskap.fradato!.match(/\d{2}\.\d{2}\.\d{4}/)
      ? undefined
      : {
        feilmelding: t('message:validation-invalidDateForPerson', { person: personName }),
        skjemaelementId: 'c-' + namespace + (index < 0 ? '' : '[' + index + ']') + '-fradato-date'
      } as FeiloppsummeringFeil

    if (!v[namespace + (index < 0 ? '' : '[' + index + ']') + '-fradato']) {
      v[namespace + (index < 0 ? '' : '[' + index + ']') + '-fradato'] = value
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
  statsborgerskaper: Array<Statsborgerskap>,
  t: any,
  namespace: string,
  personName: string
): void => {
  statsborgerskaper?.forEach((statsborgerskap: Statsborgerskap, index: number) => {
    validateNasjonalitet(validation, statsborgerskap, statsborgerskaper, index, t, namespace, personName)
  })
}
