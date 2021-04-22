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
): void => {
  let value: FeiloppsummeringFeil | undefined
  let generalFail: boolean = false
  const idx = (index < 0 ? '' : '[' + index + ']')

  value = (!_.isEmpty(telefon.type))
    ? undefined
    : {
      feilmelding: t('message:validation-noTelephoneTypeForPerson', { person: personName }),
      skjemaelementId: 'c-' + namespace + idx + '-type-text'
    } as FeiloppsummeringFeil
  v[namespace + idx + '-type'] = value
  if (value) {
    generalFail = true
  }

  value = (!_.isEmpty(telefon.nummer))
    ? undefined
    : {
      feilmelding: t('message:validation-noTelephoneNumberForPerson', { person: personName }),
      skjemaelementId: 'c-' + namespace + idx + '-nummer-text'
    } as FeiloppsummeringFeil
  v[namespace + idx + '-nummer'] = value
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

export const validateKontaktsinformasjonEpost = (
  v: Validation,
  t: TFunction,
  {
    epost,
    index,
    namespace,
    personName
  }: ValidationKontaktsinformasjonEpostProps
): void => {
  let generalFail: boolean = false
  const idx = (index < 0 ? '' : '[' + index + ']')

  const value: FeiloppsummeringFeil | undefined = !_.isEmpty(epost.adresse)
    ? (epost.adresse.match(emailPattern)
        ? undefined
        : {
          feilmelding: t('message:validation-invalidEpostForPerson', { person: personName }),
          skjemaelementId: 'c-' + namespace + idx + '-adresse-text'
        } as FeiloppsummeringFeil
      )
    : {
      feilmelding: t('message:validation-noEpostForPerson', { person: personName }),
      skjemaelementId: 'c-' + namespace + idx + '-adresse-text'
    } as FeiloppsummeringFeil

  v[namespace + idx + '-adresse'] = value

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

export const validateKontaktsinformasjonTelefoner = (
  validation: Validation,
  t: TFunction,
  telefoner: Array<Telefon>,
  namespace: string,
  personName: string
): void => {
  telefoner?.forEach((telefon: Telefon, index: number) => {
    validateKontaktsinformasjonTelefon(validation, t, { telefon, index, namespace, personName })
  })
}

export const validateKontaktsinformasjonEposter = (
  validation: Validation,
  t: TFunction,
  eposter: Array<Epost>,
  namespace: string,
  personName: string
): void => {
  eposter?.forEach((epost: Epost, index: number) => {
    validateKontaktsinformasjonEpost(validation, t, { epost, index, namespace, personName })
  })
}
