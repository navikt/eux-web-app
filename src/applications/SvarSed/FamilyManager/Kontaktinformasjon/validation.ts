import { Epost, Telefon } from 'declarations/sed'
import { Validation } from 'declarations/types'
import _ from 'lodash'
import { FeiloppsummeringFeil } from 'nav-frontend-skjema'
import { TFunction } from 'react-i18next'

export interface ValidationKontaktsinformasjonTelefonProps {
  telefon: Telefon | {type: any, nummer: any}
  index: number
  namespace: string
  personName: string
}

export interface ValidationKontaktsinformasjonEpostProps {
  epost: Epost,
  index: number
  namespace: string
  personName: string
}

const emailPattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

export const validateKontaktsinformasjonTelefon = (
  v: Validation,
  t: TFunction,
  {
    telefon,
    index,
    namespace,
    personName
  }: ValidationKontaktsinformasjonTelefonProps
): boolean => {
  let hasErrors: boolean = false
  const idx = (index < 0 ? '' : '[' + index + ']')

  if (_.isEmpty(telefon.type)) {
    v[namespace + idx + '-type'] = {
      feilmelding: t('message:validation-noTelephoneTypeForPerson', { person: personName }),
      skjemaelementId: 'c-' + namespace + idx + '-type-text'
    } as FeiloppsummeringFeil
    hasErrors = true
  }

  if (_.isEmpty(telefon.nummer)) {
    v[namespace + idx + '-nummer'] = {
      feilmelding: t('message:validation-noTelephoneNumberForPerson', { person: personName }),
      skjemaelementId: 'c-' + namespace + idx + '-nummer-text'
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

export const validateKontaktsinformasjonEpost = (
  v: Validation,
  t: TFunction,
  {
    epost,
    index,
    namespace,
    personName
  }: ValidationKontaktsinformasjonEpostProps
): boolean => {
  let hasErrors: boolean = false
  const idx = (index < 0 ? '' : '[' + index + ']')

  if (!_.isEmpty(epost.adresse)) {
    if (!epost.adresse.match(emailPattern)) {
      v[namespace + idx + '-adresse'] = {
        feilmelding: t('message:validation-invalidEpostForPerson', { person: personName }),
        skjemaelementId: 'c-' + namespace + idx + '-adresse-text'
      } as FeiloppsummeringFeil
      hasErrors = true
    }
  } else {
    v[namespace + idx + '-adresse'] = {
      feilmelding: t('message:validation-noEpostForPerson', { person: personName }),
      skjemaelementId: 'c-' + namespace + idx + '-adresse-text'
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

export const validateKontaktsinformasjonTelefoner = (
  validation: Validation,
  t: TFunction,
  telefoner: Array<Telefon>,
  namespace: string,
  personName: string
): boolean => {
  let hasErrors: boolean = false
  telefoner?.forEach((telefon: Telefon, index: number) => {
    hasErrors = hasErrors && validateKontaktsinformasjonTelefon(validation, t, { telefon, index, namespace, personName })
  })
  return hasErrors
}

export const validateKontaktsinformasjonEposter = (
  validation: Validation,
  t: TFunction,
  eposter: Array<Epost>,
  namespace: string,
  personName: string
): boolean => {
  let hasErrors: boolean = false
  eposter?.forEach((epost: Epost, index: number) => {
    hasErrors = hasErrors && validateKontaktsinformasjonEpost(validation, t, { epost, index, namespace, personName })
  })
  return hasErrors
}
