import { validateAdresser, ValidationAdresserProps } from 'applications/SvarSed/Adresser/validation'
import { validateAnmodning, ValidationAnmodningProps } from 'applications/SvarSed/Anmodning/validation'
import {
  validateAnmodningsPerioder, validateKrav,
  ValidationAnmodningsPerioderProps, ValidationKravProps
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
import {validateKravOmRefusjon, validateRefusjon, ValidationKravOmRefusjonProps, ValidationRefusjonProps, ValidationRefusjonsKravProps} from 'applications/SvarSed/KravOmRefusjon/validation'
import { validateMotregninger, ValidationMotregningerProps } from 'applications/SvarSed/Motregninger/validation'
import { validateNasjonaliteter, ValidationNasjonaliteterProps } from 'applications/SvarSed/Nasjonaliteter/validation'
import {
  validatePerioderDagpenger,
  ValidatePerioderDagpengerProps
} from 'applications/SvarSed/PeriodeForDagpenger/validation'
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
import {validateTrygdeordning, validateTrygdeordninger, ValidateTrygdeordningerProps} from 'applications/SvarSed/Trygdeordning/validation'
import { validateUgyldiggjøre, ValidationUgyldiggjøreProps } from 'applications/SvarSed/Ugyldiggjøre/validation'
import { validateVedtak, ValidationVedtakProps } from 'applications/SvarSed/Vedtak/validation'
import {
  Adresse,
  Barnetilhoerighet,
  Epost,
  FamilieRelasjon,
  Flyttegrunn,
  FSed,
  Periode,
  PersonBarn,
  PersonInfo,
  ReplySed,
  Statsborgerskap,
  Telefon,
  F002Sed,
  F003Sed,
  F026Sed,
  F027Sed,
  H001Sed,
  S040Sed,
  USed,
  U002Sed,
  U004Sed,
  U017Sed,
  X001Sed,
  X008Sed,
  X009Sed,
  X010Sed,
  X011Sed,
  X012Sed,
  Ytelse, Barn, PersonTypeF001, S046Sed, PersonTypeAnnenPersonF003, RettIkkeRettTilFamilieYtelse
} from 'declarations/sed'
import { Validation } from 'declarations/types.d'
import i18n from 'i18n'
import _ from 'lodash'
import performValidation from 'utils/performValidation'
import {
  isF001Sed, isF002Sed, isF003Sed, isF026Sed, isF027Sed,
  isFSed,
  isH001Sed,
  isH002Sed,
  isHSed,
  isS040Sed,
  isS046Sed,
  isUSed,
  isX001Sed,
  isX008Sed,
  isX009Sed,
  isX010Sed, isX011Sed, isX012Sed,
  isXSed
} from 'utils/sed'
import { checkLength } from 'utils/validation'
import {getAllArbeidsPerioderHaveSluttDato, getNrOfArbeidsPerioder} from "../../utils/arbeidsperioder";
import {validateYtterligereInfo, ValidationYtterligereInfoProps} from "../../applications/SvarSed/YtterligereInfo/validation";
import { validateVedtak as validateVedtakF003, ValidationVedtakProps as ValidationVedtakF003Props } from 'applications/SvarSed/VedtakForF003/validation'
import {validateTrygdeOrdninger, ValidationTrygdeOrdningerProps} from "../../applications/SvarSed/RettTilYtelserFSED/validation";
import {validateFamilierelasjon, ValidationFamilierelasjonProps} from "../../applications/SvarSed/FamilieRelasjonF003/validation";
import {validateEtterspurtInformasjon, ValidationEtterspurtInformasjonProps} from "../../applications/SvarSed/EtterspurtInformasjon/validation";
import {validateAdopsjon, ValidationAdopsjonProps} from "../../applications/SvarSed/SvarPaaForespoerselOmAdopsjon/validation";
import {validateInntekt, ValidationInntektProps} from "../../applications/SvarSed/SvarPaaAnmodningOmInntekt/validation";
import {
  validateYtelseTilForeldreloese,
  ValidationYtelseTilForeldreloeseProps
} from "../../applications/SvarSed/SvarPaaAnmodningOmBarnepensjon/validation";
import {
  validateAnnenInformasjonBarnet,
  ValidationAnnenInformasjonBarnetProps
} from "../../applications/SvarSed/SvarPaaAnmodningOmAnnenInformasjonOmBarnet/validation";
import {
  validateUtdanning,
  ValidationUtdanningProps
} from "../../applications/SvarSed/SvarOmFremmoeteUtdanning/validation";
import {validateForespoersel, ValidationForespoerselProps} from "../../applications/SvarSed/Forespoersel/validation";
import {
  validateAktivitetOgTrygdeperioder,
  validateAktivitetStatusOgTrygdeperioder,
  ValidateAktivitetOgTrygdeperioderProps,
} from "../../applications/SvarSed/AktivitetOgTrygdeperioder/validation";
import {validateInformasjonOmUtbetaling, ValidationInformasjonOmUtbetalingProps} from "../../applications/SvarSed/InformasjonOmUtbetaling/validation";
import {validatePerioderMedRettTilYtelser, ValidationPerioderMedRettTilYtelserProps} from "../../applications/SvarSed/PerioderMedRettTilYtelser/validation";

export interface ValidationSEDEditProps {
  replySed: ReplySed
}

export const validateVedtakForF003 = (v: Validation, replySed: ReplySed): boolean => {
  const hasErrors: Array<boolean> = []
  hasErrors.push(performValidation<ValidationVedtakF003Props>(
    v, 'vedtak-vedtak', validateVedtakF003, {
      vedtak: _.get(replySed, 'vedtak'),
      formalName: i18n.t('label:vedtak').toLowerCase()
    }, true))
  return hasErrors.find(value => value) !== undefined
}

export const validateBottomForm = (v: Validation, replySed: ReplySed): boolean => {
  const hasErrors: Array<boolean> = []
  if (!_.isEmpty((replySed as F002Sed).formaal)) {
    if ((replySed as F002Sed).formaal.indexOf('motregning') >= 0) {
      hasErrors.push(performValidation<ValidationMotregningerProps>(
        v, 'formål2-motregninger', validateMotregninger, {
          replySed,
          formalName: i18n.t('label:motregning').toLowerCase()
        }, true))
    }
    if ((replySed as F002Sed).formaal.indexOf('vedtak') >= 0) {
      hasErrors.push(performValidation<ValidationVedtakProps>(
        v, 'formål2-vedtak', validateVedtak, {
          vedtak: _.get(replySed, 'vedtak'),
          formalName: i18n.t('label:vedtak').toLowerCase()
        }, true))
    }
    if ((replySed as F002Sed).formaal.indexOf('prosedyre_ved_uenighet') >= 0) {
      hasErrors.push(performValidation<ValidationProsedyreVedUenighetProps>(
        v, 'formål2-prosedyre_ved_uenighet', validateProsedyreVedUenighet, {
          prosedyreVedUenighet: _.get(replySed, 'uenighet'),
          formalName: i18n.t('label:prosedyre-ved-uenighet').toLowerCase()
        }, true))
    }
    if ((replySed as F002Sed).formaal.indexOf('refusjon_i_henhold_til_artikkel_58_i_forordningen') >= 0 ||
      (replySed as F002Sed).formaal.indexOf('refusjon_ihht_artikkel_58_i_forordning') >= 0
    ) {
      hasErrors.push(performValidation<ValidationKravOmRefusjonProps>(v, 'formål2-refusjon_i_henhold_til_artikkel_58_i_forordningen', validateKravOmRefusjon, {
        kravOmRefusjon: (replySed as F002Sed)?.refusjonskrav,
        formalName: i18n.t('label:krav-om-refusjon').toLowerCase()
      }, true))

      hasErrors.push(performValidation<ValidationRefusjonProps>(v, 'formål2-refusjon', validateRefusjon, {
        replySed,
        formalName: i18n.t('label:krav-om-refusjon').toLowerCase()
      }, true))
    }
    if (!_.isNil((replySed as F002Sed).utbetalingTilInstitusjon)) {
      hasErrors.push(performValidation<ValidationKontoopplysningProps>(v, 'formål2-kontoopplysninger', validateKontoopplysning, {
        uti: _.get(replySed, 'utbetalingTilInstitusjon'),
        formalName: i18n.t('label:kontoopplysninger').toLowerCase()
      }, true))
    }
  }

  return hasErrors.find(value => value) !== undefined
}

export const validateMainForm = (v: Validation, _replySed: ReplySed, personID: string): boolean => {
  const hasErrors: Array<boolean> = []
  const replySed = _.cloneDeep(_replySed)
  const CDM_VERSJON = replySed?.sak?.cdmVersjon ? parseFloat(replySed?.sak?.cdmVersjon) : "4.4"
  const personInfo: PersonInfo =
    isXSed(replySed)
      ? _.get(replySed, 'bruker')
      : _.get(replySed, `${personID}.personInfo`)
  const personName: string = personID === 'familie'
    ? i18n.t('label:familien').toLowerCase()
    : personInfo.fornavn + ' ' + (personInfo.etternavn ?? '')

  if (isFSed(replySed)) {
    if (personID !== 'familie') {
      hasErrors.push(performValidation<ValidationPersonopplysningerProps>(v, `svarsed-${personID}-personopplysninger`, validatePersonopplysninger, {
        personInfo, personName
      }, true))

      const statsborgerskaper: Array<Statsborgerskap> = _.get(replySed, `${personID}.personInfo.statsborgerskap`)
      hasErrors.push(performValidation<ValidationNasjonaliteterProps>(v, `svarsed-${personID}-nasjonaliteter`, validateNasjonaliteter, {
        statsborgerskaper, personName
      }, true))

      const adresser: Array<Adresse> = _.get(replySed, `${personID}.adresser`)
      hasErrors.push(performValidation<ValidationAdresserProps>(v, `svarsed-${personID}-adresser`, validateAdresser, {
        adresser, checkAdresseType: false, personName
      }, true))
    }

    if (!personID.startsWith('barn')) {
      if (personID === 'familie') {
        const ytelser: Array<Ytelse> = _.get(replySed, `${personID}.ytelser`)
        hasErrors.push(performValidation<ValidationBeløpNavnOgValutasProps>(v, `svarsed-${personID}-familieytelser`, validateBeløpNavnOgValutas, {
          ytelser, personID, personName
        }, true))
      } else {
        const telefoner: Array<Telefon> = _.get(replySed, `${personID}.telefon`)
        hasErrors.push(performValidation<ValidateTelefonerProps>(v, `svarsed-${personID}-kontaktinformasjon-telefon`, validateKontaktsinformasjonTelefoner, {
          telefoner, personName
        }, true))
        const eposter: Array<Epost> = _.get(replySed, `${personID}.epost`)
        hasErrors.push(performValidation<ValidateEposterProps>(v, `svarsed-${personID}-kontaktinformasjon-epost`, validateKontaktsinformasjonEposter, {
          eposter, personName
        }, true))

        if(isF001Sed(replySed) || isF002Sed(replySed)){
          const person: PersonTypeF001 = _.get(replySed, `${personID}`)
          if(CDM_VERSJON && CDM_VERSJON >= 4.4){
            hasErrors.push(performValidation<ValidateAktivitetOgTrygdeperioderProps>(v, `svarsed-${personID}-aktivitetstatusogtrygdeperioder`, validateAktivitetStatusOgTrygdeperioder, {
              person, personName
            }, true))
          } else {
            hasErrors.push(performValidation<ValidateAktivitetOgTrygdeperioderProps>(v, `svarsed-${personID}-aktivitetogtrygdeperioder`, validateAktivitetOgTrygdeperioder, {
              person, personName
            }, true))
          }
        }

        if(isF026Sed(replySed) || isF027Sed(replySed)){

          if(CDM_VERSJON && CDM_VERSJON >= 4.4){
            hasErrors.push(validateTrygdeordning(v, `svarsed-${personID}-trygdeordning`, 'dekkedePerioder', _.get(replySed, `${personID}.dekkedePerioder`), personName))
            hasErrors.push(validateTrygdeordning(v, `svarsed-${personID}-trygdeordning`, 'udekkedePerioder', _.get(replySed, `${personID}.udekkedePerioder`), personName))

            const perioderMedRettTilYtelser: Array<RettIkkeRettTilFamilieYtelse> | undefined = _.get(replySed, `${personID}.perioderMedRettTilYtelser`)
            hasErrors.push(performValidation<ValidationPerioderMedRettTilYtelserProps>(v, `svarsed-${personID}-trygdeordning`, validatePerioderMedRettTilYtelser, {
              perioderMedRettTilYtelser
            }, true))

          } else {
            hasErrors.push(performValidation<ValidateTrygdeordningerProps>(v, `svarsed-${personID}-trygdeordning`, validateTrygdeordninger, {
              replySed, personID, personName
            }, true))
          }
        }

        const familierelasjoner: Array<FamilieRelasjon> = _.get(replySed, `${personID}.familierelasjoner`)
        hasErrors.push(performValidation<ValidationFamilierelasjonerProps>(v, `svarsed-${personID}-familierelasjon`, validateFamilierelasjoner, {
          familierelasjoner, personName
        }, true))

        // Specific to F003
        if(isF003Sed(replySed)){
          // Ektefelle
          hasErrors.push(performValidation<ValidationYtterligereInfoProps>(v, `svarsed-${personID}-ytterligereInfo`, validateYtterligereInfo, {
            replySed, personName
          }, true))

          if(CDM_VERSJON && CDM_VERSJON >= 4.4){
            const perioderMedRettTilYtelser: Array<RettIkkeRettTilFamilieYtelse> | undefined = _.get(replySed, `${personID}.perioderMedRettTilYtelser`)
            hasErrors.push(performValidation<ValidationPerioderMedRettTilYtelserProps>(v, `svarsed-${personID}-periodermedretttilytelser`, validatePerioderMedRettTilYtelser, {
              perioderMedRettTilYtelser
            }, true))
          } else {
            // Trygdeordning
            const perioderMedYtelser: Array<Periode> | undefined = _.get(replySed, `${personID}.perioderMedYtelser`)
            const ikkeRettTilYtelser: any | undefined = _.get(replySed, `${personID}.ikkeRettTilYtelser`)
            let rettTilFamilieYtelser;
            if(perioderMedYtelser && perioderMedYtelser.length >= 0){
              rettTilFamilieYtelser = "ja"
            } else if(ikkeRettTilYtelser){
              rettTilFamilieYtelser = "nei"
            }
            hasErrors.push(performValidation<ValidationTrygdeOrdningerProps>(v, `svarsed-${personID}-retttilytelserfsed`, validateTrygdeOrdninger, {
              perioderMedYtelser, ikkeRettTilYtelser, rettTilFamilieYtelser, personName
            }, true))
          }

          //Familierelasjon Annen Person
          const familierelasjon: FamilieRelasjon = _.get(replySed, `${personID}.familierelasjon`)
          hasErrors.push(performValidation<ValidationFamilierelasjonProps>(v, `svarsed-${personID}-familierelasjonf003`, validateFamilierelasjon, {
            familierelasjon, personName
          }, true))
        }
      }
    } else {
      const barnetilhoerigheter : Array<Barnetilhoerighet> = _.get(replySed, `${personID}.barnetilhoerigheter`)
      hasErrors.push(performValidation<ValidationBarnetilhoerigheterProps>(v, `svarsed-${personID}-relasjon`, validateBarnetilhoerigheter, {
        barnetilhoerigheter, personName
      }, true))
      const flyttegrunn: Flyttegrunn = _.get(replySed, `${personID}.flyttegrunn`)
      hasErrors.push(performValidation<ValidateGrunnlagForBosettingProps>(v, `svarsed-${personID}-grunnlagforbosetting`, validateGrunnlagForBosetting, {
        flyttegrunn, personName
      }, true))
      const ytelser: Array<Ytelse> = _.get(replySed, `${personID}.ytelser`)
      if ((replySed as FSed).formaal && (replySed as FSed).formaal.indexOf('vedtak') >= 0) {
        hasErrors.push(performValidation<ValidationBeløpNavnOgValutasProps>(v, `svarsed-${personID}-beløpnavnogvaluta`, validateBeløpNavnOgValutas, {
          ytelser, personID, personName
        }, true))
      }
    }
  }

  if (isUSed(replySed)) {
    hasErrors.push(performValidation<ValidationPersonopplysningerProps>(v, `svarsed-${personID}-personopplysninger`, validatePersonopplysninger, {
      personInfo, personName
    }, true))
    hasErrors.push(performValidation<ValidationReferanseperiodeProps>(v, `svarsed-${personID}-referanseperiode`, validateReferanseperiode, {
      anmodningsperiode: (replySed as USed)?.anmodningsperiode, personName
    }, true))
    if (replySed.sedType === 'U002' || replySed.sedType === 'U017') {
      hasErrors.push(performValidation<ValidateForsikringProps>(v, `svarsed-${personID}-forsikring`, validateForsikring, {
        replySed: (replySed as USed), personName
      }, true))
      hasErrors.push(performValidation<ValidatePerioderDagpengerProps>(v, `svarsed-${personID}-periodefordagpenger`, validatePerioderDagpenger, {
        perioderDagpenger: (replySed as U002Sed)?.dagpengeperioder,
        personName
      }, true))
      const nrArbeidsperioder = getNrOfArbeidsPerioder(replySed as USed)
      const allArbeidsPerioderHaveSluttdato = getAllArbeidsPerioderHaveSluttDato(replySed as USed)

      hasErrors.push(performValidation<ValidateGrunnTilOpphørProps>(v, `svarsed-${personID}-grunntilopphør`, validateGrunnTilOpphor, {
        sisteAnsettelseInfo: (replySed as U002Sed)?.sisteAnsettelseInfo,
        doValidate: (nrArbeidsperioder > 0 && allArbeidsPerioderHaveSluttdato)
      }, true))

      hasErrors.push(performValidation<ValidateSisteAnsettelseInfoProps>(v, `svarsed-${personID}-sisteAnsettelseInfo`, validateSisteAnsettelseInfo, {
        sisteAnsettelseInfo: (replySed as U002Sed)?.sisteAnsettelseInfo
      }, true))
    }

    if (replySed.sedType === 'U004') {
      hasErrors.push(performValidation<ValidationLoennsopplysningerProps>(v, `svarsed-${personID}-inntekt`, validateLoennsopplysninger, {
        loennsopplysninger: (replySed as U004Sed)?.loennsopplysninger
      }, true))
    }

    if (replySed.sedType === 'U017') {
      hasErrors.push(performValidation<ValidationRettTilYtelseProps>(v, `svarsed-${personID}-retttilytelser`, validateRettTilYtelse, {
        rettTilYtelse: (replySed as U017Sed)?.rettTilYtelse
      }, true))
    }
  }

  if (isHSed(replySed)) {
    hasErrors.push(performValidation<ValidationPersonopplysningerProps>(v, `svarsed-${personID}-personopplysninger`, validatePersonopplysninger, {
      personInfo, personName
    }, true))
    hasErrors.push(performValidation<ValidationAdresserProps>(v, `svarsed-${personID}-adresser`, validateAdresser, {
      adresser: _.get(replySed, `${personID}.adresser`), checkAdresseType: true, personName
    }, true))
    if (isH002Sed(replySed)) {
      hasErrors.push(performValidation<ValidationSvarPåForespørselProps>(v, `svarsed-${personID}-svarpåforespørsel`, validateSvarPåForespørsel, {
        replySed,
        personName: i18n.t('label:svar-på-forespørsel').toLowerCase()
      }, true))
    }
    if (isH001Sed(replySed)) {
      hasErrors.push(performValidation<ValidationAnmodningProps>(v, `svarsed-${personID}-anmodning`, validateAnmodning, {
        replySed,
        personName: i18n.t('label:anmodning-om-informasjon').toLowerCase()
      }, true))
      hasErrors.push(performValidation<ValidationEndredeForholdProps>(v, `svarsed-${personID}-endredeforhold`, validateEndredeForhold, {
        replySed,
        personName: i18n.t('label:ytterligere-informasjon_endrede_forhold').toLowerCase()
      }, true))
    }
  }

  if (isXSed(replySed)) {
    hasErrors.push(performValidation<ValidationPersonLightProps>(v, `svarsed-${personID}-personlight`, validatePersonLight, {
      personLight: (replySed as X001Sed).bruker, personName
    }, true))

    if (isX001Sed(replySed)) {
      hasErrors.push(performValidation<ValidationAvslutningProps>(v, `svarsed-${personID}-avslutning`, validateAvslutning, {
        replySed: (replySed as X001Sed), personName
      }, true))
    }
    if (isX008Sed(replySed)) {
      hasErrors.push(performValidation<ValidationUgyldiggjøreProps>(v, `svarsed-${personID}-ugyldiggjøre`, validateUgyldiggjøre, {
        replySed: (replySed as X008Sed), personName
      }, true))
    }
    if (isX009Sed(replySed)) {
      hasErrors.push(performValidation<ValidationPurringerProps>(v, `svarsed-${personID}-påminnelse`, validatePurringer, {
        purringer: _.get(replySed as X009Sed, 'purringer'), personName
      }, true))
    }
    if (isX010Sed(replySed)) {
      hasErrors.push(performValidation<ValidationSvarPåminnelseProps>(v, `svarsed-${personID}-svarpåminnelse`, validateSvarPåminnelse, {
        besvarelseKommer: _.get(replySed as X010Sed, 'besvarelseKommer'),
        besvarelseUmulig: _.get(replySed as X010Sed, 'besvarelseUmulig'),
        personName
      }, true))
    }
    if (isX011Sed(replySed)) {
      hasErrors.push(performValidation<ValidationAvvisProps>(v, `svarsed-${personID}-avvis`, validateAvvis, {
        replySed: (replySed as X011Sed), personName
      }, true))
    }
    if (isX012Sed(replySed)) {
      hasErrors.push(performValidation<ValidationKlargjørProps>(v, `svarsed-${personID}-klargjør`, validateKlargjør, {
        replySed: (replySed as X012Sed), personName
      }, true))
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

  if (isF001Sed(replySed) || isF002Sed(replySed)) {
    hasErrors.push(performValidation<ValidationFormålProps>(v, 'formål1-formål', validateFormål, {
      formaal: (replySed as FSed).formaal
    }, true))
    hasErrors.push(performValidation<ValidationAnmodningsPerioderProps>(v, 'formål1-anmodningsperiode', validateAnmodningsPerioder, {
      anmodningsperioder: (replySed as FSed).anmodningsperioder
    }, true))

    if ((replySed as F002Sed).krav) {
      hasErrors.push(performValidation<ValidationKravProps>(v, 'formål1-anmodningsperiode', validateKrav, {
        krav: (replySed as F002Sed).krav
      }, true))
    }

    if ((replySed as F002Sed).ektefelle) {
      hasErrors.push(validateMainForm(v, replySed, 'ektefelle'))
    }
    if ((replySed as F002Sed).annenPerson) {
      hasErrors.push(validateMainForm(v, replySed, 'annenPerson'))
    }

    (replySed as F002Sed).andrePersoner?.forEach((p: PersonTypeF001, i: number) => {
      hasErrors.push(validateMainForm(v, replySed, `andrePersoner[${i}]`))
    });

    (replySed as F002Sed).barn?.forEach((b: Barn, i: number) => {
      hasErrors.push(validateMainForm(v, replySed, `barn[${i}]`))
    });


    if ((replySed as F002Sed).familie) {
      hasErrors.push(validateMainForm(v, replySed, 'familie'))
    }
    hasErrors.push(validateBottomForm(v, replySed))
  }

  if(isF003Sed(replySed)){
    if ((replySed as F003Sed).krav) {
      hasErrors.push(performValidation<ValidationKravProps>(v, 'mottakavsoknad-krav', validateKrav, {
        krav: (replySed as F003Sed).krav
      }, true))
    }
    if ((replySed as F003Sed).ektefelle) {
      hasErrors.push(validateMainForm(v, replySed, 'ektefelle'))
    }
    if ((replySed as F003Sed).annenPerson) {
      hasErrors.push(validateMainForm(v, replySed, 'annenPerson'))
    }

    (replySed as F003Sed).andrePersoner?.forEach((p: PersonTypeAnnenPersonF003, i: number) => {
      hasErrors.push(validateMainForm(v, replySed, `andrePersoner[${i}]`))
    });

    (replySed as F003Sed).barn?.forEach((b: PersonBarn, i: number) => {
      hasErrors.push(validateMainForm(v, replySed, `barn[${i}]`))
    });

    hasErrors.push(validateVedtakForF003(v, replySed))
  }

  if(isF026Sed(replySed)){
    if((replySed as F026Sed).anmodningOmMerInformasjon){
      hasErrors.push(performValidation<ValidationEtterspurtInformasjonProps>(v, 'etterspurtinformasjon-etterspurtinformasjon', validateEtterspurtInformasjon, {
        anmodningOmMerInformasjon: (replySed as F026Sed).anmodningOmMerInformasjon!
      }, true))
    }
  }

  if(isF027Sed(replySed)){
    if((replySed as F027Sed).anmodningOmMerInformasjon?.svar?.adopsjon){
      hasErrors.push(performValidation<ValidationAdopsjonProps>(v, 'svarpaaanmodningominformasjon-adopsjon', validateAdopsjon, {
        svarAdopsjon: (replySed as F027Sed).anmodningOmMerInformasjon?.svar?.adopsjon,
        label: i18n.t('label:svar-på-anmodning-om-adopsjon')
      }, true))
    }

    if((replySed as F027Sed).anmodningOmMerInformasjon?.svar?.inntekt){
      hasErrors.push(performValidation<ValidationInntektProps>(v, 'svarpaaanmodningominformasjon-inntekt', validateInntekt, {
        svarInntekt: (replySed as F027Sed).anmodningOmMerInformasjon?.svar?.inntekt,
        label: i18n.t('label:svar-på-anmodning-om-inntekt')
      }, true))
    }

    if((replySed as F027Sed).anmodningOmMerInformasjon?.svar?.ytelseTilForeldreloese){
      hasErrors.push(performValidation<ValidationYtelseTilForeldreloeseProps>(v, 'svarpaaanmodningominformasjon-ytelsetilforeldreloese', validateYtelseTilForeldreloese, {
        svarYtelseTilForeldreloese: (replySed as F027Sed).anmodningOmMerInformasjon?.svar?.ytelseTilForeldreloese,
        label: i18n.t('label:svar-på-anmodning-om-barnepensjon'),
        CDM_VERSJON: (replySed as F027Sed).sak?.cdmVersjon
      }, true))
    }

    if((replySed as F027Sed).anmodningOmMerInformasjon?.svar?.annenInformasjonBarnet){
      hasErrors.push(performValidation<ValidationAnnenInformasjonBarnetProps>(v, 'svarpaaanmodningominformasjon-anneninformasjonbarnet', validateAnnenInformasjonBarnet, {
        annenInformasjonBarnet: (replySed as F027Sed).anmodningOmMerInformasjon?.svar?.annenInformasjonBarnet,
        label: i18n.t('label:svar-på-anmodning-om-annen-informasjon-om-barnet')
      }, true))
    }

    if((replySed as F027Sed).anmodningOmMerInformasjon?.svar?.utdanning || (replySed as F027Sed).anmodningOmMerInformasjon?.svar?.deltakelsePaaUtdanning){
      hasErrors.push(performValidation<ValidationUtdanningProps>(v, 'svarpaaanmodningominformasjon-utdanning', validateUtdanning, {
        utdanning: (replySed as F027Sed).anmodningOmMerInformasjon?.svar?.utdanning,
        deltakelsePaaUtdanning: (replySed as F027Sed).anmodningOmMerInformasjon?.svar?.deltakelsePaaUtdanning,
        label: i18n.t('label:svar-om-fremmøte-skole-høyskole-opplæring-arbeidsledighet')
      }, true))
    }


  }

  if(isS040Sed(replySed)){
    hasErrors.push(performValidation<ValidationForespoerselProps>(v, 'forespoersel-sykdom', validateForespoersel, {
      sykdom: (replySed as S040Sed).sykdom
    }, true))
  }

  if(isS046Sed(replySed)){
    hasErrors.push(performValidation<ValidationInformasjonOmUtbetalingProps>(v, 'informasjonOmUtbetaling-sykdom', validateInformasjonOmUtbetaling, {
      informasjonOmUtbetaling: (replySed as S046Sed).sykdom?.informasjonOmUtbetaling
    }, true))
  }


  if (!isH001Sed(replySed)) {
    hasErrors.push(checkLength(v, {
      needle: (replySed as H001Sed)?.ytterligereInfo,
      max: 500,
      id: 'editor-ytterligereInfo',
      message: 'validation:textOverX'
    }))
  }

  console.log(hasErrors)
  return hasErrors.find(value => value) !== undefined
}
