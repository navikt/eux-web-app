import { validateKontoopplysning } from 'applications/SvarSed/Formaal/Kontoopplysning/validation'
import { validateKravOmRefusjon } from 'applications/SvarSed/Formaal/KravOmRefusjon/validation'
import { validateMotregninger } from 'applications/SvarSed/Formaal/Motregning/validation'
import { validateProsedyreVedUenighet } from 'applications/SvarSed/Formaal/ProsedyreVedUenighet/validation'
import { validateVedtak } from 'applications/SvarSed/Formaal/Vedtak/validation'
import { validateAdresser } from 'applications/SvarSed/PersonManager/Adresser/validation'
import { validateBeløpNavnOgValuta } from 'applications/SvarSed/PersonManager/BeløpNavnOgValuta/validation'
import { validateFamilierelasjoner } from 'applications/SvarSed/PersonManager/Familierelasjon/validation'
import { validateFamilieytelse } from 'applications/SvarSed/PersonManager/Familieytelser/validation'
import { validateAllGrunnlagForBosetting } from 'applications/SvarSed/PersonManager/GrunnlagForBosetting/validation'
import {
  validateKontaktsinformasjonEposter,
  validateKontaktsinformasjonTelefoner
} from 'applications/SvarSed/PersonManager/Kontaktinformasjon/validation'
import { validateNasjonaliteter } from 'applications/SvarSed/PersonManager/Nasjonaliteter/validation'
import { validateAnsattPerioder } from 'applications/SvarSed/PersonManager/PersonensStatus/ansattValidation'
import { validateAvsenderlandetPerioder } from 'applications/SvarSed/PersonManager/PersonensStatus/avsenderlandetValidation'
import { validateNotAnsattPerioder } from 'applications/SvarSed/PersonManager/PersonensStatus/notAnsattValidation'
import { validateWithSubsidiesPerioder } from 'applications/SvarSed/PersonManager/PersonensStatus/withSubsidiesValidation'
import { validatePersonOpplysninger } from 'applications/SvarSed/PersonManager/PersonOpplysninger/validation'
import { validateReferanseperiode } from 'applications/SvarSed/PersonManager/Referanseperiode/validation'
import { validateBarnetilhoerigheter } from 'applications/SvarSed/PersonManager/Relasjon/validation'
import { validateSisteansettelsesforhold } from 'applications/SvarSed/PersonManager/SisteAnsettelsesForhold/validation'
import { validateSvarPåForespørsel } from 'applications/SvarSed/PersonManager/SvarPåForespørsel/validation'
import { validateTrygdeordninger } from 'applications/SvarSed/PersonManager/Trygdeordning/validation'
import {
  Adresse,
  Barnetilhoerighet,
  Epost,
  F002Sed,
  FamilieRelasjon,
  Flyttegrunn,
  HSed,
  PensjonPeriode,
  Periode,
  Person,
  PersonInfo,
  ReplySed,
  Statsborgerskap,
  Telefon, USed,
  Ytelse
} from 'declarations/sed'
import { Validation } from 'declarations/types.d'
import _ from 'lodash'
import { FeiloppsummeringFeil } from 'nav-frontend-skjema'
import { TFunction } from 'react-i18next'
import { isFSed, isHSed, isUSed } from 'utils/sed'

export interface ValidationSEDEditorProps {
  replySed: ReplySed
}

export const validateFormålManager = (v: Validation, t: TFunction, replySed: ReplySed): boolean => {
  let hasErrors: boolean = false
  let _error: boolean

  if ((replySed as F002Sed).formaal) {
    if ((replySed as F002Sed).formaal.indexOf('motregning') >= 0) {
      _error = validateMotregninger(v, t, replySed, 'formålmanager-motregning', t('label:motregning').toLowerCase())
      hasErrors = hasErrors || _error
    }
    if ((replySed as F002Sed).formaal.indexOf('vedtak') >= 0) {
      _error = validateVedtak(v, t, _.get(replySed, 'vedtak'), 'formålmanager-vedtak', t('label:vedtak').toLowerCase())
      hasErrors = hasErrors || _error
    }
    if ((replySed as F002Sed).formaal.indexOf('prosedyre_ved_uenighet') >= 0) {
      _error = validateProsedyreVedUenighet(v, t, _.get(replySed, 'uenighet'), 'formålmanager-prosedyre_ved_uenighet', t('label:prosedyre-ved-uenighet').toLowerCase())
      hasErrors = hasErrors || _error
    }
    if ((replySed as F002Sed).formaal.indexOf('refusjon_i_henhold_til_artikkel_58_i_forordningen') >= 0) {
      _error = validateKravOmRefusjon(v, t, (replySed as F002Sed)?.refusjon_ihht_artikkel_58_i_forordning, 'formålmanager-refusjon_i_henhold_til_artikkel_58_i_forordningen', t('label:krav-om-refusjon').toLowerCase())
      hasErrors = hasErrors || _error
    }
    if (!_.isNil((replySed as F002Sed).utbetalingTilInstitusjon)) {
      _error = validateKontoopplysning(v, t, _.get(replySed, 'utbetalingTilInstitusjon'), 'formålmanager-kontoopplysninger', t('label:kontoopplysninger').toLowerCase())
      hasErrors = hasErrors || _error
    }
  }
  return hasErrors
}

