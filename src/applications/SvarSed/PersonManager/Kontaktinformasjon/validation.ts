import { Epost, Telefon } from 'declarations/sed'
import { Validation } from 'declarations/types'
import _ from 'lodash'
import { FeiloppsummeringFeil } from 'nav-frontend-skjema'
import { TFunction } from 'react-i18next'
import { getIdx } from 'utils/namespace'

export interface ValidationKontaktsinformasjonTelefonProps {
  telefon: Telefon
  telefoner: Array<Telefon>
  index?: number
  namespace: string
  personName: string
}

export interface ValidationKontaktsinformasjonEpostProps {
  epost: Epost,
  eposter: Array<Epost>,
  index?: number
  namespace: string
  personName: string
}

const emailPattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

export const validateKontaktsinformasjonTelefon = (
  v: Validation,
  t: TFunction,
  {
    telefon,
    telefoner,
    index,
    namespace,
    personName
  }: ValidationKontaktsinformasjonTelefonProps
): boolean => {
  let hasErrors: boolean = false
  const idx = getIdx(index)

  if (_.isEmpty(telefon?.type?.trim())) {
    v[namespace + idx + '-type'] = {
      feilmelding: t('message:validation-noTelephoneTypeForPerson', { person: personName }),
      skjemaelementId: namespace + idx + '-type'
    } as FeiloppsummeringFeil
    hasErrors = true
  }

  if (_.isEmpty(telefon?.nummer?.trim())) {
    v[namespace + idx + '-nummer'] = {
      feilmelding: t('message:validation-noTelephoneNumberForPerson', { person: personName }),
      skjemaelementId: namespace + idx + '-nummer'
    } as FeiloppsummeringFeil
    hasErrors = true
  }
  let duplicate: boolean
  if (_.isNil(index)) {
    duplicate = _.find(telefoner, t => t.nummer === telefon.nummer) !== undefined
  } else {
    const otherTelefoner: Array<Telefon> = _.filter(telefoner, (t, i) => i !== index)
    duplicate = _.find(otherTelefoner, t => t.nummer === telefon.nummer) !== undefined
  }
  if (duplicate) {
    v[namespace + idx + '-nummer'] = {
      feilmelding: t('message:validation-duplicateTelephoneNumberForPerson', { person: personName }),
      skjemaelementId: namespace + idx + '-nummer'
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

export const validateKontaktsinformasjonEpost = (
  v: Validation,
  t: TFunction,
  {
    epost,
    eposter,
    index,
    namespace,
    personName
  }: ValidationKontaktsinformasjonEpostProps
): boolean => {
  let hasErrors: boolean = false
  const idx = getIdx(index)

  if (!_.isEmpty(epost?.adresse?.trim())) {
    if (!epost.adresse.trim().match(emailPattern)) {
      v[namespace + idx + '-adresse'] = {
        feilmelding: t('message:validation-invalidEpostForPerson', { person: personName }),
        skjemaelementId: namespace + idx + '-adresse'
      } as FeiloppsummeringFeil
      hasErrors = true
    }
  } else {
    v[namespace + idx + '-adresse'] = {
      feilmelding: t('message:validation-noEpostForPerson', { person: personName }),
      skjemaelementId: namespace + idx + '-adresse'
    } as FeiloppsummeringFeil
    hasErrors = true
  }

  let duplicate: boolean
  if (_.isNil(index)) {
    duplicate = _.find(eposter, e => e.adresse === epost?.adresse) !== undefined
  } else {
    const otherEposter: Array<Epost> = _.filter(eposter, (e, i) => i !== index)
    duplicate = _.find(otherEposter, e => e.adresse === epost?.adresse) !== undefined
  }
  if (duplicate) {
    v[namespace + idx + '-adresse'] = {
      feilmelding: t('message:validation-duplicateTelephoneNumberForPerson', { person: personName }),
      skjemaelementId: namespace + idx + '-adresse'
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

export const validateKontaktsinformasjonTelefoner = (
  validation: Validation,
  t: TFunction,
  telefoner: Array<Telefon>,
  namespace: string,
  personName: string
): boolean => {
  let hasErrors: boolean = false
  telefoner?.forEach((telefon: Telefon, index: number) => {
    const _error: boolean = validateKontaktsinformasjonTelefon(validation, t, { telefon, telefoner, index, namespace, personName })
    hasErrors = hasErrors || _error
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
    const _error: boolean = validateKontaktsinformasjonEpost(validation, t, { epost, eposter, index, namespace, personName })
    hasErrors = hasErrors || _error
  })
  return hasErrors
}
