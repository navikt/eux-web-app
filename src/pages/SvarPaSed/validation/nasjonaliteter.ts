import { Statsborgerskap } from 'declarations/sed'
import { Validation } from 'declarations/types'
import _ from 'lodash'
import { FeiloppsummeringFeil } from 'nav-frontend-skjema'

export const validateNasjonaliteter = (v: Validation, t: any, options: any, personID: string): void => {
  let personFail = false
  let nasjonaliteterFail = false
  const p = _.get(options.replySed, personID)
  const personName = p.personInfo.fornavn + ' ' + p.personInfo.etternavn

  p.personInfo.statsborgerskap.forEach((s: Statsborgerskap, i: number) => {
    let value = (s.land)
      ? undefined
      : {
        feilmelding: t('ui:validation-noBirthCountry', { person: personName }),
        skjemaelementId: 'c-familymanager-' + personID + '-nasjonaliteter-' + i + '-land-countryselect'
      } as FeiloppsummeringFeil
    v['person-' + personID + '-nasjonaliteter-' + i + '-land'] = value
    if (value) {
      personFail = true
      nasjonaliteterFail = true
    }

    value = undefined
    if (s.fomdato && s.fomdato.length > 0) {
      value = s.fomdato.match(/\d{2}\.\d{2}\.\d{4}/)
        ? undefined
        : {
          feilmelding: t('ui:validation-invalidDate', { person: personName }),
          skjemaelementId: 'c-familymanager-' + personID + '-nasjonaliteter-' + i + '-fomdato-input'
        } as FeiloppsummeringFeil
    }
    v['person-' + personID + '-nasjonaliteter-' + i + '-fomdato'] = value
    if (value) {
      personFail = true
      nasjonaliteterFail = true
    }
  })

  v['person-' + personID + '-nasjonaliteter'] = nasjonaliteterFail
    ? {
      feilmelding: 'notnull', skjemaelementId: ''
    } as FeiloppsummeringFeil
    : undefined

  v['person-' + personID] = personFail
    ? {
      feilmelding: 'notnull', skjemaelementId: ''
    } as FeiloppsummeringFeil
    : undefined
}