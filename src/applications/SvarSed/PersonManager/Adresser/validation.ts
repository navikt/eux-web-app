import { Adresse } from 'declarations/sed'
import { Validation } from 'declarations/types'
import _ from 'lodash'
import { FeiloppsummeringFeil } from 'nav-frontend-skjema'
import { TFunction } from 'react-i18next'
import { getIdx } from 'utils/namespace'

export interface ValidationAddressProps {
  adresse: Adresse
  index?: number
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
  const idx = getIdx(index)

  if (_.isEmpty(adresse?.type?.trim())) {
    v[namespace + idx + '-type'] = {
      feilmelding: t('message:validation-noAddressTypeTil', { person: personName }),
      skjemaelementId: namespace + idx + '-type'
    } as FeiloppsummeringFeil
    hasErrors = true
  }

  if (_.isEmpty(adresse?.land?.trim())) {
    v[namespace + idx + '-land'] = {
      feilmelding: t('message:validation-noAddressCountryTil', { person: personName }),
      skjemaelementId: namespace + idx + '-land'
    } as FeiloppsummeringFeil
    hasErrors = true
  }

  if (_.isEmpty(adresse?.gate?.trim())) {
    v[namespace + idx + '-gate'] = {
      feilmelding: t('message:validation-noAddressStreetTil', { person: personName }),
      skjemaelementId: namespace + idx + '-gate'
    } as FeiloppsummeringFeil
    hasErrors = true
  }

  if (_.isEmpty(adresse?.postnummer?.trim())) {
    v[namespace + idx + '-postnummer'] = {
      feilmelding: t('message:validation-noAddressPostnummerTil', { person: personName }),
      skjemaelementId: namespace + idx + '-postnummer'
    } as FeiloppsummeringFeil
    hasErrors = true
  }

  if (_.isEmpty(adresse?.by?.trim())) {
    v[namespace + idx + '-by'] = {
      feilmelding: t('message:validation-noAddressCityTil', { person: personName }),
      skjemaelementId: namespace + idx + '-by'
    } as FeiloppsummeringFeil
    hasErrors = true
  }

  if (hasErrors) {
    const namespaceBits = namespace.split('-')
    const mainNamespace = namespaceBits[0]
    const personNamespace = mainNamespace + '-' + namespaceBits[1]
    const categoryNamespace = personNamespace + '-' + namespaceBits[2]
    v[mainNamespace] = { feilmelding: 'notnull', skjemaelementId: '' } as FeiloppsummeringFeil
    v[personNamespace] = { feilmelding: 'notnull', skjemaelementId: '' } as FeiloppsummeringFeil
    v[categoryNamespace] = { feilmelding: 'notnull', skjemaelementId: '' } as FeiloppsummeringFeil
  }
  return hasErrors
}

interface ValidateVedtakProps {
  adresser: Array<Adresse>
  namespace: string
  personName: string
}

export const validateAdresser = (
  validation: Validation,
  t: TFunction,
  {
    adresser,
    namespace,
    personName
  }: ValidateVedtakProps
): boolean => {
  let hasErrors: boolean = false
  adresser?.forEach((adresse: Adresse, index: number) => {
    const _errors: boolean = validateAdresse(validation, t, {
      adresse,
      index,
      namespace,
      personName
    })
    hasErrors = hasErrors || _errors
  })
  return hasErrors
}
