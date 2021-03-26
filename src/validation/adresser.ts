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
): void => {
  let generalFail: boolean = false
  let value = (adresse.land)
    ? undefined
    : {
      feilmelding: t('message:validation-noAddressCountryForPerson', { person: personName }),
      skjemaelementId: 'c-' + namespace + (index < 0 ? '' : '[' + index + ']') + '-land-text'
    } as FeiloppsummeringFeil

  v[namespace + (index < 0 ? '' : '[' + index + ']') + '-land'] = value
  if (value) {
    generalFail = true
  }
  value = (adresse.gate)
    ? undefined
    : {
      feilmelding: t('message:validation-noAddressStreetForPerson', { person: personName }),
      skjemaelementId: 'c-' + namespace + (index < 0 ? '' : '[' + index + ']') + '-gate-text'
    } as FeiloppsummeringFeil

  v[namespace + (index < 0 ? '' : '[' + index + ']') + '-gate'] = value
  if (value) {
    generalFail = true
  }
  value = (adresse.postnummer)
    ? undefined
    : {
      feilmelding: t('message:validation-noAddressPostnummerForPerson', { person: personName }),
      skjemaelementId: 'c-' + namespace + (index < 0 ? '' : '[' + index + ']') + '-postnummer-text'
    } as FeiloppsummeringFeil

  v[namespace + (index < 0 ? '' : '[' + index + ']') + '-postnummer'] = value
  if (value) {
    generalFail = true
  }
  value = (adresse.by)
    ? undefined
    : {
      feilmelding: t('message:validation-noAddressCityForPerson', { person: personName }),
      skjemaelementId: 'c-' + namespace + (index < 0 ? '' : '[' + index + ']') + '-by-text'
    } as FeiloppsummeringFeil

  v[namespace + (index < 0 ? '' : '[' + index + ']') + '-by'] = value
  if (value) {
    generalFail = true
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
