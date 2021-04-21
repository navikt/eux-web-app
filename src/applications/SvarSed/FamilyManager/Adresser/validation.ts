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
): void => {
  let generalFail: boolean = false
  const idx = (index < 0 ? '' : '[' + index + ']')
  let value: FeiloppsummeringFeil | undefined

  value = (!_.isEmpty(adresse.type))
    ? undefined
    : {
      feilmelding: t('message:validation-noAddressTypeForPerson', { person: personName }),
      skjemaelementId: 'c-' + namespace + idx + '-type-text'
    } as FeiloppsummeringFeil

  v[namespace + idx + '-type'] = value
  if (value) {
    generalFail = true
  }

  value = (!_.isEmpty(adresse.land))
    ? undefined
    : {
      feilmelding: t('message:validation-noAddressCountryForPerson', { person: personName }),
      skjemaelementId: 'c-' + namespace + idx + '-land-text'
    } as FeiloppsummeringFeil

  v[namespace + idx + '-land'] = value
  if (value) {
    generalFail = true
  }
  value = (!_.isEmpty(adresse.gate))
    ? undefined
    : {
      feilmelding: t('message:validation-noAddressStreetForPerson', { person: personName }),
      skjemaelementId: 'c-' + namespace + idx + '-gate-text'
    } as FeiloppsummeringFeil

  v[namespace + idx + '-gate'] = value
  if (value) {
    generalFail = true
  }
  value = (!_.isEmpty(adresse.postnummer))
    ? undefined
    : {
      feilmelding: t('message:validation-noAddressPostnummerForPerson', { person: personName }),
      skjemaelementId: 'c-' + namespace + idx + '-postnummer-text'
    } as FeiloppsummeringFeil

  v[namespace + idx + '-postnummer'] = value
  if (value) {
    generalFail = true
  }
  value = (!_.isEmpty(adresse.by))
    ? undefined
    : {
      feilmelding: t('message:validation-noAddressCityForPerson', { person: personName }),
      skjemaelementId: 'c-' + namespace + idx + '-by-text'
    } as FeiloppsummeringFeil

  v[namespace + idx + '-by'] = value
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
