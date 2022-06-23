import { validateAdresser, ValidationAdresserProps } from 'applications/SvarSed/Adresser/validation'
import { validateAnmodning, ValidationAnmodningProps } from 'applications/SvarSed/Anmodning/validation'
import {
  validateAnmodningsPerioder,
  ValidationAnmodningsPerioderProps
} from 'applications/SvarSed/AnmodningsPeriode/validation'
import { validateAvslutning, ValidationAvslutningProps } from 'applications/SvarSed/Avslutning/validation'
import { validateAvvis, ValidationAvvisProps } from 'applications/SvarSed/Avvis/validation'
import {
  validateBeløpNavnOgValutas,
  ValidationBeløpNavnOgValutasProps
} from 'applications/SvarSed/BeløpNavnOgValuta/validation'
import { validateEndredeForhold, ValidationEndredeForholdProps } from 'applications/SvarSed/EndredeForhold/validation'
import {
  validateFamilierelasjoner,
  ValidationFamilierelasjonerProps
} from 'applications/SvarSed/Familierelasjon/validation'
import { validateFormål, ValidationFormålProps } from 'applications/SvarSed/Formål/validation'
import { validateForsikring, ValidateForsikringProps } from 'applications/SvarSed/Forsikring/validation'
import {
  validateGrunnlagForBosetting,
  ValidateGrunnlagForBosettingProps
} from 'applications/SvarSed/GrunnlagForBosetting/validation'
import { validateGrunnTilOpphor, ValidateGrunnTilOpphørProps } from 'applications/SvarSed/GrunnTilOpphør/validation'
import {
  validateLoennsopplysninger,
  ValidationLoennsopplysningerProps
} from 'applications/SvarSed/InntektForm/validation'
import { validateKlargjør, ValidationKlargjørProps } from 'applications/SvarSed/Klargjør/validation'
import {
  ValidateEposterProps,
  validateKontaktsinformasjonEposter,
  validateKontaktsinformasjonTelefoner, ValidateTelefonerProps
} from 'applications/SvarSed/Kontaktinformasjon/validation'
import {
  validateKontoopplysning,
  ValidationKontoopplysningProps
} from 'applications/SvarSed/Kontoopplysning/validation'
import { validateKravOmRefusjon, ValidationKravOmRefusjonProps } from 'applications/SvarSed/KravOmRefusjon/validation'
import { validateMotregninger, ValidationMotregningerProps } from 'applications/SvarSed/Motregning/validation'
import { validateNasjonaliteter, ValidationNasjonaliteterProps } from 'applications/SvarSed/Nasjonaliteter/validation'
import {
  validatePerioderDagpenger,
  ValidatePerioderDagpengerProps
} from 'applications/SvarSed/PeriodeForDagpenger/validation'
import {
  validatePersonensStatusPerioder,
  ValidationPersonensStatusProps
} from 'applications/SvarSed/PersonensStatus/validation'
import { validatePersonLight, ValidationPersonLightProps } from 'applications/SvarSed/PersonLight/validation'
import {
  validatePersonopplysninger,
  ValidationPersonopplysningerProps
} from 'applications/SvarSed/PersonOpplysninger/validation'
import {
  validateProsedyreVedUenighet,
  ValidationProsedyreVedUenighetProps
} from 'applications/SvarSed/ProsedyreVedUenighet/validation'
import { validatePurringer, ValidationPurringerProps } from 'applications/SvarSed/Påminnelse/validation'
import { validateReferanseperiode, ValidationReferanseperiodeProps } from 'applications/SvarSed/Referanseperiode/validation'
import { validateBarnetilhoerigheter, ValidationBarnetilhoerigheterProps } from 'applications/SvarSed/Relasjon/validation'
import { validateRettTilYtelse, ValidationRettTilYtelseProps } from 'applications/SvarSed/RettTilYtelser/validation'
import { validateSisteAnsettelseInfo, ValidateSisteAnsettelseInfoProps } from 'applications/SvarSed/SisteAnsettelseInfo/validation'
import {
  validateSvarPåForespørsel,
  ValidationSvarPåForespørselProps
} from 'applications/SvarSed/SvarPåForespørsel/validation'
import { validateSvarPåminnelse, ValidationSvarPåminnelseProps } from 'applications/SvarSed/SvarPåminnelse/validation'
import { validateTrygdeordninger, ValidateTrygdeordningerProps } from 'applications/SvarSed/Trygdeordning/validation'
import { validateUgyldiggjøre, ValidationUgyldiggjøreProps } from 'applications/SvarSed/Ugyldiggjøre/validation'
import { validateVedtak, ValidationVedtakProps } from 'applications/SvarSed/Vedtak/validation'
import {
  Adresse,
  Barnetilhoerighet,
  Epost,
  F002Sed,
  FamilieRelasjon,
  Flyttegrunn,
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
  USed, X001Sed, X008Sed, X009Sed, X010Sed, X011Sed, X012Sed,
  Ytelse
} from 'declarations/sed'
import { Validation } from 'declarations/types.d'
import i18n from 'i18n'
import _ from 'lodash'
import performValidation from 'utils/performValidation'
import {
  isFSed,
  isH001Sed,
  isH002Sed,
  isHSed,
  isUSed,
  isX001Sed,
  isX008Sed,
  isX009Sed,
  isX010Sed, isX011Sed, isX012Sed,
  isXSed
} from 'utils/sed'
import { addError, checkIfNotEmpty, checkLength } from 'utils/validation'

