import { validateAdresser } from 'applications/SvarSed/Adresser/validation'
import { validateAnmodning } from 'applications/SvarSed/Anmodning/validation'
import { validateAnmodningsPerioder } from 'applications/SvarSed/AnmodningsPeriode/validation'
import { validateBeløpNavnOgValutas } from 'applications/SvarSed/BeløpNavnOgValuta/validation'
import { validateEndredeForhold } from 'applications/SvarSed/EndredeForhold/validation'
import { validateFamilierelasjoner } from 'applications/SvarSed/Familierelasjon/validation'
import { validateFormål } from 'applications/SvarSed/Formål/validation'
import { validateAlleForsikringPerioder } from 'applications/SvarSed/Forsikring/validation'
import { validateGrunnlagForBosetting } from 'applications/SvarSed/GrunnlagForBosetting/validation'
import { validateGrunnTilOpphor } from 'applications/SvarSed/GrunnTilOpphør/validation'
import { validateLoennsopplysninger } from 'applications/SvarSed/InntektForm/validationInntektForm'
import {
  validateKontaktsinformasjonEposter,
  validateKontaktsinformasjonTelefoner
} from 'applications/SvarSed/Kontaktinformasjon/validation'
import { validateKontoopplysning } from 'applications/SvarSed/Kontoopplysning/validation'
import { validateKravOmRefusjon } from 'applications/SvarSed/KravOmRefusjon/validation'
import { validateMotregninger } from 'applications/SvarSed/Motregning/validation'
import { validateNasjonaliteter } from 'applications/SvarSed/Nasjonaliteter/validation'
import { validatePerioderDagpenger } from 'applications/SvarSed/PeriodeForDagpenger/validation'
import { validatePersonensStatusPerioder } from 'applications/SvarSed/PersonensStatus/validation'
import { validatePersonopplysninger } from 'applications/SvarSed/PersonOpplysninger/validation'
import { validateProsedyreVedUenighet } from 'applications/SvarSed/ProsedyreVedUenighet/validation'
import { validateReferanseperiode } from 'applications/SvarSed/Referanseperiode/validation'
import { validateBarnetilhoerigheter } from 'applications/SvarSed/Relasjon/validation'
import { validateRettTilYtelse } from 'applications/SvarSed/RettTilYtelser/validation'
import { validateSisteAnsettelseInfo } from 'applications/SvarSed/SisteAnsettelseInfo/validation'
import { validateSvarPåForespørsel } from 'applications/SvarSed/SvarPåForespørsel/validation'
import { validateTrygdeordninger } from 'applications/SvarSed/Trygdeordning/validation'
import { validateVedtak } from 'applications/SvarSed/Vedtak/validation'
import {
  Adresse,
  Barnetilhoerighet,
  Epost,
  F002Sed,
  FamilieRelasjon,
  Flyttegrunn,
  ForsikringPeriode,
  FSed,
  H001Sed,
  HSed,
  Person,
  PersonInfo,
  ReplySed,
  Statsborgerskap,
  Telefon,
  U002Sed,
  U004Sed,
  U017Sed,
  USed,
  Ytelse
} from 'declarations/sed'
import { Validation } from 'declarations/types.d'
import i18n from 'i18n'
import _ from 'lodash'
import { isFSed, isH001Sed, isH002Sed, isHSed, isUSed } from 'utils/sed'
import { addError, checkIfNotEmpty, checkLength } from 'utils/validation'

export interface ValidationSEDEditProps {
  replySed: ReplySed
}

