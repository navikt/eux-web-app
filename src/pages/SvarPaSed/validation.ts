import { Adresse, FamilieRelasjon2, Person } from 'declarations/sed'
import { Validation } from 'declarations/types.d'
import _ from 'lodash'
import { FeiloppsummeringFeil } from 'nav-frontend-skjema'
import { validateNasjonaliteter } from 'validation/nasjonaliteter'
import { validatePersonOpplysning } from 'validation/personopplysninger'
import { validateAdresser } from 'validation/adresser'
import { validateKontaktsinformasjon } from 'validation/kontaktinformasjon'
import { validateTrygdeordninger } from 'validation/trygdeordninger'
import { validateFamilierelasjoner } from 'validation/familierelasjon'

export const performValidation = (v: Validation, t: any, options: any, personID: string) => {

  const adresser: Array<Adresse> = _.get(options.replySed, `${personID}.adresser`)
  const familierelasjoner: Array<FamilieRelasjon2> = _.get(options.replySed, `${personID}.familierelasjoner`)
  const p = _.get(options.replySed, personID)
  const personName = p.personInfo.fornavn + ' ' + p.personInfo.etternavn

  validatePersonOpplysning(v, t, options, personID)
  validateNasjonaliteter(v, t, options, personID)
  validateAdresser(v, adresser, t, `familymanager-${personID}-adresser`, personName)
  validateKontaktsinformasjon(v, t, options, personID)
  validateTrygdeordninger(v, t, options, personID)
  validateFamilierelasjoner(v, familierelasjoner, t, `familymanager-${personID}-familierelasjoner`, personName)
}

export const validate = (options: any): Validation => {
  const v: Validation = {}
  const t = options.t
  // Step 2 form

  if (options.replySed.sedType.startsWith('F')) {
    v.formaal = !_.isEmpty(options.replySed.formaal)
      ? undefined
      : {
        feilmelding: t('message:validation-noFormaal'),
        skjemaelementId: 'svarpased-formaal-select'
      } as FeiloppsummeringFeil
  }

  v.comment = options.comment
    ? undefined
    : {
      feilmelding: t('message:validation-noComment'),
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
