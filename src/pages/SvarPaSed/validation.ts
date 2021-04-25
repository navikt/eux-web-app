import { validateAdresser } from 'applications/SvarSed/PersonManager/Adresser/validation'
import { validateBeløpNavnOgValuta } from 'applications/SvarSed/PersonManager/BeløpNavnOgValuta/validation'
import { validateFamilierelasjoner } from 'applications/SvarSed/PersonManager/Familierelasjon/validation'
import { validateFamilieytelser } from 'applications/SvarSed/PersonManager/Familieytelser/validation'
import { validateAllGrunnlagForBosetting } from 'applications/SvarSed/PersonManager/GrunnlagForBosetting/validation'
import {
  validateKontaktsinformasjonEposter,
  validateKontaktsinformasjonTelefoner
} from 'applications/SvarSed/PersonManager/Kontaktinformasjon/validation'
import { validateNasjonaliteter } from 'applications/SvarSed/PersonManager/Nasjonaliteter/validation'
import { validatePersonOpplysninger } from 'applications/SvarSed/PersonManager/PersonOpplysninger/validation'
import { validateBarnetilhoerigheter } from 'applications/SvarSed/PersonManager/Relasjon/validation'
import { validateTrygdeordninger } from 'applications/SvarSed/PersonManager/Trygdeordning/validation'
import { validateKontoopplysning } from 'applications/SvarSed/Formaal/Kontoopplysning/validation'
import { validateKravOmRefusjon } from 'applications/SvarSed/Formaal/KravOmRefusjon/validation'
import { validateMotregning } from 'applications/SvarSed/Formaal/Motregning/validation'
import { validateProsedyreVedUenighet } from 'applications/SvarSed/Formaal/ProsedyreVedUenighet/validation'
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
      namespace: `personmanager-${personID}-personopplysninger`,
      personName
    })
    hasErrors = hasErrors || _error

    const statsborgerskaper: Array<Statsborgerskap> = _.get(replySed, `${personID}.statsborgerskap`)
    _error = validateNasjonaliteter(v, t, statsborgerskaper, `personmanager-${personID}-nasjonaliteter`, personName)
    hasErrors = hasErrors || _error

    const adresser: Array<Adresse> = _.get(replySed, `${personID}.adresser`)
    _error = validateAdresser(v, t, adresser, `personmanager-${personID}-adresser`, personName)
    hasErrors = hasErrors || _error
  }

  if (!personID.startsWith('barn')) {
    if (personID === 'familie') {
      const motregninger: Array<Motregning> = _.get(replySed, `${personID}.motregninger`)
      _error = validateFamilieytelser(v, t, motregninger, `personmanager-${personID}-familieytelser`, personName)
      hasErrors = hasErrors || _error
    } else {
      const telefoner: Array<Telefon> = _.get(replySed, `${personID}.telefon`)
      _error = validateKontaktsinformasjonTelefoner(v, t, telefoner, `personmanager-${personID}-kontaktinformasjon-telefon`, personName)
      hasErrors = hasErrors || _error
      const eposter: Array<Epost> = _.get(replySed, `${personID}.epost`)
      _error = validateKontaktsinformasjonEposter(v, t, eposter, `personmanager-${personID}-kontaktinformasjon-epost`, personName)
      hasErrors = hasErrors || _error
      const perioder: {[k in string]: Array<Periode | PensjonPeriode>} = {
        perioderMedArbeid: _.get(replySed, `${personID}.perioderMedArbeid`),
        perioderMedTrygd: _.get(replySed, `${personID}.perioderMedTrygd`),
        perioderMedITrygdeordning: _.get(replySed, `${personID}.perioderMedITrygdeordning`),
        perioderUtenforTrygdeordning: _.get(replySed, `${personID}.perioderUtenforTrygdeordning`),
        perioderMedYtelser: _.get(replySed, `${personID}.perioderMedYtelser`),
        perioderMedPensjon: _.get(replySed, `${personID}.perioderMedPensjon`)
      }
      _error =  validateTrygdeordninger(v, t, perioder, `personmanager-${personID}-trygdeordninger`, personName)
      hasErrors = hasErrors || _error
      const familierelasjoner: Array<FamilieRelasjon> = _.get(replySed, `${personID}.familierelasjoner`)
      _error = validateFamilierelasjoner(v, t, familierelasjoner, `personmanager-${personID}-familierelasjon`, personName)
      hasErrors = hasErrors || _error
    }
  } else {
    const barnetilhorighet : Array<Barnetilhoerighet> = _.get(replySed, `${personID}.barnetilhoerigheter`)
    _error = validateBarnetilhoerigheter(v, t, barnetilhorighet, `personmanager-${personID}-relasjon`, personName)
    hasErrors = hasErrors || _error
    const flyttegrunn: Flyttegrunn = _.get(replySed, `${personID}.flyttegrunn`)
    _error = validateAllGrunnlagForBosetting(v, t, flyttegrunn, `personmanager-${personID}-grunnlagforbosetting`, personName)
    hasErrors = hasErrors || _error
    const ytelse: Ytelse = _.get(replySed, `${personID}.ytelse`)
    _error = validateBeløpNavnOgValuta(v, t, { ytelse, namespace: `personmanager-${personID}-beløpnavnogvaluta`, personName })
    hasErrors = hasErrors || _error
  }
  return hasErrors
}

export const validateStep1 = (
  v: Validation,
  t: TFunction,
  {
    saksnummerOrFnr
  }: {
    saksnummerOrFnr: string
  }
): boolean => {
  let hasErrors: boolean = false
  if (_.isEmpty(saksnummerOrFnr.trim())) {
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

  if (_.isEmpty(comment?.trim())) {
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
      _error = validateMotregning(v, t, _.get(replySed, 'formaalx.motregning'), 'motregning', t('label:motregning').toLowerCase())
      hasErrors = hasErrors || _error
    }
    if ((replySed as F002Sed).formaal.indexOf('vedtak') >= 0) {
      _error = validateVedtak(v, t, _.get(replySed, 'formaalx.vedtak'), 'vedtak', t('label:vedtak').toLowerCase())
      hasErrors = hasErrors || _error
    }
    if ((replySed as F002Sed).formaal.indexOf('prosedyre_ved_uenighet') >= 0) {
      _error = validateProsedyreVedUenighet(v, t, _.get(replySed, 'formaalx.prosedyreveduenighet'), 'prosedyreveduenighet', t('label:prosedyre-ved-uenighet').toLowerCase())
      hasErrors = hasErrors || _error
    }
    if ((replySed as F002Sed).formaal.indexOf('refusjon_i_henhold_til_artikkel_58_i_forordningen') >= 0) {
      _error = validateKravOmRefusjon(v, t, _.get(replySed, 'formaalx.kravomrefusjon'), 'kravomrefusjon', t('label:krav-om-refusjon').toLowerCase())
      hasErrors = hasErrors || _error
    }
    if (!_.isNil((replySed as F002Sed).utbetalingTilInstitusjon)) {
      _error = validateKontoopplysning(v, t, _.get(replySed, 'utbetalingTilInstitusjon'), 'kontoopplysninger', t('label:kontoopplysninger').toLowerCase())
      hasErrors = hasErrors || _error
    }
  }
  return hasErrors
}
