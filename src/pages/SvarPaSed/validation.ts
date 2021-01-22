import { Person, Validation } from 'declarations/types'
import _ from 'lodash'
import { FeiloppsummeringFeil } from 'nav-frontend-skjema'

export const validate = (options: any): Validation => {

  let v: Validation = {}

  // Step 2 form

  v.purpose = !_.isEmpty(options.purpose) ? undefined : {
    feilmelding: 'ui:validation-noPurpose',
    skjemaelementId: 'c-purpose-select'
  } as FeiloppsummeringFeil

  v.comment = options.comment ? undefined : {
    feilmelding: 'ui:validation-noComment',
    skjemaelementId: 'c-svarpased-comment-textarea'
  } as FeiloppsummeringFeil

  options.personPlusRelations.forEach((p: Person) => {
    let personFail = false

    // PersonOpplysning
    let personOpplysningFail = false

    let value = (p.personopplysninger?.fornavn) ? undefined : {
      feilmelding: 'ui:validation-noFornavn',
      skjemaelementId: 'c-familymanager-personopplysninger-' + p.fnr + '-fornavn'
    } as FeiloppsummeringFeil
    v['person-' + p.fnr + '-personopplysninger-fornavn'] = value
    if (value) {
      personFail = true
      personOpplysningFail = true
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