export const validatePersonManager = (v: Validation, t: TFunction, replySed: ReplySed, personID: string): boolean => {
  let hasErrors: boolean = false
  let _error: boolean
  const personInfo: PersonInfo = _.get(replySed, `${personID}.personInfo`)
  const personName: string = personID === 'familie'
    ? t('label:familien').toLowerCase()
    : personInfo.fornavn + ' ' + personInfo.etternavn

  if (isFSed(replySed)) {
    if (personID !== 'familie') {
      _error = validatePersonOpplysninger(v, t, { personInfo, namespace: `personmanager-${personID}-personopplysninger`, personName })
      hasErrors = hasErrors || _error

      const statsborgerskaper: Array<Statsborgerskap> = _.get(replySed, `${personID}.personInfo.statsborgerskap`)
      _error = validateNasjonaliteter(v, t, statsborgerskaper, `personmanager-${personID}-nasjonaliteter`, personName)
      hasErrors = hasErrors || _error

      const adresser: Array<Adresse> = _.get(replySed, `${personID}.adresser`)
      _error = validateAdresser(v, t, adresser, `personmanager-${personID}-adresser`, personName)
      hasErrors = hasErrors || _error
    }

    if (!personID.startsWith('barn')) {
      if (personID === 'familie') {
        const ytelse: Ytelse = _.get(replySed, `${personID}.ytelse`)
        _error = validateFamilieytelse(v, t, { ytelse: ytelse, namespace: `personmanager-${personID}-familieytelser`, personName })
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
        _error = validateTrygdeordninger(v, t, perioder, `personmanager-${personID}-trygdeordninger`, personName)
        hasErrors = hasErrors || _error
        const familierelasjoner: Array<FamilieRelasjon> = _.get(replySed, `${personID}.familierelasjoner`)
        _error = validateFamilierelasjoner(v, t, familierelasjoner, `personmanager-${personID}-familierelasjon`, personName)
        hasErrors = hasErrors || _error

        const perioderSomAnsatt: Array<Periode> = _.get(replySed, `${personID}.perioderSomAnsatt`)
        _error = validateAnsattPerioder(v, t, perioderSomAnsatt, `personmanager-${personID}-personensstatus-ansatt`, personName)
        hasErrors = hasErrors || _error

        const perioderSomSelvstendig: Array<Periode> = _.get(replySed, `${personID}.perioderSomSelvstendig`)
        const perioderSomSykMedLoenn: Array<Periode> = _.get(replySed, `${personID}.perioderSomSykMedLoenn`)
        const perioderSomPermittertMedLoenn: Array<Periode> = _.get(replySed, `${personID}.perioderSomPermittertMedLoenn`)
        const perioderSomPermittertUtenLoenn: Array<Periode> = _.get(replySed, `${personID}.perioderSomPermittertUtenLoenn`)
        _error = validateNotAnsattPerioder(v, t, perioderSomSelvstendig, `personmanager-${personID}-personensstatus-notansatt-perioderSomSelvstendig`, personName)
        _error = validateNotAnsattPerioder(v, t, perioderSomSykMedLoenn, `personmanager-${personID}-personensstatus-notansatt-perioderSomSykMedLoenn`, personName)
        _error = validateNotAnsattPerioder(v, t, perioderSomPermittertMedLoenn, `personmanager-${personID}-personensstatus-notansatt-perioderSomPermittertMedLoenn`, personName)
        _error = validateNotAnsattPerioder(v, t, perioderSomPermittertUtenLoenn, `personmanager-${personID}-personensstatus-notansatt-perioderSomPermittertUtenLoenn`, personName)
        hasErrors = hasErrors || _error

        const perioderMedTrygd: Array<Periode> = _.get(replySed, `${personID}.perioderMedTrygd`)
        _error = validateAvsenderlandetPerioder(v, t, perioderMedTrygd, `personmanager-${personID}-personensstatus-avsenderlandet`, personName)
        hasErrors = hasErrors || _error

        const flyttegrunn: Flyttegrunn = _.get(replySed, `${personID}.flyttegrunn`)
        _error = validateAllGrunnlagForBosetting(v, t, flyttegrunn, `personmanager-${personID}-personensstatus-grunnlagforbosetting`, personName)
        hasErrors = hasErrors || _error

        const perioderMedPensjon: Array<PensjonPeriode> = _.get(replySed, `${personID}.perioderMedPensjon`)
        _error = validateWithSubsidiesPerioder(v, t, perioderMedPensjon, `personmanager-${personID}-personensstatus-withsubsidies`, personName)
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
  }

  if (isUSed(replySed)) {
    _error = validatePersonOpplysninger(v, t, { personInfo, namespace: `personmanager-${personID}-personopplysninger`, personName })
    hasErrors = hasErrors || _error

    _error = validateReferanseperiode(v, t, { anmodningsperiode: (replySed as USed)?.anmodningsperiode, namespace: `personmanager-${personID}-referanseperiode`, personName })
    hasErrors = hasErrors || _error

    const sisteansettelsesforhold: any = _.get(replySed, `${personID}.sisteansettelsesforhold`)
    _error = validateSisteansettelsesforhold(v, t, sisteansettelsesforhold, `personmanager-${personID}-sisteansettelsesforhold`)
    hasErrors = hasErrors || _error
  }

  if (isHSed(replySed)) {
    _error = validatePersonOpplysninger(v, t, { personInfo, namespace: `personmanager-${personID}-personopplysninger`, personName })
    hasErrors = hasErrors || _error

    _error = validateAdresser(v, t, _.get(replySed, `${personID}.adresser`), `personmanager-${personID}-adresser`, personName)
    hasErrors = hasErrors || _error

    _error = validateSvarPåForespørsel(v, t, { replySed, namespace: `personmanager-${personID}-svarpåforespørsel`, personName: t('label:svar-på-forespørsel').toLowerCase() })
    hasErrors = hasErrors || _error
  }

  return hasErrors
}

export const validateSEDSelection = (
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
    v['sedselection-saksnummerOrFnr'] = {
      feilmelding: t('message:validation-noSaksnummerOrFnr'),
      skjemaelementId: 'sedselection-saksnummerOrFnr'
    } as FeiloppsummeringFeil
    hasErrors = true
  }
  return hasErrors
}

export const validateSEDEditor = (
  v: Validation,
  t: TFunction,
  {
    replySed
  }: ValidationSEDEditorProps
): boolean => {
  let hasErrors: boolean = false
  let _error: boolean

  // this is common to all seds
  _error = validatePersonManager(v, t, replySed, 'bruker')
  hasErrors = hasErrors || _error

  if (isFSed(replySed)) {
    if (_.isEmpty((replySed as F002Sed).formaal)) {
      v['editor-formål'] = {
        feilmelding: t('message:validation-noFormaal'),
        skjemaelementId: 'editor-formål'
      } as FeiloppsummeringFeil
      hasErrors = true
    }

    if ((replySed as F002Sed).ektefelle) {
      _error = validatePersonManager(v, t, replySed, 'ektefelle')
      hasErrors = hasErrors || _error
    }
    if ((replySed as F002Sed).annenPerson) {
      _error = validatePersonManager(v, t, replySed, 'annenPerson')
      hasErrors = hasErrors || _error
    }
    if ((replySed as F002Sed).barn) {
      (replySed as F002Sed).barn.forEach((b: Person, i: number) => {
        _error = validatePersonManager(v, t, replySed, `barn[${i}]`)
        hasErrors = hasErrors || _error
      })
    }
    if ((replySed as F002Sed).familie) {
      _error = validatePersonManager(v, t, replySed, 'familie')
      hasErrors = hasErrors || _error
    }

    _error = validateFormålManager(v, t, replySed)
    hasErrors = hasErrors || _error
  }

  if (isHSed(replySed)) {
    if (_.isEmpty((replySed as HSed).tema)) {
      v['editor-tema'] = {
        feilmelding: t('message:validation-noTema'),
        skjemaelementId: 'editor-tema'
      } as FeiloppsummeringFeil
      hasErrors = true
    } else {
      if ((replySed as HSed).tema === 'GEN') {
        v['editor-tema'] = {
          feilmelding: t('message:validation-invalidTema'),
          skjemaelementId: 'editor-tema'
        } as FeiloppsummeringFeil
        hasErrors = true
      }
    }
  }

  // @ts-ignore
  if (!_.isEmpty(replySed?.ytterligereInfo?.trim()) && replySed?.ytterligereInfo?.trim().length > 500) {
    v['editor-ytterligereInfo'] = {
      feilmelding: t('message:validation-textOver500TilPerson', { person: 'SED' }),
      skjemaelementId: 'editor-ytterligereInfo'
    } as FeiloppsummeringFeil
    hasErrors = true
  }

  return hasErrors
}
