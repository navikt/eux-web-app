import { validateKontoopplysning } from 'applications/SvarSed/Formaal/Kontoopplysning/validation'
import { validateKravOmRefusjon } from 'applications/SvarSed/Formaal/KravOmRefusjon/validation'
import { validateMotregninger } from 'applications/SvarSed/Formaal/Motregning/validation'
import { validateProsedyreVedUenighet } from 'applications/SvarSed/Formaal/ProsedyreVedUenighet/validation'
import { validateVedtak } from 'applications/SvarSed/Formaal/Vedtak/validation'
import { validateAdresser } from 'applications/SvarSed/PersonManager/Adresser/validation'
import { validateBeløpNavnOgValutas } from 'applications/SvarSed/PersonManager/BeløpNavnOgValuta/validation'
import { validateFamilierelasjoner } from 'applications/SvarSed/PersonManager/Familierelasjon/validation'
import { validateAlleForsikringPerioder } from 'applications/SvarSed/PersonManager/Forsikring/validation'
import { validateAllGrunnlagForBosetting } from 'applications/SvarSed/PersonManager/GrunnlagForBosetting/validation'
import { validateGrunnTilOpphor } from 'applications/SvarSed/PersonManager/GrunnTilOpphør/validation'
import { validateLoennsopplysninger } from 'applications/SvarSed/PersonManager/InntektForm/validationInntektForm'
import {
  validateKontaktsinformasjonEposter,
  validateKontaktsinformasjonTelefoner
} from 'applications/SvarSed/PersonManager/Kontaktinformasjon/validation'
import { validateNasjonaliteter } from 'applications/SvarSed/PersonManager/Nasjonaliteter/validation'
import { validatePerioderDagpenger } from 'applications/SvarSed/PersonManager/PeriodeForDagpenger/validationPeriodeDagpenger'
import { validateAnsattPerioder } from 'applications/SvarSed/PersonManager/PersonensStatus/ansattValidation'
import { validateAvsenderlandetPerioder } from 'applications/SvarSed/PersonManager/PersonensStatus/avsenderlandetValidation'
import { validateNotAnsattPerioder } from 'applications/SvarSed/PersonManager/PersonensStatus/notAnsattValidation'
import { validateWithSubsidiesPerioder } from 'applications/SvarSed/PersonManager/PersonensStatus/withSubsidiesValidation'
import { validatePersonOpplysninger } from 'applications/SvarSed/PersonManager/PersonOpplysninger/validation'
import { validateReferanseperiode } from 'applications/SvarSed/PersonManager/Referanseperiode/validation'
import { validateBarnetilhoerigheter } from 'applications/SvarSed/PersonManager/Relasjon/validation'
import { validateRettTilYtelse } from 'applications/SvarSed/PersonManager/RettTilYtelser/validation'
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
  ForsikringPeriode,
  FSed,
  HSed,
  PensjonPeriode,
  Periode,
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

  if (!_.isEmpty((replySed as F002Sed).formaal)) {
    if ((replySed as F002Sed).formaal.indexOf('motregning') >= 0) {
      _error = validateMotregninger(v, t, {
        replySed,
        namespace: 'formålmanager-motregning',
        formalName: t('label:motregning').toLowerCase()
      })
      hasErrors = hasErrors || _error
    }
    if ((replySed as F002Sed).formaal.indexOf('vedtak') >= 0) {
      _error = validateVedtak(v, t, {
        vedtak: _.get(replySed, 'vedtak'),
        namespace: 'formålmanager-vedtak',
        formalName: t('label:vedtak').toLowerCase()
      })
      hasErrors = hasErrors || _error
    }
    if ((replySed as F002Sed).formaal.indexOf('prosedyre_ved_uenighet') >= 0) {
      _error = validateProsedyreVedUenighet(v, t, {
        prosedyreVedUenighet: _.get(replySed, 'uenighet'),
        namespace: 'formålmanager-prosedyre_ved_uenighet',
        formalName: t('label:prosedyre-ved-uenighet').toLowerCase()
      })
      hasErrors = hasErrors || _error
    }
    if ((replySed as F002Sed).formaal.indexOf('refusjon_i_henhold_til_artikkel_58_i_forordningen') >= 0) {
      _error = validateKravOmRefusjon(v, t, {
        kravOmRefusjon: (replySed as F002Sed)?.refusjonskrav,
        namespace: 'formålmanager-refusjonskrav',
        formalName: t('label:krav-om-refusjon').toLowerCase()
      })
      hasErrors = hasErrors || _error
    }
    if (!_.isNil((replySed as F002Sed).utbetalingTilInstitusjon)) {
      _error = validateKontoopplysning(v, t, {
        uti: _.get(replySed, 'utbetalingTilInstitusjon'),
        namespace: 'formålmanager-kontoopplysninger',
        formalName: t('label:kontoopplysninger').toLowerCase()
      })
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
    : personInfo.fornavn + ' ' + (personInfo.etternavn ?? '')

  if (isFSed(replySed)) {
    if (personID !== 'familie') {
      _error = validatePersonOpplysninger(v, t, {
        personInfo, namespace: `personmanager-${personID}-personopplysninger`, personName
      })
      hasErrors = hasErrors || _error

      const statsborgerskaper: Array<Statsborgerskap> = _.get(replySed, `${personID}.personInfo.statsborgerskap`)
      _error = validateNasjonaliteter(v, t, {
        statsborgerskaper, namespace: `personmanager-${personID}-nasjonaliteter`, personName
      })
      hasErrors = hasErrors || _error

      const adresser: Array<Adresse> = _.get(replySed, `${personID}.adresser`)
      _error = validateAdresser(v, t, {
        adresser, namespace: `personmanager-${personID}-adresser`, personName
      })
      hasErrors = hasErrors || _error
    }

    if (!personID.startsWith('barn')) {
      if (personID === 'familie') {
        const ytelser: Array<Ytelse> = _.get(replySed, `${personID}.ytelser`)
        _error = validateBeløpNavnOgValutas(v, t, {
          ytelser: ytelser, namespace: `personmanager-${personID}-familieytelser`, personID, personName
        })
        hasErrors = hasErrors || _error
      } else {
        const telefoner: Array<Telefon> = _.get(replySed, `${personID}.telefon`)
        _error = validateKontaktsinformasjonTelefoner(v, t, {
          telefoner, namespace: `personmanager-${personID}-kontaktinformasjon-telefon`, personName
        })
        hasErrors = hasErrors || _error
        const eposter: Array<Epost> = _.get(replySed, `${personID}.epost`)
        _error = validateKontaktsinformasjonEposter(v, t, {
          eposter, namespace: `personmanager-${personID}-kontaktinformasjon-epost`, personName
        })
        hasErrors = hasErrors || _error
        const perioder: {[k in string]: Array<Periode | PensjonPeriode>} = {
          perioderMedArbeid: _.get(replySed, `${personID}.perioderMedArbeid`),
          perioderMedTrygd: _.get(replySed, `${personID}.perioderMedTrygd`),
          perioderMedITrygdeordning: _.get(replySed, `${personID}.perioderMedITrygdeordning`),
          perioderUtenforTrygdeordning: _.get(replySed, `${personID}.perioderUtenforTrygdeordning`),
          perioderMedYtelser: _.get(replySed, `${personID}.perioderMedYtelser`),
          perioderMedPensjon: _.get(replySed, `${personID}.perioderMedPensjon`)
        }
        _error = validateTrygdeordninger(v, t, {
          perioder, namespace: `personmanager-${personID}-trygdeordninger`, personName
        })
        hasErrors = hasErrors || _error
        const familierelasjoner: Array<FamilieRelasjon> = _.get(replySed, `${personID}.familierelasjoner`)
        _error = validateFamilierelasjoner(v, t, {
          familierelasjoner, namespace: `personmanager-${personID}-familierelasjon`, personName
        })
        hasErrors = hasErrors || _error

        const perioderSomAnsatt: Array<Periode> = _.get(replySed, `${personID}.perioderSomAnsatt`)
        _error = validateAnsattPerioder(v, t, {
          perioder: perioderSomAnsatt, namespace: `personmanager-${personID}-personensstatus-ansatt`, personName
        })
        hasErrors = hasErrors || _error

        const perioderSomSelvstendig: Array<Periode> = _.get(replySed, `${personID}.perioderSomSelvstendig`)
        _error = validateNotAnsattPerioder(v, t, {
          perioder: perioderSomSelvstendig, namespace: `personmanager-${personID}-personensstatus-notansatt-perioderSomSelvstendig`, personName
        })
        hasErrors = hasErrors || _error

        const perioderSomSykMedLoenn: Array<Periode> = _.get(replySed, `${personID}.perioderSomSykMedLoenn`)
        _error = validateNotAnsattPerioder(v, t, {
          perioder: perioderSomSykMedLoenn, namespace: `personmanager-${personID}-personensstatus-notansatt-perioderSomSykMedLoenn`, personName
        })
        hasErrors = hasErrors || _error
        const perioderSomPermittertMedLoenn: Array<Periode> = _.get(replySed, `${personID}.perioderSomPermittertMedLoenn`)
        _error = validateNotAnsattPerioder(v, t, {
          perioder: perioderSomPermittertMedLoenn, namespace: `personmanager-${personID}-personensstatus-notansatt-perioderSomPermittertMedLoenn`, personName
        })
        hasErrors = hasErrors || _error

        const perioderSomPermittertUtenLoenn: Array<Periode> = _.get(replySed, `${personID}.perioderSomPermittertUtenLoenn`)
        _error = validateNotAnsattPerioder(v, t, {
          perioder: perioderSomPermittertUtenLoenn, namespace: `personmanager-${personID}-personensstatus-notansatt-perioderSomPermittertUtenLoenn`, personName
        })
        hasErrors = hasErrors || _error

        const perioderMedTrygd: Array<Periode> = _.get(replySed, `${personID}.perioderMedTrygd`)
        _error = validateAvsenderlandetPerioder(v, t, {
          perioder: perioderMedTrygd, namespace: `personmanager-${personID}-personensstatus-avsenderlandet`, personName
        })
        hasErrors = hasErrors || _error

        const flyttegrunn: Flyttegrunn = _.get(replySed, `${personID}.flyttegrunn`)
        _error = validateAllGrunnlagForBosetting(v, t, {
          flyttegrunn, namespace: `personmanager-${personID}-personensstatus-grunnlagforbosetting`, personName
        })
        hasErrors = hasErrors || _error

        const perioderMedPensjon: Array<PensjonPeriode> = _.get(replySed, `${personID}.perioderMedPensjon`)
        _error = validateWithSubsidiesPerioder(v, t, {
          perioder: perioderMedPensjon, namespace: `personmanager-${personID}-personensstatus-withsubsidies`, personName
        })
        hasErrors = hasErrors || _error
      }
    } else {
      const barnetilhorigheter : Array<Barnetilhoerighet> = _.get(replySed, `${personID}.barnetilhoerigheter`)
      _error = validateBarnetilhoerigheter(v, t, {
        barnetilhorigheter, namespace: `personmanager-${personID}-relasjon`, personName
      })
      hasErrors = hasErrors || _error
      const flyttegrunn: Flyttegrunn = _.get(replySed, `${personID}.flyttegrunn`)
      _error = validateAllGrunnlagForBosetting(v, t, {
        flyttegrunn, namespace: `personmanager-${personID}-grunnlagforbosetting`, personName
      })
      hasErrors = hasErrors || _error
      const ytelser: Array<Ytelse> = _.get(replySed, `${personID}.ytelser`)
      if ((replySed as FSed).formaal.indexOf('vedtak') >= 0) {
        _error = validateBeløpNavnOgValutas(v, t, {
          ytelser, namespace: `personmanager-${personID}-beløpnavnogvaluta`, personID, personName
        })
        hasErrors = hasErrors || _error
      }
    }
  }

  if (isUSed(replySed)) {
    _error = validatePersonOpplysninger(v, t, {
      personInfo, namespace: `personmanager-${personID}-personopplysninger`, personName
    })
    hasErrors = hasErrors || _error

    _error = validateReferanseperiode(v, t, {
      anmodningsperiode: (replySed as USed)?.anmodningsperiode, namespace: `personmanager-${personID}-referanseperiode`, personName
    })
    hasErrors = hasErrors || _error

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
      _error = validateAlleForsikringPerioder(v, t, {
        perioder, namespace: `personmanager-${personID}-trygdeordninger`, personName
      })
      hasErrors = hasErrors || _error

      _error = validatePerioderDagpenger(v, t, {
        perioderDagpenger: (replySed as U002Sed)?.perioderDagpenger,
        namespace: `personmanager-${personID}-periodefordagpenger`
      })
      hasErrors = hasErrors || _error

      _error = validateGrunnTilOpphor(v, t, {
        grunntilopphor: (replySed as U002Sed)?.grunntilopphor,
        namespace: `personmanager-${personID}-grunntilopphør`
      })
      hasErrors = hasErrors || _error

      _error = validateSisteansettelsesforhold(v, t, {
        sisteansettelsesforhold: (replySed as U002Sed)?.sisteAnsettelsesForhold,
        namespace: `personmanager-${personID}-sisteAnsettelsesForhold`
      })
      hasErrors = hasErrors || _error
    }

    if (replySed.sedType === 'U004') {
      _error = validateLoennsopplysninger(v, t, {
        loennsopplysninger: (replySed as U004Sed)?.loennsopplysninger,
        namespace: `personmanager-${personID}-inntekt`

      })
      hasErrors = hasErrors || _error
    }

    if (replySed.sedType === 'U017') {
      _error = validateRettTilYtelse(v, t, {
        rettTilTytelse: (replySed as U017Sed)?.rettTilYtelse,
        namespace: `personmanager-${personID}-retttilytelser`
      })
      hasErrors = hasErrors || _error
    }
  }

  if (isHSed(replySed)) {
    _error = validatePersonOpplysninger(v, t, {
      personInfo, namespace: `personmanager-${personID}-personopplysninger`, personName
    })
    hasErrors = hasErrors || _error

    _error = validateAdresser(v, t, {
      adresser: _.get(replySed, `${personID}.adresser`), namespace: `personmanager-${personID}-adresser`, personName
    })
    hasErrors = hasErrors || _error

    _error = validateSvarPåForespørsel(v, t, {
      replySed, namespace: `personmanager-${personID}-svarpåforespørsel`, personName: t('label:svar-på-forespørsel').toLowerCase()
    })
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
      feilmelding: t('validation:noSaksnummerOrFnr'),
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
        feilmelding: t('validation:noFormaal'),
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
    (replySed as F002Sed).barn?.forEach((b: Person, i: number) => {
      _error = validatePersonManager(v, t, replySed, `barn[${i}]`)
      hasErrors = hasErrors || _error
    })
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
        feilmelding: t('validation:noTema'),
        skjemaelementId: 'editor-tema'
      } as FeiloppsummeringFeil
      hasErrors = true
    } else {
      if ((replySed as HSed).tema === 'GEN') {
        v['editor-tema'] = {
          feilmelding: t('validation:invalidTema'),
          skjemaelementId: 'editor-tema'
        } as FeiloppsummeringFeil
        hasErrors = true
      }
    }
  }

  // @ts-ignore
  if (!_.isEmpty(replySed?.ytterligereInfo?.trim()) && replySed?.ytterligereInfo?.trim().length > 500) {
    v['editor-ytterligereInfo'] = {
      feilmelding: t('validation:textOver500Til', { person: 'SED' }),
      skjemaelementId: 'editor-ytterligereInfo'
    } as FeiloppsummeringFeil
    hasErrors = true
  }

  return hasErrors
}
