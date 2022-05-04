import { Epost, Telefon } from 'declarations/sed'
import { Validation } from 'declarations/types'
import _ from 'lodash'
import { ErrorElement } from 'declarations/app.d'
import { getIdx } from 'utils/namespace'

export interface ValidationKontaktsinformasjonTelefonProps {
  telefon: Telefon
  telefoner: Array<Telefon>
  index?: number
  namespace: string
  personName?: string
}

export interface ValidationKontaktsinformasjonEpostProps {
  epost: Epost,
  eposter: Array<Epost>,
  index?: number
  namespace: string
  personName?: string
}

const emailPattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

export const validateKontaktsinformasjonTelefon = (
  v: Validation,
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
      feilmelding: t('validation:noTelephoneType') + (personName ? t('validation:til-person', { person: personName }) : ''),
      skjemaelementId: namespace + idx + '-type'
    } as ErrorElement
    hasErrors = true
  }

  if (_.isEmpty(telefon?.nummer?.trim())) {
    v[namespace + idx + '-nummer'] = {
      feilmelding: t('validation:noTelephoneNumber') + (personName ? t('validation:til-person', { person: personName }) : ''),
      skjemaelementId: namespace + idx + '-nummer'
    } as ErrorElement
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
      feilmelding: t('validation:duplicateTelephoneNumber') + (personName ? t('validation:til-person', { person: personName }) : ''),
      skjemaelementId: namespace + idx + '-nummer'
    } as ErrorElement
    hasErrors = true
  }

  if (hasErrors) {
    const namespaceBits = namespace.split('-')
    const mainNamespace = namespaceBits[0]
    const personNamespace = mainNamespace + '-' + namespaceBits[1]
    const categoryNamespace = personNamespace + '-' + namespaceBits[2]
    v[mainNamespace] = { feilmelding: 'error', skjemaelementId: '' } as ErrorElement
    v[personNamespace] = { feilmelding: 'error', skjemaelementId: '' } as ErrorElement
    v[categoryNamespace] = { feilmelding: 'error', skjemaelementId: '' } as ErrorElement
  }
  return hasErrors
}

export const validateKontaktsinformasjonEpost = (
  v: Validation,
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
        feilmelding: t('validation:invalidEpost') + (personName ? t('validation:til-person', { person: personName }) : ''),
        skjemaelementId: namespace + idx + '-adresse'
      } as ErrorElement
      hasErrors = true
    }
  } else {
    v[namespace + idx + '-adresse'] = {
      feilmelding: t('validation:noEpost') + (personName ? t('validation:til-person', { person: personName }) : ''),
      skjemaelementId: namespace + idx + '-adresse'
    } as ErrorElement
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
      feilmelding: t('validation:duplicateEpostAdresse') + (personName ? t('validation:til-person', { person: personName }) : ''),
      skjemaelementId: namespace + idx + '-adresse'
    } as ErrorElement
    hasErrors = true
  }

  if (hasErrors) {
    const namespaceBits = namespace.split('-')
    const mainNamespace = namespaceBits[0]
    const personNamespace = mainNamespace + '-' + namespaceBits[1]
    const categoryNamespace = personNamespace + '-' + namespaceBits[2]
    v[mainNamespace] = { feilmelding: 'error', skjemaelementId: '' } as ErrorElement
    v[personNamespace] = { feilmelding: 'error', skjemaelementId: '' } as ErrorElement
    v[categoryNamespace] = { feilmelding: 'error', skjemaelementId: '' } as ErrorElement
  }
  return hasErrors
}

interface ValidateTelefonerProps {
  telefoner: Array<Telefon>,
  namespace: string,
  personName?: string
}

export const validateKontaktsinformasjonTelefoner = (
  validation: Validation,
  {
    telefoner,
    namespace,
    personName
  }: ValidateTelefonerProps
): boolean => {
  let hasErrors: boolean = false
  telefoner?.forEach((telefon: Telefon, index: number) => {
    const _error: boolean = validateKontaktsinformasjonTelefon(validation, { telefon, telefoner, index, namespace, personName })
    hasErrors = hasErrors || _error
  })
  return hasErrors
}

interface ValidateEposterProps {
  eposter: Array<Epost>,
  namespace: string,
  personName?: string
}

export const validateKontaktsinformasjonEposter = (
  validation: Validation,
  {
    eposter,
    namespace,
    personName
  }: ValidateEposterProps
): boolean => {
  let hasErrors: boolean = false
  eposter?.forEach((epost: Epost, index: number) => {
    const _error: boolean = validateKontaktsinformasjonEpost(validation, { epost, eposter, index, namespace, personName })
    hasErrors = hasErrors || _error
  })
  return hasErrors
}
