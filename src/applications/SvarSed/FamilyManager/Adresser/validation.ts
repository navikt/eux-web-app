import { Adresse } from 'declarations/sed'
import { Validation } from 'declarations/types'
import _ from 'lodash'
import { FeiloppsummeringFeil } from 'nav-frontend-skjema'
import { TFunction } from 'react-i18next'

export interface ValidationAddressProps {
  adresse: Adresse
  index: number
  namespace: string
  personName: string
}

export const validateAdresse = (
  v: Validation,
  t: TFunction,
  {
    adresse,
    index,
    namespace,
    personName
  }: ValidationAddressProps
): boolean => {
  let hasErrors: boolean = false
  const idx = (index < 0 ? '' : '[' + index + ']')

  if (_.isEmpty(adresse.type)) {
    v[namespace + idx + '-type'] = {
      feilmelding: t('message:validation-noAddressTypeForPerson', { person: personName }),
      skjemaelementId: 'c-' + namespace + idx + '-type-text'
    } as FeiloppsummeringFeil
    hasErrors = true
  }

  if (_.isEmpty(adresse.land)) {
    v[namespace + idx + '-land'] = {
      feilmelding: t('message:validation-noAddressCountryForPerson', { person: personName }),
      skjemaelementId: 'c-' + namespace + idx + '-land-text'
    } as FeiloppsummeringFeil
    hasErrors = true
  }

  if (_.isEmpty(adresse.gate)) {
    v[namespace + idx + '-gate'] = {
      feilmelding: t('message:validation-noAddressStreetForPerson', { person: personName }),
      skjemaelementId: 'c-' + namespace + idx + '-gate-text'
    } as FeiloppsummeringFeil
    hasErrors = true
  }

  if (_.isEmpty(adresse.postnummer)) {
    v[namespace + idx + '-postnummer'] = {
      feilmelding: t('message:validation-noAddressPostnummerForPerson', { person: personName }),
      skjemaelementId: 'c-' + namespace + idx + '-postnummer-text'
    } as FeiloppsummeringFeil
    hasErrors = true
  }

  if (_.isEmpty(adresse.by)) {
    v[namespace + idx + '-by'] = {
      feilmelding: t('message:validation-noAddressCityForPerson', { person: personName }),
      skjemaelementId: 'c-' + namespace + idx + '-by-text'
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

export const validateAdresser = (
  validation: Validation,
  t: TFunction,
  adresser: Array<Adresse>,
  namespace: string,
  personName: string
): void => {
  adresser?.forEach((adresse: Adresse, index: number) => {
    validateAdresse(validation, t, {
      adresse,
      index,
      namespace,
      personName
    })
  })
}
