import { Validation } from 'declarations/types'
import _ from 'lodash'
import { FeiloppsummeringFeil } from 'nav-frontend-skjema'

export const validate = (options: any): Validation => {

  let v: Validation = {}
  v.purpose = !_.isEmpty(options.purpose) ? undefined :  {
    feilmelding: 'ui:validation-noPurpose',
    skjemaelementId: 'c-purpose-select'
  } as FeiloppsummeringFeil

  v.comment = options.comment ? undefined :  {
    feilmelding: 'ui:validation-noComment',
    skjemaelementId: 'c-svarpased-comment-textarea'
  } as FeiloppsummeringFeil

  return v
}
