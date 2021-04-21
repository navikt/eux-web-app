import {
  Adresse,
  Epost,
  FamilieRelasjon, PensjonPeriode,
  Periode,
  Person,
  PersonInfo,
  Statsborgerskap,
  Telefon
} from 'declarations/sed'
import { Validation } from 'declarations/types.d'
import _ from 'lodash'
import { FeiloppsummeringFeil } from 'nav-frontend-skjema'
import { validateNasjonaliteter } from 'applications/SvarSed/FamilyManager/Nasjonaliteter/validation'
import { validatePersonOpplysning } from 'applications/SvarSed/FamilyManager/PersonOpplysninger/validation'
import { validateAdresser } from 'applications/SvarSed/FamilyManager/Adresser/validation'
import { validateKontaktsinformasjonTelefoner, validateKontaktsinformasjonEposter } from 'applications/SvarSed/FamilyManager/Kontaktinformasjon/validation'
import { validateTrygdeordninger } from 'applications/SvarSed/FamilyManager/Trygdeordning/validation'
import { validateFamilierelasjoner } from 'applications/SvarSed/FamilyManager/Familierelasjon/validation'

export const performValidation = (v: Validation, t: any, options: any, personID: string) => {
  const adresser: Array<Adresse> = _.get(options.replySed, `${personID}.adresser`)
  const personInfo: PersonInfo = _.get(options.replySed, `${personID}.personInfo`)
  const familierelasjoner: Array<FamilieRelasjon> = _.get(options.replySed, `${personID}.familierelasjoner`)
  const telefoner: Array<Telefon> = _.get(options.replySed, `${personID}.telefon`)
  const eposter: Array<Epost> = _.get(options.replySed, `${personID}.epost`)
  const statsborgerskaper: Array<Statsborgerskap> = _.get(options.replySed, `${personID}.statsborgerskap`)
  const perioder: {[k in string]: Array<Periode | PensjonPeriode>} = {
    perioderMedArbeid: _.get(options.replySed, `${personID}.perioderMedArbeid`),
    perioderMedTrygd: _.get(options.replySed, `${personID}.perioderMedTrygd`),
    perioderMedITrygdeordning: _.get(options.replySed, `${personID}.perioderMedITrygdeordning`),
    perioderUtenforTrygdeordning: _.get(options.replySed, `${personID}.perioderUtenforTrygdeordning`),
    perioderMedYtelser: _.get(options.replySed, `${personID}.perioderMedYtelser`),
    perioderMedPensjon: _.get(options.replySed, `${personID}.perioderMedPensjon`)
  }

  const personName = personInfo.fornavn + ' ' + personInfo.etternavn

  validatePersonOpplysning(v, t, {personInfo, namespace: `familymanager-${personID}-personopplysning`, personName})
  validateNasjonaliteter(v, t, statsborgerskaper, `familymanager-${personID}-statsborgerskap`, personName)
  validateAdresser(v, t, adresser,`familymanager-${personID}-adresser`, personName)
  validateKontaktsinformasjonTelefoner(v, t, telefoner, `familymanager-${personID}-kontaktinformasjon-telefon`, personName)
  validateKontaktsinformasjonEposter(v, t, eposter, `familymanager-${personID}-kontaktinformasjon-epost`, personName)
  validateTrygdeordninger(v, t, perioder, `familymanager-${personID}-trygdeordninger`, personName)
  validateFamilierelasjoner(v, t, familierelasjoner, `familymanager-${personID}-familierelasjoner`, personName)
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
        skjemaelementId: 'svarpased-formaal-text'
      } as FeiloppsummeringFeil
  }

  v.comment = options.comment
    ? undefined
    : {
      feilmelding: t('message:validation-noComment'),
      skjemaelementId: 'c-svarpased-comment-text'
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
