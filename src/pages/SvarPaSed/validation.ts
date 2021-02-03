import { Validation } from 'declarations/types.d'
import _ from 'lodash'
import { FeiloppsummeringFeil } from 'nav-frontend-skjema'

export const validatePerson = (v: Validation, t: any, options: any, personID: string): void => {
  let personFail = false
  let personOpplysningFail = false
  const p = _.get(options.replySed, personID)
  const personName = p.personInfo.fornavn + ' ' + p.personInfo.etternavn

  let value = (p.personInfo.fornavn) ? undefined : {
    feilmelding: t('ui:validation-noFornavn', { person: personName }),
    skjemaelementId: 'c-familymanager-' + personID + '-personopplysninger-fornavn-input'
  } as FeiloppsummeringFeil
  v['person-' + personID + '-personopplysninger-fornavn'] = value
  if (value) {
    personFail = true
    personOpplysningFail = true
  }

  value = (p.personInfo.etternavn) ? undefined : {
    feilmelding: t('ui:validation-noEtternavn', { person: personName }),
    skjemaelementId: 'c-familymanager-' + personID + '-personopplysninger-etternavn-input'
  } as FeiloppsummeringFeil
  v['person-' + personID + '-personopplysninger-etternavn'] = value
  if (value) {
    personFail = true
    personOpplysningFail = true
  }

  value = (p.personInfo.foedselsdato) ? undefined : {
    feilmelding: t('ui:validation-noFodselsdato', { person: personName }),
    skjemaelementId: 'c-familymanager-' + personID + '-personopplysninger-foedselsdato-input'
  } as FeiloppsummeringFeil
  v['person-' + personID + '-personopplysninger-foedselsdato'] = value
  if (value) {
    personFail = true
    personOpplysningFail = true
  }

  value = (p.personInfo.kjoenn) ? undefined : {
    feilmelding: t('ui:validation-noKjoenn', { person: personName }),
    skjemaelementId: 'c-familymanager-' + personID + '-personopplysninger-kjoenn-radiogroup'
  } as FeiloppsummeringFeil
  v['person-' + personID + '-personopplysninger-kjoenn'] = value
  if (value) {
    personFail = true
    personOpplysningFail = true
  }

  if (_.get(options.replySed, `toDelete.${personID}.foedested.visible`)) {
    value = (p.personInfo.pinMangler.foedested.by) ? undefined : {
      feilmelding: t('ui:validation-noFoedestedBy', { person: personName }),
      skjemaelementId: 'c-familymanager-' + personID + '-personopplysninger-foedested-by-input'
    } as FeiloppsummeringFeil
    v['person-' + personID + '-personopplysninger-foedested-by'] = value
    if (value) {
      personFail = true
      personOpplysningFail = true
    }

    value = (p.personInfo.pinMangler.foedested.region) ? undefined : {
      feilmelding: t('ui:validation-noFoedestedRegion', { person: personName }),
      skjemaelementId: 'c-familymanager-' + personID + '-personopplysninger-foedested-region-input'
    } as FeiloppsummeringFeil
    v['person-' + personID + '-personopplysninger-foedested-region'] = value
    if (value) {
      personFail = true
      personOpplysningFail = true
    }

    value = (p.personInfo.pinMangler.foedested.land) ? undefined : {
      feilmelding: t('ui:validation-noFoedestedLand', { person: personName }),
      skjemaelementId: 'c-familymanager-' + personID + '-personopplysninger-foedested-land-countryselect'
    } as FeiloppsummeringFeil
    v['person-' + personID + '-personopplysninger-foedested-land'] = value
    if (value) {
      personFail = true
      personOpplysningFail = true
    }
  } else {
    delete v['person-' + p.fnr + '-personopplysninger-foedested-by']
    delete v['person-' + p.fnr + '-personopplysninger-foedested-region']
    delete v['person-' + p.fnr + '-personopplysninger-foedested-land']
  }

  v['person-' + personID + '-personopplysninger'] = personOpplysningFail ? {
    feilmelding: 'notnull', skjemaelementId: ''
  } as FeiloppsummeringFeil : undefined

  v['person-' + personID] = personFail ? {
    feilmelding: 'notnull', skjemaelementId: ''
  } as FeiloppsummeringFeil : undefined
}

export const validate = (options: any): Validation => {
  const v: Validation = {}
  const t = options.t
  // Step 2 form

  v.purpose = !_.isEmpty(options.purpose) ? undefined : {
    feilmelding: t('ui:validation-noPurpose'),
    skjemaelementId: 'c-purpose-select'
  } as FeiloppsummeringFeil

  v.comment = options.comment ? undefined : {
    feilmelding: t('ui:validation-noComment'),
    skjemaelementId: 'c-svarpased-comment-textarea'
  } as FeiloppsummeringFeil

  validatePerson(v, t, options, 'bruker')

  return v
}
