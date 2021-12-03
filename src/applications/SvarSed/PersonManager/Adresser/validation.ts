import { Adresse } from 'declarations/sed'
import { Validation } from 'declarations/types'
import _ from 'lodash'
import { ErrorElement } from 'declarations/app.d'
import { TFunction } from 'react-i18next'
import { getIdx } from 'utils/namespace'

export interface ValidationAddressProps {
  adresse: Adresse | undefined
  index?: number
  namespace: string
  personName: string
}

interface ValidateAdresserProps {
  adresser: Array<Adresse>
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
      feilmelding: t('validation:noAddressTypeTil', { person: personName }),
      skjemaelementId: namespace + idx + '-type'
    } as ErrorElement
    hasErrors = true
  }

  if (_.isEmpty(adresse?.land?.trim())) {
    v[namespace + idx + '-land'] = {
      feilmelding: t('validation:noAddressCountryTil', { person: personName }),
      skjemaelementId: namespace + idx + '-land'
    } as ErrorElement
    hasErrors = true
  }

  if (_.isEmpty(adresse?.by?.trim())) {
    v[namespace + idx + '-by'] = {
      feilmelding: t('validation:noAddressCityTil', { person: personName }),
      skjemaelementId: namespace + idx + '-by'
    } as ErrorElement
    hasErrors = true
  }

  if (hasErrors) {
    const namespaceBits = namespace.split('-')
    const mainNamespace = namespaceBits[0]
    const personNamespace = mainNamespace + '-' + namespaceBits[1]
    const categoryNamespace = personNamespace + '-' + namespaceBits[2]
    v[mainNamespace] = { feilmelding: 'notnull', skjemaelementId: '' } as ErrorElement
    v[personNamespace] = { feilmelding: 'notnull', skjemaelementId: '' } as ErrorElement
    v[categoryNamespace] = { feilmelding: 'notnull', skjemaelementId: '' } as ErrorElement
  }
  return hasErrors
}

export const validateAdresser = (
  validation: Validation,
  t: TFunction,
  {
    adresser,
    namespace,
    personName
  }: ValidateAdresserProps
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