export const validateBottomForm = (v: Validation, replySed: ReplySed): boolean => {
  const hasErrors: Array<boolean> = []

  if (!_.isEmpty((replySed as F002Sed).formaal)) {
    if ((replySed as F002Sed).formaal.indexOf('motregning') >= 0) {
      hasErrors.push(validateMotregninger(v, 'formål2-motregning', {
        replySed,
        formalName: i18n.t('label:motregning').toLowerCase()
      }))
    }
    if ((replySed as F002Sed).formaal.indexOf('vedtak') >= 0) {
      hasErrors.push(validateVedtak(v, 'formål2-vedtak', {
        vedtak: _.get(replySed, 'vedtak'),
        formalName: i18n.t('label:vedtak').toLowerCase()
      }))
    }
    if ((replySed as F002Sed).formaal.indexOf('prosedyre_ved_uenighet') >= 0) {
      hasErrors.push(validateProsedyreVedUenighet(v, 'formål2-prosedyre_ved_uenighet', {
        prosedyreVedUenighet: _.get(replySed, 'uenighet'),
        formalName: i18n.t('label:prosedyre-ved-uenighet').toLowerCase()
      }))
    }
    if ((replySed as F002Sed).formaal.indexOf('refusjon_i_henhold_til_artikkel_58_i_forordningen') >= 0) {
      hasErrors.push(validateKravOmRefusjon(v, 'formål2-refusjonskrav', {
        kravOmRefusjon: (replySed as F002Sed)?.refusjonskrav,
        formalName: i18n.t('label:krav-om-refusjon').toLowerCase()
      }))
    }
    if (!_.isNil((replySed as F002Sed).utbetalingTilInstitusjon)) {
      hasErrors.push(validateKontoopplysning(v, 'formål2-kontoopplysninger', {
        uti: _.get(replySed, 'utbetalingTilInstitusjon'),
        formalName: i18n.t('label:kontoopplysninger').toLowerCase()
      }))
    }
  }

  return hasErrors.find(value => value) !== undefined
}

