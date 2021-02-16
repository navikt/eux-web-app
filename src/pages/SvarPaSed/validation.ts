import { Person } from 'declarations/sed'
import { Validation } from 'declarations/types.d'
import _ from 'lodash'
import { FeiloppsummeringFeil } from 'nav-frontend-skjema'
import { validateNasjonaliteter } from './validation/nasjonaliteter'
import { validatePersonOpplysning } from './validation/personopplysninger'


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

  validatePersonOpplysning(v, t, options, 'bruker')
  validateNasjonaliteter(v, t, options, 'bruker')
  if (options.replySed.ektefelle) {
    validatePersonOpplysning(v, t, options, 'ektefelle')
    validateNasjonaliteter(v, t, options, 'ektefelle')
  }
  if (options.replySed.annenPerson) {
    validatePersonOpplysning(v, t, options, 'annenPerson')
    validateNasjonaliteter(v, t, options, 'annenPerson')
  }
  if (options.replySed.barn) {
    options.replySed.barn.forEach((b: Person, i: number) => validatePersonOpplysning(v, t, options, `barn[${i}]`))
    options.replySed.barn.forEach((b: Person, i: number) => validateNasjonaliteter(v, t, options, `barn[${i}]`))
  }
  return v
}
