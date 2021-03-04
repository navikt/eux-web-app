import { Person } from 'declarations/sed'
import { Validation } from 'declarations/types.d'
import _ from 'lodash'
import { FeiloppsummeringFeil } from 'nav-frontend-skjema'
import { validateNasjonaliteter } from './validation/nasjonaliteter'
import { validatePersonOpplysning } from './validation/personopplysninger'
import { validateAdresser } from './validation/adresser'
import { validateKontaktsinformasjon } from './validation/kontaktinformasjon'
import { validateTrygdeordninger } from './validation/trygdeordninger'
import { validateFamilierelasjon } from './validation/familierelasjon'

export const performValidation = (v: Validation, t: any, options: any, personId: string) => {
  validatePersonOpplysning(v, t, options, personId)
  validateNasjonaliteter(v, t, options, personId)
  validateAdresser(v, t, options, personId)
  validateKontaktsinformasjon(v, t, options, personId)
  validateTrygdeordninger(v, t, options, personId)
  validateFamilierelasjon(v, t, options, personId)
}

export const validate = (options: any): Validation => {
  const v: Validation = {}
  const t = options.t
  // Step 2 form

  v.purpose = !_.isEmpty(options.purpose)
    ? undefined
    : {
      feilmelding: t('ui:validation-noPurpose'),
      skjemaelementId: 'c-purpose-select'
    } as FeiloppsummeringFeil

  v.comment = options.comment
    ? undefined
    : {
      feilmelding: t('ui:validation-noComment'),
      skjemaelementId: 'c-svarpased-comment-textarea'
    } as FeiloppsummeringFeil

  performValidation(v, t, options, 'bruker')

  if (options.replySed.ektefelle) {
    performValidation(v, t, options, 'ektefelle')
  }
  if (options.replySed.annenPerson) {
    performValidation(v, t, options, 'annenPerson')
  }
  if (options.replySed.barn) {
    options.replySed.barn.forEach((b: Person, i: number) => performValidation(v, t, options, `barn[${i}]`))
  }
  return v
}