export const validateMainForm = (v: Validation, replySed: ReplySed, personID: string): boolean => {
  const hasErrors: Array<boolean> = []
  const personInfo: PersonInfo = _.get(replySed, `${personID}.personInfo`)
  const personName: string = personID === 'familie'
    ? i18n.t('label:familien').toLowerCase()
    : personInfo.fornavn + ' ' + (personInfo.etternavn ?? '')

  if (isFSed(replySed)) {
    if (personID !== 'familie') {
      hasErrors.push(validatePersonopplysninger(v, `svarsed-${personID}-personopplysninger`, {
        personInfo, personName
      }))

      const statsborgerskaper: Array<Statsborgerskap> = _.get(replySed, `${personID}.personInfo.statsborgerskap`)
      hasErrors.push(validateNasjonaliteter(v, `svarsed-${personID}-nasjonaliteter`, {
        statsborgerskaper, personName
      }))

      const adresser: Array<Adresse> = _.get(replySed, `${personID}.adresser`)
      hasErrors.push(validateAdresser(v, `svarsed-${personID}-adresser`, {
        adresser, checkAdresseType: true, personName
      }))
    }

    if (!personID.startsWith('barn')) {
      if (personID === 'familie') {
        const ytelser: Array<Ytelse> = _.get(replySed, `${personID}.ytelser`)
        hasErrors.push(validateBeløpNavnOgValutas(v, `svarsed-${personID}-familieytelser`, {
          ytelser, personID, personName
        }))
      } else {
        const telefoner: Array<Telefon> = _.get(replySed, `${personID}.telefon`)
        hasErrors.push(validateKontaktsinformasjonTelefoner(v, `svarsed-${personID}-kontaktinformasjon-telefon`, {
          telefoner, personName
        }))
        const eposter: Array<Epost> = _.get(replySed, `${personID}.epost`)
        hasErrors.push(validateKontaktsinformasjonEposter(v, `svarsed-${personID}-kontaktinformasjon-epost`, {
          eposter, personName
        }))
        hasErrors.push(validateTrygdeordninger(v, `svarsed-${personID}-trygdeordninger`, {
          replySed, personID, personName
        }))
        const familierelasjoner: Array<FamilieRelasjon> = _.get(replySed, `${personID}.familierelasjoner`)
        hasErrors.push(validateFamilierelasjoner(v, `svarsed-${personID}-familierelasjon`, {
          familierelasjoner, personName
        }))
        const person: Person = _.get(replySed, `${personID}`)
        hasErrors.push(validatePersonensStatusPerioder(v, `svarsed-${personID}-personensstatus`, {
          person, personName
        }))
      }
    } else {
      const barnetilhoerigheter : Array<Barnetilhoerighet> = _.get(replySed, `${personID}.barnetilhoerigheter`)
      hasErrors.push(validateBarnetilhoerigheter(v, `svarsed-${personID}-relasjon`, {
        barnetilhoerigheter, personName
      }))
      const flyttegrunn: Flyttegrunn = _.get(replySed, `${personID}.flyttegrunn`)
      hasErrors.push(validateGrunnlagForBosetting(v, `svarsed-${personID}-grunnlagforbosetting`, {
        flyttegrunn, personName
      }))
      const ytelser: Array<Ytelse> = _.get(replySed, `${personID}.ytelser`)
      if ((replySed as FSed).formaal.indexOf('vedtak') >= 0) {
        hasErrors.push(validateBeløpNavnOgValutas(v, `svarsed-${personID}-beløpnavnogvaluta`, {
          ytelser, personID, personName
        }))
      }
    }
  }

  if (isUSed(replySed)) {
    hasErrors.push(validatePersonopplysninger(v, `svarsed-${personID}-personopplysninger`, {
      personInfo, personName
    }))
    hasErrors.push(validateReferanseperiode(v, `svarsed-${personID}-referanseperiode`, {
      anmodningsperiode: (replySed as USed)?.anmodningsperiode, personName
    }))
    if (replySed.sedType === 'U002' || replySed.sedType === 'U017') {
      //
      const perioder: {[k in string]: Array<ForsikringPeriode>| undefined} = {
        perioderAnsattMedForsikring: (replySed as U002Sed)?.perioderAnsattMedForsikring,
        perioderSelvstendigMedForsikring: (replySed as U002Sed)?.perioderSelvstendigMedForsikring,
        perioderAnsattUtenForsikring: (replySed as U002Sed)?.perioderAnsattUtenForsikring,
        perioderSelvstendigUtenForsikring: (replySed as U002Sed)?.perioderSelvstendigUtenForsikring,
        perioderSyk: (replySed as U002Sed)?.perioderSyk,
        perioderSvangerskapBarn: (replySed as U002Sed)?.perioderSvangerskapBarn,
        perioderUtdanning: (replySed as U002Sed)?.perioderUtdanning,
        perioderMilitaertjeneste: (replySed as U002Sed)?.perioderMilitaertjeneste,
        perioderFrihetsberoevet: (replySed as U002Sed)?.perioderFrihetsberoevet,
        perioderFrivilligForsikring: (replySed as U002Sed)?.perioderFrivilligForsikring,
        perioderKompensertFerie: (replySed as U002Sed)?.perioderKompensertFerie,
        perioderAnnenForsikring: (replySed as U002Sed)?.perioderAnnenForsikring
      }
      hasErrors.push(validateAlleForsikringPerioder(v, `svarsed-${personID}-forsikring`, {
        perioder, personName
      }))
      hasErrors.push(validatePerioderDagpenger(v, `svarsed-${personID}-periodefordagpenger`, {
        perioderDagpenger: (replySed as U002Sed)?.perioderDagpenger,
        personName
      }))
      const nrArbeidsperioder = (
        (perioder?.perioderAnsattMedForsikring?.length ?? 0) +
        (perioder?.perioderSelvstendigMedForsikring?.length ?? 0) +
        (perioder?.perioderAnsattUtenForsikring?.length ?? 0) +
        (perioder?.perioderSelvstendigUtenForsikring?.length ?? 0)
      )

      let allArbeidsPerioderHaveSluttdato = true

      // U002. "Grunn til opphør" er ikke obligatorisk på en arbeidsperiode med åpen sluttdato.
      if (replySed.sedType === 'U002') {
        if (
          _.find(perioder?.perioderAnsattMedForsikring, p => _.isEmpty(p.sluttdato)) ||
          _.find(perioder?.perioderSelvstendigMedForsikring, p => _.isEmpty(p.sluttdato)) ||
          _.find(perioder?.perioderAnsattUtenForsikring, p => _.isEmpty(p.sluttdato)) ||
          _.find(perioder?.perioderSelvstendigUtenForsikring, p => _.isEmpty(p.sluttdato))
        ) {
          allArbeidsPerioderHaveSluttdato = false
        }
      }

      if (nrArbeidsperioder > 0 && allArbeidsPerioderHaveSluttdato) {
        hasErrors.push(validateGrunnTilOpphor(v, `svarsed-${personID}-grunntilopphør`, {
          grunntilopphor: (replySed as U002Sed)?.grunntilopphor
        }))
      }
      hasErrors.push(validateSisteAnsettelseInfo(v, `svarsed-${personID}-sisteAnsettelseInfo`, {
        sisteansettelseinfo: (replySed as U002Sed)?.sisteAnsettelseInfo
      }))
    }

    if (replySed.sedType === 'U004') {
      hasErrors.push(validateLoennsopplysninger(v, `svarsed-${personID}-inntekt`, {
        loennsopplysninger: (replySed as U004Sed)?.loennsopplysninger
      }))
    }

    if (replySed.sedType === 'U017') {
      hasErrors.push(validateRettTilYtelse(v, `svarsed-${personID}-retttilytelser`, {
        rettTilTytelse: (replySed as U017Sed)?.rettTilYtelse
      }))
    }
  }

  if (isHSed(replySed)) {
    hasErrors.push(validatePersonopplysninger(v, `svarsed-${personID}-personopplysninger`, {
      personInfo, personName
    }))
    hasErrors.push(validateAdresser(v, `svarsed-${personID}-adresser`, {
      adresser: _.get(replySed, `${personID}.adresser`), checkAdresseType: true, personName
    }))
    if (isH002Sed(replySed)) {
      hasErrors.push(validateSvarPåForespørsel(v, `svarsed-${personID}-svarpåforespørsel`, {
        replySed,
        personName: i18n.t('label:svar-på-forespørsel').toLowerCase()
      }))
    }
    if (isH001Sed(replySed)) {
      hasErrors.push(validateAnmodning(v, `svarsed-${personID}-anmodning`, {
        replySed,
        personName: i18n.t('label:anmodning-om-informasjon').toLowerCase()
      }))
      hasErrors.push(validateEndredeForhold(v, `svarsed-${personID}-endredeforhold`, {
        replySed,
        personName: i18n.t('label:ytterligere-informasjon_endrede_forhold').toLowerCase()
      }))
    }
  }

  return hasErrors.find(value => value) !== undefined
}

