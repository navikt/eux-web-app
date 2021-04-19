import { Epost, Telefon } from 'declarations/sed'
import { Validation } from 'declarations/types'
import _ from 'lodash'
import { FeiloppsummeringFeil } from 'nav-frontend-skjema'

export const validateKontaktsinformasjonTelefon = (
  v: Validation,
  telefon: Telefon | {type: any, nummer: any},
  index: number,
  t: any,
  namespace: string,
  personName: string
): void => {
  let generalFail: boolean = false

  let value = (!_.isEmpty(telefon.type))
    ? undefined
    : {
      feilmelding: t('message:validation-noTelephoneTypeForPerson', { person: personName }),
      skjemaelementId: 'c-' + namespace + (index < 0 ? '' : '[' + index + ']') + '-type-text'
    } as FeiloppsummeringFeil
  v[namespace + (index < 0 ? '' : '[' + index + ']') + '-type'] = value
  if (value) {
    generalFail = true
  }

  value = (!_.isEmpty(telefon.nummer))
    ? undefined
    : {
      feilmelding: t('message:validation-noTelephoneNumberForPerson', { person: personName }),
      skjemaelementId: 'c-' + namespace + (index < 0 ? '' : '[' + index + ']') + '-nummer-text'
    } as FeiloppsummeringFeil
  v[namespace + (index < 0 ? '' : '[' + index + ']') + '-nummer'] = value
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
  epost: Epost,
  index: number,
  t: any,
  namespace: string,
  personName: string
): void => {
  const emailPattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  let generalFail: boolean = false

  const value = !_.isEmpty(epost.adresse)
    ? (epost.adresse.match(emailPattern)
        ? undefined
        : {
          feilmelding: t('message:validation-invalidEpostForPerson', { person: personName }),
          skjemaelementId: 'c-' + namespace + (index < 0 ? '' : '[' + index + ']') + '-adresse-text'
        } as FeiloppsummeringFeil
      )
    : {
      feilmelding: t('message:validation-noEpostForPerson', { person: personName }),
      skjemaelementId: 'c-' + namespace + (index < 0 ? '' : '[' + index + ']') + '-adresse-text'
    } as FeiloppsummeringFeil

  v[namespace + '-adresse'] = value

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
  telefoner: Array<Telefon>,
  t: any,
  namespace: string,
  personName: string
): void => {
  telefoner?.forEach((telefon: Telefon, index: number) => {
    validateKontaktsinformasjonTelefon(validation, telefon, index, t, namespace, personName)
  })
}

export const validateKontaktsinformasjonEposter = (
  validation: Validation,
  eposter: Array<Epost>,
  t: any,
  namespace: string,
  personName: string
): void => {
  eposter?.forEach((epost: Epost, index: number) => {
    validateKontaktsinformasjonEpost(validation, epost, index, t, namespace, personName)
  })
}