export interface ValidationSEDEditProps {
  replySed: ReplySed
}

export const validateBottomForm = (v: Validation, replySed: ReplySed): boolean => {
  const hasErrors: Array<boolean> = []
  if (!_.isEmpty((replySed as F002Sed).formaal)) {
    if ((replySed as F002Sed).formaal.indexOf('motregning') >= 0) {
      hasErrors.push(performValidation<ValidationMotregningerProps>(
        v, 'formål2-motregning', validateMotregninger, {
          replySed,
          formalName: i18n.t('label:motregning').toLowerCase()
        }, true))
    }
    if ((replySed as F002Sed).formaal.indexOf('vedtak') >= 0) {
      hasErrors.push(performValidation<ValidationVedtakProps>(
        v, 'formål2-vedtak', validateVedtak,{
        vedtak: _.get(replySed, 'vedtak'),
        formalName: i18n.t('label:vedtak').toLowerCase()
      }))
    }
    if ((replySed as F002Sed).formaal.indexOf('prosedyre_ved_uenighet') >= 0) {
      hasErrors.push(performValidation<ValidationProsedyreVedUenighetProps>(
        v, 'formål2-prosedyre_ved_uenighet', validateProsedyreVedUenighet, {
        prosedyreVedUenighet: _.get(replySed, 'uenighet'),
        formalName: i18n.t('label:prosedyre-ved-uenighet').toLowerCase()
      }))
    }
    if ((replySed as F002Sed).formaal.indexOf('refusjon_i_henhold_til_artikkel_58_i_forordningen') >= 0) {
      hasErrors.push(performValidation<ValidationKravOmRefusjonProps>(v, 'formål2-refusjonskrav', validateKravOmRefusjon, {
        kravOmRefusjon: (replySed as F002Sed)?.refusjonskrav,
        formalName: i18n.t('label:krav-om-refusjon').toLowerCase()
      }))
    }
    if (!_.isNil((replySed as F002Sed).utbetalingTilInstitusjon)) {
      hasErrors.push(performValidation<ValidationKontoopplysningProps>(v, 'formål2-kontoopplysninger', validateKontoopplysning, {
        uti: _.get(replySed, 'utbetalingTilInstitusjon'),
        formalName: i18n.t('label:kontoopplysninger').toLowerCase()
      }))
    }
  }

  return hasErrors.find(value => value) !== undefined
}

