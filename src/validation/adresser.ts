import { Adresse } from 'declarations/sed'
import { Validation } from 'declarations/types'
import { FeiloppsummeringFeil } from 'nav-frontend-skjema'

export const validateAdresse = (
  v: Validation,
  adresse: Adresse,
  index: number,
  t: any,
  namespace: string,
  personName: string
) => {

  let generalFail: boolean = false
  let value = (adresse.land) ? undefined : {
      feilmelding: t('message:validation-noAddressCountry', { person: personName }),
      skjemaelementId: 'c-' + namespace + (index < 0 ? '' : '[' + index + ']') + '-land-countryselect'
    } as FeiloppsummeringFeil

  v[namespace + (index < 0 ? '' : '[' + index + ']') + '-land'] = value
  if (value) {
    generalFail = true
  }
  value = (adresse.gate) ? undefined : {
    feilmelding: t('message:validation-noAddressStreet', { person: personName }),
    skjemaelementId: 'c-' + namespace + (index < 0 ? '' : '[' + index + ']') + '-gate-input'
  } as FeiloppsummeringFeil

  v[namespace + (index < 0 ? '' : '[' + index + ']') + '-gate'] = value
  if (value) {
    generalFail = true
  }
  value = (adresse.postnummer) ? undefined : {
    feilmelding: t('message:validation-noAddressPostnummer', { person: personName }),
    skjemaelementId: 'c-' + namespace + (index < 0 ? '' : '[' + index + ']') + '-postnummer-input'
  } as FeiloppsummeringFeil

  v[namespace + (index < 0 ? '' : '[' + index + ']') + '-postnummer'] = value
  if (value) {
    generalFail = true
  }
  value = (adresse.by) ? undefined : {
    feilmelding: t('message:validation-noAddressCity', { person: personName }),
    skjemaelementId: 'c-' + namespace + (index < 0 ? '' : '[' + index + ']') + '-by-input'
  } as FeiloppsummeringFeil

  v[namespace + (index < 0 ? '' : '[' + index + ']') + '-by'] = value
  if (value) {
    generalFail = true
  }

  if (generalFail) {
    let namespaceBits = namespace.split('-')
    namespaceBits[0] = 'person'
    let personNamespace =  namespaceBits[0]  + '-' +  namespaceBits[1]
    let categoryNamespace =  namespaceBits.join('-')
    v[personNamespace] = {feilmelding: 'notnull', skjemaelementId: ''} as FeiloppsummeringFeil
    v[categoryNamespace] = {feilmelding: 'notnull', skjemaelementId: ''} as FeiloppsummeringFeil
  }
}

export const validateAdresser = (
  validation: Validation,
  adresser: Array<Adresse>,
  t: any,
  namespace: string,
  personName: string
): void => {

  adresser?.forEach((adresse: Adresse, index: number) => {
    validateAdresse(validation, adresse, index, t, namespace, personName)
  })
}
