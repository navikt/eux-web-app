import { validateAnmodningsPerioder } from 'applications/SvarSed/AnmodningsPeriode/validation'
import { validateFormål } from 'applications/SvarSed/Formål/validation'
import { validateKontoopplysning } from 'applications/SvarSed/Kontoopplysning/validation'
import { validateKravOmRefusjon } from 'applications/SvarSed/KravOmRefusjon/validation'
import { validateMotregninger } from 'applications/SvarSed/Motregning/validation'
import { validateProsedyreVedUenighet } from 'applications/SvarSed/ProsedyreVedUenighet/validation'
import { validateVedtak } from 'applications/SvarSed/Vedtak/validation'
import { validateAdresser } from 'applications/SvarSed/Adresser/validation'
import { validateBeløpNavnOgValutas } from 'applications/SvarSed/BeløpNavnOgValuta/validation'
import { validateAnmodning } from 'applications/SvarSed/Anmodning/validation'
import { validateEndredeForhold } from 'applications/SvarSed/EndredeForhold/validation'
import { validateFamilierelasjoner } from 'applications/SvarSed/Familierelasjon/validation'
import { validateAlleForsikringPerioder } from 'applications/SvarSed/Forsikring/validation'
import { validateAllGrunnlagForBosetting } from 'applications/SvarSed/GrunnlagForBosetting/validation'
import { validateGrunnTilOpphor } from 'applications/SvarSed/GrunnTilOpphør/validation'
import { validateLoennsopplysninger } from 'applications/SvarSed/InntektForm/validationInntektForm'
import {
  validateKontaktsinformasjonEposter,
  validateKontaktsinformasjonTelefoner
} from 'applications/SvarSed/Kontaktinformasjon/validation'
import { validateNasjonaliteter } from 'applications/SvarSed/Nasjonaliteter/validation'
import { validatePerioderDagpenger } from 'applications/SvarSed/PeriodeForDagpenger/validation'
import { validateAnsattPerioder } from 'applications/SvarSed/PersonensStatus/ansattValidation'
import { validateAvsenderlandetPerioder } from 'applications/SvarSed/PersonensStatus/avsenderlandetValidation'
import { validateNotAnsattPerioder } from 'applications/SvarSed/PersonensStatus/notAnsattValidation'
import { validateWithSubsidiesPerioder } from 'applications/SvarSed/PersonensStatus/withSubsidiesValidation'
import { validatePersonopplysninger } from 'applications/SvarSed/PersonOpplysninger/validation'
import { validateReferanseperiode } from 'applications/SvarSed/Referanseperiode/validation'
import { validateBarnetilhoerigheter } from 'applications/SvarSed/Relasjon/validation'
import { validateRettTilYtelse } from 'applications/SvarSed/RettTilYtelser/validation'
import { validateSisteAnsettelseInfo } from 'applications/SvarSed/SisteAnsettelseInfo/validation'
import { validateSvarPåForespørsel } from 'applications/SvarSed/SvarPåForespørsel/validation'
import { validateTrygdeordninger } from 'applications/SvarSed/Trygdeordning/validation'
import { ErrorElement } from 'declarations/app.d'
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
import { isFSed, isH001Sed, isH002Sed, isHSed, isUSed } from 'utils/sed'

export interface ValidationSEDEditProps {
  replySed: ReplySed
}

export const validateBottomForm = (v: Validation, replySed: ReplySed): boolean => {
  let hasErrors: boolean = false
  let _error: boolean

  if (!_.isEmpty((replySed as F002Sed).formaal)) {
    if ((replySed as F002Sed).formaal.indexOf('motregning') >= 0) {
      _error = validateMotregninger(v, {
        replySed,
        namespace: 'MainForm-motregning',
        formalName: t('label:motregning').toLowerCase()
      })
      hasErrors = hasErrors || _error
    }
    if ((replySed as F002Sed).formaal.indexOf('vedtak') >= 0) {
      _error = validateVedtak(v, {
        vedtak: _.get(replySed, 'vedtak'),
        namespace: 'MainForm-vedtak',
        formalName: t('label:vedtak').toLowerCase()
      })
      hasErrors = hasErrors || _error
    }
    if ((replySed as F002Sed).formaal.indexOf('prosedyre_ved_uenighet') >= 0) {
      _error = validateProsedyreVedUenighet(v, {
        prosedyreVedUenighet: _.get(replySed, 'uenighet'),
        namespace: 'MainForm-prosedyre_ved_uenighet',
        formalName: t('label:prosedyre-ved-uenighet').toLowerCase()
      })
      hasErrors = hasErrors || _error
    }
    if ((replySed as F002Sed).formaal.indexOf('refusjon_i_henhold_til_artikkel_58_i_forordningen') >= 0) {
      _error = validateKravOmRefusjon(v, {
        kravOmRefusjon: (replySed as F002Sed)?.refusjonskrav,
        namespace: 'MainForm-refusjonskrav',
        formalName: t('label:krav-om-refusjon').toLowerCase()
      })
      hasErrors = hasErrors || _error
    }
    if (!_.isNil((replySed as F002Sed).utbetalingTilInstitusjon)) {
      _error = validateKontoopplysning(v, {
        uti: _.get(replySed, 'utbetalingTilInstitusjon'),
        namespace: 'MainForm-kontoopplysninger',
        formalName: t('label:kontoopplysninger').toLowerCase()
      })
      hasErrors = hasErrors || _error
    }
  }
  return hasErrors
}