export const validateSEDEdit = (
  v: Validation,
  namespace: string,
  {
    replySed
  }: ValidationSEDEditProps
): boolean => {
  const hasErrors: Array<boolean> = []

  // this is common to all seds
  hasErrors.push(validateMainForm(v, replySed, 'bruker'))

  if (isFSed(replySed)) {
    hasErrors.push(validateFormål(v, 'formål1-formål', {
      formaal: (replySed as FSed).formaal
    }))
    hasErrors.push(validateAnmodningsPerioder(v, 'formål1-anmodningsperiode', {
      anmodningsperioder: (replySed as FSed).anmodningsperioder
    }))
    if ((replySed as F002Sed).ektefelle) {
      hasErrors.push(validateMainForm(v, replySed, 'ektefelle'))
    }
    if ((replySed as F002Sed).annenPerson) {
      hasErrors.push(validateMainForm(v, replySed, 'annenPerson'))
    }
    (replySed as F002Sed).barn?.forEach((b: Person, i: number) => {
      hasErrors.push(validateMainForm(v, replySed, `barn[${i}]`))
    })
    if ((replySed as F002Sed).familie) {
      hasErrors.push(validateMainForm(v, replySed, 'familie'))
    }
    hasErrors.push(validateBottomForm(v, replySed))
  }

  if (isHSed(replySed)) {
    hasErrors.push(checkIfNotEmpty(v, {
      needle: (replySed as HSed).tema,
      id: 'editor-tema',
      message: 'validation:noTema'
    }))

    if (!_.isEmpty((replySed as HSed).tema)) {
      if ((replySed as HSed).tema === 'GEN') {
        hasErrors.push(addError(v, {
          id: 'editor-tema',
          message: 'validation:invalidTema'
        }))
      }
    }
  }
  if (!isH001Sed(replySed)) {
    hasErrors.push(checkLength(v, {
      needle: (replySed as H001Sed)?.ytterligereInfo,
      max: 500,
      id: 'editor-ytterligereInfo',
      message: 'validation:textOverX'
    }))
  }

  return hasErrors.find(value => value) !== undefined
}
