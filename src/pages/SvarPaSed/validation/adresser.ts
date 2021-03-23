import { Adresse } from 'declarations/sed'
import { Validation } from 'declarations/types'
import _ from 'lodash'
import { FeiloppsummeringFeil } from 'nav-frontend-skjema'

export const validateAdresser = (v: Validation, t: any, options: any, personID: string): void => {
  let personFail = false
  let adresserFail = false
  const p = _.get(options.replySed, personID)
  const personName = p.personInfo.fornavn + ' ' + p.personInfo.etternavn

  p.adresser?.forEach((a: Adresse, i: number) => {
    const value = (a.land)
      ? undefined
      : {
        feilmelding: t('message:validation-noAddressCountry', { person: personName }),
        skjemaelementId: 'c-familymanager-' + personID + '-adresser-' + i + '-land-countryselect'
      } as FeiloppsummeringFeil
    v['person-' + personID + '-adresser-' + i + '-land'] = value
    if (value) {
      personFail = true
      adresserFail = true
    }

    v['person-' + personID + '-adresser'] = adresserFail
      ? {
        feilmelding: 'notnull', skjemaelementId: ''
      } as FeiloppsummeringFeil
      : undefined

    v['person-' + personID] = personFail
      ? {
        feilmelding: 'notnull', skjemaelementId: ''
      } as FeiloppsummeringFeil
      : undefined
  })
}
