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
import { validateMotregning } from 'applications/SvarSed/Formaal/Motregning/validation'
import { validateVedtak } from 'applications/SvarSed/Formaal/Vedtak/validation'
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
  let _error: boolean
  const personInfo: PersonInfo = _.get(replySed, `${personID}.personInfo`)
  const personName: string = personID === 'familie'
    ? t('label:familien').toLowerCase()
    : personInfo.fornavn + ' ' + personInfo.etternavn

  if (personID !== 'familie') {
    _error = validatePersonOpplysninger(v, t, {
      personInfo,
      namespace: `familymanager-${personID}-personopplysninger`,
      personName
    })
    hasErrors = hasErrors || _error

    const statsborgerskaper: Array<Statsborgerskap> = _.get(replySed, `${personID}.statsborgerskap`)
    _error = validateNasjonaliteter(v, t, statsborgerskaper, `familymanager-${personID}-nasjonaliteter`, personName)
    hasErrors = hasErrors || _error

    const adresser: Array<Adresse> = _.get(replySed, `${personID}.adresser`)
    _error = validateAdresser(v, t, adresser, `familymanager-${personID}-adresser`, personName)
    hasErrors = hasErrors || _error
  }

  if (!personID.startsWith('barn')) {
    if (personID === 'familie') {
      const motregninger: Array<Motregning> = _.get(replySed, `${personID}.motregninger`)
      _error = validateFamilieytelser(v, t, motregninger, `familymanager-${personID}-familieytelser`, personName)
      hasErrors = hasErrors || _error
    } else {
      const telefoner: Array<Telefon> = _.get(replySed, `${personID}.telefon`)
      _error = validateKontaktsinformasjonTelefoner(v, t, telefoner, `familymanager-${personID}-kontaktinformasjon-telefon`, personName)
      hasErrors = hasErrors || _error
      const eposter: Array<Epost> = _.get(replySed, `${personID}.epost`)
      _error = validateKontaktsinformasjonEposter(v, t, eposter, `familymanager-${personID}-kontaktinformasjon-epost`, personName)
      hasErrors = hasErrors || _error
      const perioder: {[k in string]: Array<Periode | PensjonPeriode>} = {
        perioderMedArbeid: _.get(replySed, `${personID}.perioderMedArbeid`),
        perioderMedTrygd: _.get(replySed, `${personID}.perioderMedTrygd`),
        perioderMedITrygdeordning: _.get(replySed, `${personID}.perioderMedITrygdeordning`),
        perioderUtenforTrygdeordning: _.get(replySed, `${personID}.perioderUtenforTrygdeordning`),
        perioderMedYtelser: _.get(replySed, `${personID}.perioderMedYtelser`),
        perioderMedPensjon: _.get(replySed, `${personID}.perioderMedPensjon`)
      }
      _error =  validateTrygdeordninger(v, t, perioder, `familymanager-${personID}-trygdeordninger`, personName)
      hasErrors = hasErrors || _error
      const familierelasjoner: Array<FamilieRelasjon> = _.get(replySed, `${personID}.familierelasjoner`)
      _error = validateFamilierelasjoner(v, t, familierelasjoner, `familymanager-${personID}-familierelasjon`, personName)
      hasErrors = hasErrors || _error
    }
  } else {
    const barnetilhorighet : Array<Barnetilhoerighet> = _.get(replySed, `${personID}.barnetilhoerigheter`)
    _error = validateBarnetilhoerigheter(v, t, barnetilhorighet, `familymanager-${personID}-relasjon`, personName)
    hasErrors = hasErrors || _error
    const flyttegrunn: Flyttegrunn = _.get(replySed, `${personID}.flyttegrunn`)
    _error = validateAllGrunnlagForBosetting(v, t, flyttegrunn, `familymanager-${personID}-grunnlagforbosetting`, personName)
    hasErrors = hasErrors || _error
    const ytelse: Ytelse = _.get(replySed, `${personID}.ytelse`)
    _error = validateBeløpNavnOgValuta(v, t, { ytelse, namespace: `familymanager-${personID}-beløpnavnogvaluta`, personName })
    hasErrors = hasErrors || _error
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
      skjemaelementId: 'step1-saksnummerOrFnr'
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
  let _error: boolean
  if (replySed.sedType.startsWith('F')) {
    if (_.isEmpty((replySed as F002Sed).formaal)) {
      v['formaal'] = {
        feilmelding: t('message:validation-noFormaal'),
        skjemaelementId: 'formaal'
      } as FeiloppsummeringFeil
      hasErrors = true
    }

    if ((replySed as F002Sed).ektefelle) {
      _error = performValidation(v, t, replySed, 'ektefelle')
      hasErrors = hasErrors || _error
    }
    if ((replySed as F002Sed).annenPerson) {
      _error = performValidation(v, t, replySed, 'annenPerson')
      hasErrors = hasErrors || _error
    }
    if ((replySed as F002Sed).barn) {
      (replySed as F002Sed).barn.forEach((b: Person, i: number) => {
        _error = performValidation(v, t, replySed, `barn[${i}]`)
        hasErrors = hasErrors || _error
      })
    }
    if ((replySed as F002Sed).familie) {
      _error = performValidation(v, t, replySed, 'familie')
      hasErrors = hasErrors || _error
    }
  }

  if (_.isEmpty(comment)) {
    v['comment'] = {
      feilmelding: t('message:validation-noComment'),
      skjemaelementId: 'comment'
    } as FeiloppsummeringFeil
    hasErrors = true
  }

  _error = performValidation(v, t, replySed, 'bruker')
  hasErrors = hasErrors || _error

  if ((replySed as F002Sed).formaal) {
    if ((replySed as F002Sed).formaal.indexOf('motregning') >= 0) {
      _error = validateMotregning(v, t, _.get(replySed, 'formaalx.motregning'), 'motregning')
      hasErrors = hasErrors || _error
    }
    if ((replySed as F002Sed).formaal.indexOf('vedtak') >= 0) {
      _error = validateVedtak(v, t, _.get(replySed, 'formaalx.vedtak'), 'vedtak')
      hasErrors = hasErrors || _error
    }

  }
  return hasErrors
}