export const validateMainForm = (v: Validation, replySed: ReplySed, personID: string): boolean => {
  let hasErrors: boolean = false
  let _error: boolean
  const personInfo: PersonInfo = _.get(replySed, `${personID}.personInfo`)
  const personName: string = personID === 'familie'
    ? t('label:familien').toLowerCase()
    : personInfo.fornavn + ' ' + (personInfo.etternavn ?? '')

  if (isFSed(replySed)) {
    if (personID !== 'familie') {
      _error = validatePersonopplysninger(v, `svarsed-${personID}-personopplysninger`, {
        personInfo, personName
      })
      hasErrors = hasErrors || _error

      const statsborgerskaper: Array<Statsborgerskap> = _.get(replySed, `${personID}.personInfo.statsborgerskap`)
      _error = validateNasjonaliteter(v, {
        statsborgerskaper, namespace: `svarsed-${personID}-nasjonaliteter`, personName
      })
      hasErrors = hasErrors || _error

      const adresser: Array<Adresse> = _.get(replySed, `${personID}.adresser`)
      _error = validateAdresser(v, {
        adresser, checkAdresseType: true, namespace: `svarsed-${personID}-adresser`, personName
      })
      hasErrors = hasErrors || _error
    }

    if (!personID.startsWith('barn')) {
      if (personID === 'familie') {
        const ytelser: Array<Ytelse> = _.get(replySed, `${personID}.ytelser`)
        _error = validateBeløpNavnOgValutas(v, {
          ytelser, namespace: `svarsed-${personID}-familieytelser`, personID, personName
        })
        hasErrors = hasErrors || _error
      } else {
        const telefoner: Array<Telefon> = _.get(replySed, `${personID}.telefon`)
        _error = validateKontaktsinformasjonTelefoner(v, {
          telefoner, namespace: `svarsed-${personID}-kontaktinformasjon-telefon`, personName
        })
        hasErrors = hasErrors || _error
        const eposter: Array<Epost> = _.get(replySed, `${personID}.epost`)
        _error = validateKontaktsinformasjonEposter(v, {
          eposter, namespace: `svarsed-${personID}-kontaktinformasjon-epost`, personName
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
        _error = validateTrygdeordninger(v, {
          perioder, namespace: `svarsed-${personID}-trygdeordninger`, personName
        })
        hasErrors = hasErrors || _error
        const familierelasjoner: Array<FamilieRelasjon> = _.get(replySed, `${personID}.familierelasjoner`)
        _error = validateFamilierelasjoner(v, {
          familierelasjoner, namespace: `svarsed-${personID}-familierelasjon`, personName
        })
        hasErrors = hasErrors || _error

        const perioderSomAnsatt: Array<Periode> = _.get(replySed, `${personID}.perioderSomAnsatt`)
        _error = validateAnsattPerioder(v, {
          perioder: perioderSomAnsatt, namespace: `svarsed-${personID}-personensstatus-ansatt`, personName
        })
        hasErrors = hasErrors || _error

        const perioderSomSelvstendig: Array<Periode> = _.get(replySed, `${personID}.perioderSomSelvstendig`)
        _error = validateNotAnsattPerioder(v, {
          perioder: perioderSomSelvstendig, namespace: `svarsed-${personID}-personensstatus-notansatt-perioderSomSelvstendig`, personName
        })
        hasErrors = hasErrors || _error

        const perioderSomSykMedLoenn: Array<Periode> = _.get(replySed, `${personID}.perioderSomSykMedLoenn`)
        _error = validateNotAnsattPerioder(v, {
          perioder: perioderSomSykMedLoenn, namespace: `svarsed-${personID}-personensstatus-notansatt-perioderSomSykMedLoenn`, personName
        })
        hasErrors = hasErrors || _error
        const perioderSomPermittertMedLoenn: Array<Periode> = _.get(replySed, `${personID}.perioderSomPermittertMedLoenn`)
        _error = validateNotAnsattPerioder(v, {
          perioder: perioderSomPermittertMedLoenn, namespace: `svarsed-${personID}-personensstatus-notansatt-perioderSomPermittertMedLoenn`, personName
        })
        hasErrors = hasErrors || _error

        const perioderSomPermittertUtenLoenn: Array<Periode> = _.get(replySed, `${personID}.perioderSomPermittertUtenLoenn`)
        _error = validateNotAnsattPerioder(v, {
          perioder: perioderSomPermittertUtenLoenn, namespace: `svarsed-${personID}-personensstatus-notansatt-perioderSomPermittertUtenLoenn`, personName
        })
        hasErrors = hasErrors || _error

        const perioderMedTrygd: Array<Periode> = _.get(replySed, `${personID}.perioderMedTrygd`)
        _error = validateAvsenderlandetPerioder(v, {
          perioder: perioderMedTrygd, namespace: `svarsed-${personID}-personensstatus-avsenderlandet`, personName
        })
        hasErrors = hasErrors || _error

        const flyttegrunn: Flyttegrunn = _.get(replySed, `${personID}.flyttegrunn`)
        _error = validateAllGrunnlagForBosetting(v, {
          flyttegrunn, namespace: `svarsed-${personID}-personensstatus-grunnlagforbosetting`, personName
        })
        hasErrors = hasErrors || _error

        const perioderMedPensjon: Array<PensjonPeriode> = _.get(replySed, `${personID}.perioderMedPensjon`)
        _error = validateWithSubsidiesPerioder(v, {
          perioder: perioderMedPensjon, namespace: `svarsed-${personID}-personensstatus-withsubsidies`, personName
        })
        hasErrors = hasErrors || _error
      }
    } else {
      const barnetilhorigheter : Array<Barnetilhoerighet> = _.get(replySed, `${personID}.barnetilhoerigheter`)
      _error = validateBarnetilhoerigheter(v, {
        barnetilhorigheter, namespace: `svarsed-${personID}-relasjon`, personName
      })
      hasErrors = hasErrors || _error
      const flyttegrunn: Flyttegrunn = _.get(replySed, `${personID}.flyttegrunn`)
      _error = validateAllGrunnlagForBosetting(v, {
        flyttegrunn, namespace: `svarsed-${personID}-grunnlagforbosetting`, personName
      })
      hasErrors = hasErrors || _error
      const ytelser: Array<Ytelse> = _.get(replySed, `${personID}.ytelser`)
      if ((replySed as FSed).formaal.indexOf('vedtak') >= 0) {
        _error = validateBeløpNavnOgValutas(v, {
          ytelser, namespace: `svarsed-${personID}-beløpnavnogvaluta`, personID, personName
        })
        hasErrors = hasErrors || _error
      }
    }
  }

  if (isUSed(replySed)) {
    _error = validatePersonopplysninger(v, `svarsed-${personID}-personopplysninger`, {
      personInfo, personName
    })
    hasErrors = hasErrors || _error

    _error = validateReferanseperiode(v, {
      anmodningsperiode: (replySed as USed)?.anmodningsperiode, namespace: `svarsed-${personID}-referanseperiode`, personName
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

      _error = validateAlleForsikringPerioder(v, {
        perioder, namespace: `svarsed-${personID}-forsikring`, personName
      })
      hasErrors = hasErrors || _error

      _error = validatePerioderDagpenger(v, {
        perioderDagpenger: (replySed as U002Sed)?.perioderDagpenger,
        namespace: `svarsed-${personID}-periodefordagpenger`,
        personName
      })
      hasErrors = hasErrors || _error

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
        _error = validateGrunnTilOpphor(v, {
          grunntilopphor: (replySed as U002Sed)?.grunntilopphor,
          namespace: `svarsed-${personID}-grunntilopphør`
        })
        hasErrors = hasErrors || _error
      }
      _error = validateSisteAnsettelseInfo(v, {
        sisteansettelseinfo: (replySed as U002Sed)?.sisteAnsettelseInfo,
        namespace: `svarsed-${personID}-sisteAnsettelseInfo`
      })
      hasErrors = hasErrors || _error
    }

    if (replySed.sedType === 'U004') {
      _error = validateLoennsopplysninger(v, {
        loennsopplysninger: (replySed as U004Sed)?.loennsopplysninger,
        namespace: `svarsed-${personID}-inntekt`

      })
      hasErrors = hasErrors || _error
    }

    if (replySed.sedType === 'U017') {
      _error = validateRettTilYtelse(v, {
        rettTilTytelse: (replySed as U017Sed)?.rettTilYtelse,
        namespace: `svarsed-${personID}-retttilytelser`
      })
      hasErrors = hasErrors || _error
    }
  }

  if (isHSed(replySed)) {
    _error = validatePersonopplysninger(v, `svarsed-${personID}-personopplysninger`, {
      personInfo,  personName
    })
    hasErrors = hasErrors || _error

    _error = validateAdresser(v, {
      adresser: _.get(replySed, `${personID}.adresser`), checkAdresseType: true, namespace: `svarsed-${personID}-adresser`, personName
    })
    hasErrors = hasErrors || _error

    if (isH002Sed(replySed)) {
      _error = validateSvarPåForespørsel(v, {
        replySed,
        namespace: `svarsed-${personID}-svarpåforespørsel`,
        personName: t('label:svar-på-forespørsel').toLowerCase()
      })
      hasErrors = hasErrors || _error
    }

    if (isH001Sed(replySed)) {
      _error = validateAnmodning(v, {
        replySed,
        namespace: `svarsed-${personID}-anmodning`,
        personName: t('label:anmodning-om-informasjon').toLowerCase()
      })
      hasErrors = hasErrors || _error

      _error = validateEndredeForhold(v, {
        replySed,
        namespace: `svarsed-${personID}-endredeforhold`,
        personName: t('label:ytterligere-informasjon_endrede_forhold').toLowerCase()
      })
      hasErrors = hasErrors || _error
    }
  }

  return hasErrors
}

export const validateSEDEdit = (
  v: Validation,
  namespace: string,
  {
    replySed
  }: ValidationSEDEditProps
): boolean => {
  let hasErrors: boolean = false
  let _error: boolean

  // this is common to all seds
  _error = validateMainForm(v, replySed, 'bruker')
  hasErrors = hasErrors || _error

  if (isFSed(replySed)) {
    _error = validateFormål(v, 'formål1-formål', {
      formaal: (replySed as FSed).formaal
    })
    hasErrors = hasErrors || _error

    _error = validateAnmodningsPerioder(v, 'formål1-anmodningsperiode', {
      anmodningsperioder: (replySed as FSed).anmodningsperioder
    })
    hasErrors = hasErrors || _error

    if ((replySed as F002Sed).ektefelle) {
      _error = validateMainForm(v, replySed, 'ektefelle')
      hasErrors = hasErrors || _error
    }
    if ((replySed as F002Sed).annenPerson) {
      _error = validateMainForm(v, replySed, 'annenPerson')
      hasErrors = hasErrors || _error
    }
    (replySed as F002Sed).barn?.forEach((b: Person, i: number) => {
      _error = validateMainForm(v, replySed, `barn[${i}]`)
      hasErrors = hasErrors || _error
    })
    if ((replySed as F002Sed).familie) {
      _error = validateMainForm(v, replySed, 'familie')
      hasErrors = hasErrors || _error
    }

    _error = validateBottomForm(v, replySed)
    hasErrors = hasErrors || _error
  }

  if (isHSed(replySed)) {
    if (_.isEmpty((replySed as HSed).tema)) {
      v['editor-tema'] = {
        feilmelding: t('validation:noTema'),
        skjemaelementId: 'editor-tema'
      } as ErrorElement
      hasErrors = true
    } else {
      if ((replySed as HSed).tema === 'GEN') {
        v['editor-tema'] = {
          feilmelding: t('validation:invalidTema'),
          skjemaelementId: 'editor-tema'
        } as ErrorElement
        hasErrors = true
      }
    }
  }
  if (!isH001Sed(replySed)) {
    // @ts-ignore
    if (!_.isEmpty(replySed?.ytterligereInfo?.trim()) && replySed?.ytterligereInfo?.trim().length > 500) {
      v['editor-ytterligereInfo'] = {
        feilmelding: t('validation:textOverX', { x: 500 }) + t('validation:til-person', { person: 'SED' }),
        skjemaelementId: 'editor-ytterligereInfo'
      } as ErrorElement
      hasErrors = true
    }
  }

  return hasErrors
}