export const validateMainForm = (v: Validation, _replySed: ReplySed, personID: string): boolean => {
  const hasErrors: Array<boolean> = []
  const replySed = _.cloneDeep(_replySed)
  const personInfo: PersonInfo =
    isXSed(replySed)
      ? _.get(replySed, 'bruker')
      : _.get(replySed, `${personID}.personInfo`)
  const personName: string = personID === 'familie'
    ? i18n.t('label:familien').toLowerCase()
    : personInfo.fornavn + ' ' + (personInfo.etternavn ?? '')

  if (isFSed(replySed)) {
    if (personID !== 'familie') {
      hasErrors.push(performValidation<ValidationPersonopplysningerProps>(v, `svarsed-${personID}-personopplysninger`, validatePersonopplysninger,{
        personInfo, personName
      }))

      const statsborgerskaper: Array<Statsborgerskap> = _.get(replySed, `${personID}.personInfo.statsborgerskap`)
      hasErrors.push(performValidation<ValidationNasjonaliteterProps>(v, `svarsed-${personID}-nasjonaliteter`, validateNasjonaliteter, {
        statsborgerskaper, personName
      }))

      const adresser: Array<Adresse> = _.get(replySed, `${personID}.adresser`)
      hasErrors.push(performValidation<ValidationAdresserProps>(v, `svarsed-${personID}-adresser`, validateAdresser,{
        adresser, checkAdresseType: true, personName
      }))
    }

    if (!personID.startsWith('barn')) {
      if (personID === 'familie') {
        const ytelser: Array<Ytelse> = _.get(replySed, `${personID}.ytelser`)
        hasErrors.push(performValidation<ValidationBeløpNavnOgValutasProps>(v, `svarsed-${personID}-familieytelser`, validateBeløpNavnOgValutas,{
          ytelser, personID, personName
        }))
      } else {
        const telefoner: Array<Telefon> = _.get(replySed, `${personID}.telefon`)
        hasErrors.push(performValidation<ValidateTelefonerProps>(v, `svarsed-${personID}-kontaktinformasjon-telefon`, validateKontaktsinformasjonTelefoner,{
          telefoner, personName
        }))
        const eposter: Array<Epost> = _.get(replySed, `${personID}.epost`)
        hasErrors.push(performValidation<ValidateEposterProps>(v, `svarsed-${personID}-kontaktinformasjon-epost`, validateKontaktsinformasjonEposter, {
          eposter, personName
        }))
        hasErrors.push(performValidation<ValidateTrygdeordningerProps>(v, `svarsed-${personID}-trygdeordninger`, validateTrygdeordninger, {
          replySed, personID, personName
        }))
        const familierelasjoner: Array<FamilieRelasjon> = _.get(replySed, `${personID}.familierelasjoner`)
        hasErrors.push(performValidation<ValidationFamilierelasjonerProps>(v, `svarsed-${personID}-familierelasjon`, validateFamilierelasjoner, {
          familierelasjoner, personName
        }))
        const person: Person = _.get(replySed, `${personID}`)
        hasErrors.push(performValidation<ValidationPersonensStatusProps>(v, `svarsed-${personID}-personensstatus`, validatePersonensStatusPerioder, {
          person, personName
        }))
      }
    } else {
      const barnetilhoerigheter : Array<Barnetilhoerighet> = _.get(replySed, `${personID}.barnetilhoerigheter`)
      hasErrors.push(performValidation<ValidationBarnetilhoerigheterProps>(v, `svarsed-${personID}-relasjon`, validateBarnetilhoerigheter, {
        barnetilhoerigheter, personName
      }))
      const flyttegrunn: Flyttegrunn = _.get(replySed, `${personID}.flyttegrunn`)
      hasErrors.push(performValidation<ValidateGrunnlagForBosettingProps>(v, `svarsed-${personID}-grunnlagforbosetting`, validateGrunnlagForBosetting, {
        flyttegrunn, personName
      }))
      const ytelser: Array<Ytelse> = _.get(replySed, `${personID}.ytelser`)
      if ((replySed as FSed).formaal.indexOf('vedtak') >= 0) {
        hasErrors.push(performValidation<ValidationBeløpNavnOgValutasProps>(v, `svarsed-${personID}-beløpnavnogvaluta`, validateBeløpNavnOgValutas, {
          ytelser, personID, personName
        }))
      }
    }
  }

  if (isUSed(replySed)) {
    hasErrors.push(performValidation<ValidationPersonopplysningerProps>(v, `svarsed-${personID}-personopplysninger`, validatePersonopplysninger,{
      personInfo, personName
    }))
    hasErrors.push(performValidation<ValidationReferanseperiodeProps>(v, `svarsed-${personID}-referanseperiode`, validateReferanseperiode,{
      anmodningsperiode: (replySed as USed)?.anmodningsperiode, personName
    }))
    if (replySed.sedType === 'U002' || replySed.sedType === 'U017') {
      hasErrors.push(performValidation<ValidateForsikringProps>(v, `svarsed-${personID}-forsikring`, validateForsikring, {
        replySed: (replySed as USed), personName
      }))
      hasErrors.push(performValidation<ValidatePerioderDagpengerProps>(v, `svarsed-${personID}-periodefordagpenger`, validatePerioderDagpenger, {
        perioderDagpenger: (replySed as U002Sed)?.dagpengeperioder,
        personName
      }))
      const nrArbeidsperioder = (
        ((replySed as U002Sed)?.perioderAnsattMedForsikring?.length ?? 0) +
        ((replySed as U002Sed)?.perioderSelvstendigMedForsikring?.length ?? 0) +
        ((replySed as U002Sed)?.perioderAnsattUtenForsikring?.length ?? 0) +
        ((replySed as U002Sed)?.perioderSelvstendigUtenForsikring?.length ?? 0)
      )

      let allArbeidsPerioderHaveSluttdato = true

      // U002. "Grunn til opphør" er ikke obligatorisk på en arbeidsperiode med åpen sluttdato.
      if (replySed.sedType === 'U002') {
        if (
          _.find((replySed as U002Sed)?.perioderAnsattMedForsikring, p => _.isEmpty(p.sluttdato)) ||
          _.find((replySed as U002Sed)?.perioderSelvstendigMedForsikring, p => _.isEmpty(p.sluttdato)) ||
          _.find((replySed as U002Sed)?.perioderAnsattUtenForsikring, p => _.isEmpty(p.sluttdato)) ||
          _.find((replySed as U002Sed)?.perioderSelvstendigUtenForsikring, p => _.isEmpty(p.sluttdato))
        ) {
          allArbeidsPerioderHaveSluttdato = false
        }
      }

      if (nrArbeidsperioder > 0 && allArbeidsPerioderHaveSluttdato) {
        hasErrors.push(performValidation<ValidateGrunnTilOpphørProps>(v, `svarsed-${personID}-grunntilopphør`, validateGrunnTilOpphor, {
          sisteAnsettelseInfo: (replySed as U002Sed)?.sisteAnsettelseInfo
        }))
      }
      hasErrors.push(performValidation<ValidateSisteAnsettelseInfoProps>(v, `svarsed-${personID}-sisteAnsettelseInfo`, validateSisteAnsettelseInfo, {
        sisteAnsettelseInfo: (replySed as U002Sed)?.sisteAnsettelseInfo
      }))
    }

    if (replySed.sedType === 'U004') {
      hasErrors.push(performValidation<ValidationLoennsopplysningerProps>(v, `svarsed-${personID}-inntekt`, validateLoennsopplysninger, {
        loennsopplysninger: (replySed as U004Sed)?.loennsopplysninger
      }))
    }

    if (replySed.sedType === 'U017') {
      hasErrors.push(performValidation<ValidationRettTilYtelseProps>(v, `svarsed-${personID}-retttilytelser`, validateRettTilYtelse, {
        rettTilYtelse: (replySed as U017Sed)?.rettTilYtelse
      }))
    }
  }

  if (isHSed(replySed)) {
    hasErrors.push(performValidation<ValidationPersonopplysningerProps>(v, `svarsed-${personID}-personopplysninger`, validatePersonopplysninger,{
      personInfo, personName
    }))
    hasErrors.push(performValidation<ValidationAdresserProps>(v, `svarsed-${personID}-adresser`, validateAdresser, {
      adresser: _.get(replySed, `${personID}.adresser`), checkAdresseType: true, personName
    }))
    if (isH002Sed(replySed)) {
      hasErrors.push(performValidation<ValidationSvarPåForespørselProps>(v, `svarsed-${personID}-svarpåforespørsel`, validateSvarPåForespørsel, {
        replySed,
        personName: i18n.t('label:svar-på-forespørsel').toLowerCase()
      }))
    }
    if (isH001Sed(replySed)) {
      hasErrors.push(performValidation<ValidationAnmodningProps>(v, `svarsed-${personID}-anmodning`, validateAnmodning, {
        replySed,
        personName: i18n.t('label:anmodning-om-informasjon').toLowerCase()
      }))
      hasErrors.push(performValidation<ValidationEndredeForholdProps>(v, `svarsed-${personID}-endredeforhold`, validateEndredeForhold, {
        replySed,
        personName: i18n.t('label:ytterligere-informasjon_endrede_forhold').toLowerCase()
      }))
    }
  }

  if (isXSed(replySed)) {
    hasErrors.push(performValidation<ValidationPersonLightProps>(v, `svarsed-${personID}-personlight`, validatePersonLight, {
      personLight: (replySed as X001Sed).bruker, personName
    }))

    if (isX001Sed(replySed)) {
      hasErrors.push(performValidation<ValidationAvslutningProps>(v, `svarsed-${personID}-avslutning`, validateAvslutning, {
        replySed: (replySed as X001Sed), personName
      }))
    }
    if (isX008Sed(replySed)) {
      hasErrors.push(performValidation<ValidationUgyldiggjøreProps>(v, `svarsed-${personID}-ugyldiggjøre`, validateUgyldiggjøre, {
        replySed: (replySed as X008Sed), personName
      }))
    }
    if (isX009Sed(replySed)) {
      hasErrors.push(performValidation<ValidationPurringerProps>(v, `svarsed-${personID}-påminnelse`, validatePurringer, {
        purringer: _.get(replySed as X009Sed, 'purringer'), personName
      }))
    }
    if (isX010Sed(replySed)) {
      hasErrors.push(performValidation<ValidationSvarPåminnelseProps>(v, `svarsed-${personID}-svarpåminnelse`, validateSvarPåminnelse, {
        besvarelseKommer: _.get(replySed as X010Sed, 'besvarelseKommer'),
        besvarelseUmulig: _.get(replySed as X010Sed, 'besvarelseUmulig'),
        personName
      }))
    }
    if (isX011Sed(replySed)) {
      hasErrors.push(performValidation<ValidationAvvisProps>(v, `svarsed-${personID}-avvis`, validateAvvis, {
        replySed: (replySed as X011Sed), personName
      }))
    }
    if (isX012Sed(replySed)) {
      hasErrors.push(performValidation<ValidationKlargjørProps>(v, `svarsed-${personID}-klargjør`, validateKlargjør, {
        replySed: (replySed as X012Sed), personName
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
    hasErrors.push(performValidation<ValidationFormålProps>(v, 'formål1-formål', validateFormål, {
      formaal: (replySed as FSed).formaal
    }))
    hasErrors.push(performValidation<ValidationAnmodningsPerioderProps>(v, 'formål1-anmodningsperiode', validateAnmodningsPerioder, {
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
