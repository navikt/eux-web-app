import { validateAdresser } from 'applications/SvarSed/FamilyManager/Adresser/validation'
import { validateBeløpNavnOgValuta } from 'applications/SvarSed/FamilyManager/BeløpNavnOgValuta/validation'
import { validateFamilierelasjoner } from 'applications/SvarSed/FamilyManager/Familierelasjon/validation'
import { validateFamilieytelser } from 'applications/SvarSed/FamilyManager/Familieytelser/validation'
import { validateAllGrunnlagForBosetting } from 'applications/SvarSed/FamilyManager/GrunnlagForBosetting/validation'
import {
  validateKontaktsinformasjonEposter,
  validateKontaktsinformasjonTelefoner
} from 'applications/SvarSed/FamilyManager/Kontaktinformasjon/validation'
import { validateNasjonaliteter } from 'applications/SvarSed/FamilyManager/Nasjonaliteter/validation'
import { validatePersonOpplysninger } from 'applications/SvarSed/FamilyManager/PersonOpplysninger/validation'
import { validateBarnetilhoerigheter } from 'applications/SvarSed/FamilyManager/Relasjon/validation'
import { validateTrygdeordninger } from 'applications/SvarSed/FamilyManager/Trygdeordning/validation'
import {
  Adresse,
  Barnetilhoerighet,
  Epost,
  F002Sed,
  FamilieRelasjon,
  Flyttegrunn,
  Motregning,
  PensjonPeriode,
  Periode,
  Person,
  PersonInfo,
  ReplySed,
  Statsborgerskap,
  Telefon,
  Ytelse
} from 'declarations/sed'
import { Validation } from 'declarations/types.d'
import _ from 'lodash'
import { FeiloppsummeringFeil } from 'nav-frontend-skjema'
import { TFunction } from 'react-i18next'

export interface ValidationStep2Props {
  comment: string
  replySed: ReplySed
}

export const performValidation = (v: Validation, t: TFunction, replySed: ReplySed, personID: string): boolean => {
  let hasErrors: boolean = false
  const personInfo: PersonInfo = _.get(replySed, `${personID}.personInfo`)
  const personName: string = personID === 'familie'
    ? t('label:familien').toLowerCase()
    : personInfo.fornavn + ' ' + personInfo.etternavn

  if (personID !== 'familie') {
    hasErrors = hasErrors && validatePersonOpplysninger(v, t, {
      personInfo,
      namespace: `familymanager-${personID}-personopplysninger`,
      personName
    })

    const statsborgerskaper: Array<Statsborgerskap> = _.get(replySed, `${personID}.statsborgerskap`)
    hasErrors = hasErrors && validateNasjonaliteter(v, t, statsborgerskaper, `familymanager-${personID}-nasjonaliteter`, personName)

    const adresser: Array<Adresse> = _.get(replySed, `${personID}.adresser`)
    hasErrors = hasErrors && validateAdresser(v, t, adresser, `familymanager-${personID}-adresser`, personName)
  }

  if (!personID.startsWith('barn')) {
    if (personID === 'familie') {
      const motregninger: Array<Motregning> = _.get(replySed, `${personID}.motregninger`)
      hasErrors = hasErrors && validateFamilieytelser(v, t, motregninger, `familymanager-${personID}-familieytelser`, personName)
    } else {
      const telefoner: Array<Telefon> = _.get(replySed, `${personID}.telefon`)
      hasErrors = hasErrors && validateKontaktsinformasjonTelefoner(v, t, telefoner, `familymanager-${personID}-kontaktinformasjon-telefon`, personName)

      const eposter: Array<Epost> = _.get(replySed, `${personID}.epost`)
      hasErrors = hasErrors && validateKontaktsinformasjonEposter(v, t, eposter, `familymanager-${personID}-kontaktinformasjon-epost`, personName)

      const perioder: {[k in string]: Array<Periode | PensjonPeriode>} = {
        perioderMedArbeid: _.get(replySed, `${personID}.perioderMedArbeid`),
        perioderMedTrygd: _.get(replySed, `${personID}.perioderMedTrygd`),
        perioderMedITrygdeordning: _.get(replySed, `${personID}.perioderMedITrygdeordning`),
        perioderUtenforTrygdeordning: _.get(replySed, `${personID}.perioderUtenforTrygdeordning`),
        perioderMedYtelser: _.get(replySed, `${personID}.perioderMedYtelser`),
        perioderMedPensjon: _.get(replySed, `${personID}.perioderMedPensjon`)
      }
      hasErrors = hasErrors && validateTrygdeordninger(v, t, perioder, `familymanager-${personID}-trygdeordninger`, personName)

      const familierelasjoner: Array<FamilieRelasjon> = _.get(replySed, `${personID}.familierelasjoner`)
      hasErrors = hasErrors && validateFamilierelasjoner(v, t, familierelasjoner, `familymanager-${personID}-familierelasjon`, personName)
    }
  } else {
    const barnetilhorighet : Array<Barnetilhoerighet> = _.get(replySed, `${personID}.barnetilhoerigheter`)
    hasErrors = hasErrors && validateBarnetilhoerigheter(v, t, barnetilhorighet, `familymanager-${personID}-relasjon`, personName)

    const flyttegrunn: Flyttegrunn = _.get(replySed, `${personID}.flyttegrunn`)
    hasErrors = hasErrors && validateAllGrunnlagForBosetting(v, t, flyttegrunn, `familymanager-${personID}-grunnlagforbosetting`, personName)

    const ytelse: Ytelse = _.get(replySed, `${personID}.ytelse`)
    hasErrors = hasErrors && validateBeløpNavnOgValuta(v, t, { ytelse, namespace: `familymanager-${personID}-beløpnavnogvaluta`, personName })
  }
  return hasErrors
}

