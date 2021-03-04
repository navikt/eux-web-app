import { FamilieRelasjon2 } from 'declarations/sed'
import { Validation } from 'declarations/types'
import _ from 'lodash'
import { FeiloppsummeringFeil } from 'nav-frontend-skjema'

export const validateFamilierelasjon = (v: Validation, t: any, options: any, personID: string): void => {
  let personFail = false
  let familierelasjonFail = false
  const p = _.get(options.replySed, personID)
  const personName = p.personInfo.fornavn + ' ' + p.personInfo.etternavn

  p.familierelasjon?.forEach((f: FamilieRelasjon2, i: number) => {
    const value = (f.periode.startdato)
      ? undefined
      : {
        feilmelding: t('ui:validation-noStartDato', { person: personName }),
        skjemaelementId: 'c-familymanager-' + personID + '-familierelasjon-' + i + '-startdato-input'
      } as FeiloppsummeringFeil
    v['person-' + personID + '-familierelasjon-' + i + '-startdato'] = value
    if (value) {
      personFail = true
      familierelasjonFail = true
    }

    v['person-' + personID + '-familierelasjon'] = familierelasjonFail
      ? {
        feilmelding: 'notnull', skjemaelementId: ''
      } as FeiloppsummeringFeil
      : undefined

    v['person-' + personID] = personFail
      ? {
        feilmelding: 'notnull', skjemaelementId: ''
      } as FeiloppsummeringFeil
      : undefined
  })
}
