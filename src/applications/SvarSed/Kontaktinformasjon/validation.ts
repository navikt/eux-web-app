import { Epost, Telefon } from 'declarations/sed'
import { Validation } from 'declarations/types'
import { getIdx } from 'utils/namespace'
import { checkIfDuplicate, checkIfNotEmail, checkIfNotEmpty } from 'utils/validation'

export interface ValidationKontaktsinformasjonTelefonProps {
  telefon: Telefon | undefined
  telefoner: Array<Telefon> | undefined
  index?: number
  personName?: string
}

export interface ValidationKontaktsinformasjonEpostProps {
  epost: Epost | undefined
  eposter: Array<Epost> | undefined
  index?: number
  personName?: string
}

export interface ValidateTelefonerProps {
  telefoner: Array<Telefon>,
  personName?: string
}

export interface ValidateEposterProps {
  eposter: Array<Epost>,
  personName?: string
}

export const validateKontaktsinformasjonTelefon = (
  v: Validation,
  namespace: string,
  {
    telefon,
    telefoner,
    index,
    personName
  }: ValidationKontaktsinformasjonTelefonProps
): boolean => {
  const hasErrors: Array<boolean> = []
  const idx = getIdx(index)

  hasErrors.push(checkIfNotEmpty(v, {
    needle: telefon?.type,
    id: namespace + idx + '-type',
    message: 'validation:noTelephoneType',
    personName
  }))

  hasErrors.push(checkIfNotEmpty(v, {
    needle: telefon?.nummer,
    id: namespace + idx + '-nummer',
    message: 'validation:noTelephoneNumber',
    personName
  }))

  hasErrors.push(checkIfDuplicate(v, {
    needle: telefon,
    haystack: telefoner,
    matchFn: (t: Telefon) => t.nummer === telefon?.nummer,
    id: namespace + idx + '-nummer',
    index,
    message: 'validation:duplicateTelephoneNumber',
    personName
  }))

  return hasErrors.find(value => value) !== undefined
}

export const validateKontaktsinformasjonEpost = (
  v: Validation,
  namespace: string,
  {
    epost,
    eposter,
    index,
    personName
  }: ValidationKontaktsinformasjonEpostProps
): boolean => {
  const hasErrors: Array<boolean> = []
  const idx = getIdx(index)

  hasErrors.push(checkIfNotEmpty(v, {
    needle: epost?.adresse,
    id: namespace + idx + '-adresse',
    message: 'validation:noEpost',
    personName
  }))

  hasErrors.push(checkIfNotEmail(v, {
    needle: epost?.adresse,
    id: namespace + idx + '-adresse',
    message: 'validation:invalidEpost',
    personName
  }))

  hasErrors.push(checkIfDuplicate(v, {
    needle: epost,
    haystack: eposter,
    matchFn: (e : Epost) => e.adresse === epost?.adresse,
    id: namespace + idx + '-adresse',
    index,
    message: 'validation:duplicateEpostAdresse',
    personName
  }))

  return hasErrors.find(value => value) !== undefined
}

export const validateKontaktsinformasjonTelefoner = (
  validation: Validation,
  namespace: string,
  {
    telefoner,
    personName
  }: ValidateTelefonerProps
): boolean => {
  const hasErrors: Array<boolean> = []
  telefoner?.forEach((telefon: Telefon, index: number) => {
    hasErrors.push(validateKontaktsinformasjonTelefon(validation, namespace, { telefon, telefoner, index, personName }))
  })
  return hasErrors.find(value => value) !== undefined
}

export const validateKontaktsinformasjonEposter = (
  validation: Validation,
  namespace: string,
  {
    eposter,
    personName
  }: ValidateEposterProps
): boolean => {
  const hasErrors: Array<boolean> = []
  eposter?.forEach((epost: Epost, index: number) => {
    hasErrors.push(validateKontaktsinformasjonEpost(validation, namespace, { epost, eposter, index, personName }))
  })
  return hasErrors.find(value => value) !== undefined
}
