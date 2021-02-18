import { Epost, Telefon } from 'declarations/sed'
import { Validation } from 'declarations/types'
import _ from 'lodash'
import { FeiloppsummeringFeil } from 'nav-frontend-skjema'

export const validateKontaktsinformasjon = (v: Validation, t: any, options: any, personID: string): void => {
  let personFail = false
  let kontakinformasjonFail = false
  const p = _.get(options.replySed, personID)
  const personName = p.personInfo.fornavn + ' ' + p.personInfo.etternavn

  p.telefon?.forEach((_t: Telefon, i: number) => {
    let value = (_t.type)
      ? undefined
      : {
        feilmelding: t('ui:validation-noTelefonType', { person: personName }),
        skjemaelementId: 'c-familymanager-' + personID + '-kontaktinformasjon-' + i + '-type-select'
      } as FeiloppsummeringFeil
    v['person-' + personID + '-kontaktinformasjon-' + i + '-type'] = value
    if (value) {
      personFail = true
      kontakinformasjonFail = true
    }

    value = (_t.nummer)
      ? undefined
      : {
        feilmelding: t('ui:validation-noTelefonNummer', { person: personName }),
        skjemaelementId: 'c-familymanager-' + personID + '-kontaktinformasjon-' + i + '-nummer-input'
      } as FeiloppsummeringFeil
    v['person-' + personID + '-kontaktinformasjon-' + i + '-nummer'] = value
    if (value) {
      personFail = true
      kontakinformasjonFail = true
    }
  })

  const emailPattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

  p.epost?.forEach((e: Epost, i: number) => {
    const value = (e.adresse)
      ? (e.adresse.match(emailPattern)
          ? undefined
          : {
            feilmelding: t('ui:validation-invalidEpostAdresse', { person: personName }),
            skjemaelementId: 'c-familymanager-' + personID + '-kontaktinformasjon-' + i + '-epost-input'
          } as FeiloppsummeringFeil
        )
      : {
        feilmelding: t('ui:validation-noEpostAdresse', { person: personName }),
        skjemaelementId: 'c-familymanager-' + personID + '-kontaktinformasjon-' + i + '-epost-input'
      } as FeiloppsummeringFeil
    v['person-' + personID + '-kontaktinformasjon-' + i + '-epost'] = value

    if (value) {
      personFail = true
      kontakinformasjonFail = true
    }
  })

  v['person-' + personID + '-kontaktinformasjon'] = kontakinformasjonFail
    ? {
      feilmelding: 'notnull', skjemaelementId: ''
    } as FeiloppsummeringFeil
    : undefined

  v['person-' + personID] = personFail
    ? {
      feilmelding: 'notnull', skjemaelementId: ''
    } as FeiloppsummeringFeil
    : undefined
}