export const validateStep1 = (
  v: Validation,
  t: TFunction,
  {
    saksnummerOrFnr
  }: any
): boolean => {
  let hasErrors: boolean = false
  if (_.isEmpty(saksnummerOrFnr)) {
    v['step1-saksnummerOrFnr'] = {
      feilmelding: t('message:validation-noSaksnummerOrFnr'),
      skjemaelementId: 'c-step1-saksnummerOrFnr-text'
    } as FeiloppsummeringFeil
    hasErrors = true
  }
  return hasErrors
}

export const validateStep2 = (
  v: Validation,
  t: TFunction,
  {
    comment,
    replySed
  }: ValidationStep2Props
): boolean => {
  let hasErrors: boolean = false
  if (replySed.sedType.startsWith('F')) {
    if (_.isEmpty((replySed as F002Sed).formaal)) {
      v['step2-formaal'] = {
        feilmelding: t('message:validation-noFormaal'),
        skjemaelementId: 'c-step2-formaal-text'
      } as FeiloppsummeringFeil
      hasErrors = true
    }

    if ((replySed as F002Sed).ektefelle) {
      hasErrors = hasErrors && performValidation(v, t, replySed, 'ektefelle')
    }
    if ((replySed as F002Sed).annenPerson) {
      hasErrors = hasErrors && performValidation(v, t, replySed, 'annenPerson')
    }
    if ((replySed as F002Sed).barn) {
      (replySed as F002Sed).barn.forEach((b: Person, i: number) => {
        hasErrors = hasErrors && performValidation(v, t, replySed, `barn[${i}]`)
      })
    }
    if ((replySed as F002Sed).familie) {
      hasErrors = hasErrors && performValidation(v, t, replySed, 'familie')
    }
  }

  if (_.isEmpty(comment)) {
    v['step2-comment'] = {
      feilmelding: t('message:validation-noComment'),
      skjemaelementId: 'c-step2-comment-text'
    } as FeiloppsummeringFeil
    hasErrors = true
  }

  hasErrors = hasErrors && performValidation(v, t, replySed, 'bruker')
  return hasErrors
}
