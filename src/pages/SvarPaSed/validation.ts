import { Person, Validation } from 'declarations/types'
import _ from 'lodash'
import { FeiloppsummeringFeil } from 'nav-frontend-skjema'

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

  options.personPlusRelations.forEach((p: Person) => {
    let personFail = false

    // PersonOpplysning
    let personOpplysningFail = false

    let personName = p.fornavn + ' ' + p.etternavn

    let value = (p.personopplysninger?.fornavn) ? undefined : {
      feilmelding: t('ui:validation-noFornavn', {person: personName}),
      skjemaelementId: 'c-familymanager-personopplysninger-' + p.fnr + '-fornavn-input'
    } as FeiloppsummeringFeil
    v['person-' + p.fnr + '-personopplysninger-fornavn'] = value
    if (value) {
      personFail = true
      personOpplysningFail = true
    }

    value = (p.personopplysninger?.etternavn) ? undefined : {
      feilmelding: t('ui:validation-noEtternavn', {person: personName}),
      skjemaelementId: 'c-familymanager-personopplysninger-' + p.fnr + '-etternavn-input'
    } as FeiloppsummeringFeil
    v['person-' + p.fnr + '-personopplysninger-etternavn'] = value
    if (value) {
      personFail = true
      personOpplysningFail = true
    }

    value = (p.personopplysninger?.foedselsdato) ? undefined : {
      feilmelding: t('ui:validation-noFodselsdato', {person: personName}),
      skjemaelementId: 'c-familymanager-personopplysninger-' + p.fnr + '-foedselsdato-input'
    } as FeiloppsummeringFeil
    v['person-' + p.fnr + '-personopplysninger-foedselsdato'] = value
    if (value) {
      personFail = true
      personOpplysningFail = true
    }

    value = (p.personopplysninger?.kjoenn) ? undefined : {
      feilmelding: t('ui:validation-noKjoenn', {person: personName}),
      skjemaelementId: 'c-familymanager-personopplysninger-' + p.fnr + '-kjoenn-radiogroup'
    } as FeiloppsummeringFeil
    v['person-' + p.fnr + '-personopplysninger-kjoenn'] = value
    if (value) {
      personFail = true
      personOpplysningFail = true
    }

    if (p.personopplysninger?.fodested) {
      value = (p.personopplysninger?.fodestedBy) ? undefined : {
        feilmelding: t('ui:validation-noFodestedBy', {person: personName}),
        skjemaelementId: 'c-familymanager-personopplysninger-' + p.fnr + '-fodestedby-input'
      } as FeiloppsummeringFeil
      v['person-' + p.fnr + '-personopplysninger-fodestedby'] = value
      if (value) {
        personFail = true
        personOpplysningFail = true
      }

      value = (p.personopplysninger?.fodestedRegion) ? undefined : {
        feilmelding: t('ui:validation-noFodestedRegion', {person: personName}),
        skjemaelementId: 'c-familymanager-personopplysninger-' + p.fnr + '-fodestedregion-input'
      } as FeiloppsummeringFeil
      v['person-' + p.fnr + '-personopplysninger-fodestedregion'] = value
      if (value) {
        personFail = true
        personOpplysningFail = true
      }

      value = (p.personopplysninger?.fodestedLand) ? undefined : {
        feilmelding: t('ui:validation-noFodestedLand', {person: personName}),
        skjemaelementId: 'c-familymanager-personopplysninger-' + p.fnr + '-fodestedland-countryselect'
      } as FeiloppsummeringFeil
      v['person-' + p.fnr + '-personopplysninger-fodestedland'] = value
      if (value) {
        personFail = true
        personOpplysningFail = true
      }
    } else {
      delete v['person-' + p.fnr + '-personopplysninger-fodestedby']
      delete v['person-' + p.fnr + '-personopplysninger-fodestedregion']
      delete v['person-' + p.fnr + '-personopplysninger-fodestedland']
    }

    v['person-' + p.fnr + '-personopplysninger'] = personOpplysningFail ? {
      feilmelding: 'notnull', skjemaelementId: ''
    } as FeiloppsummeringFeil : undefined

    v['person-' + p.fnr] = personFail ? {
      feilmelding: 'notnull', skjemaelementId: ''
    } as FeiloppsummeringFeil : undefined
  })

  return v
}
