import { validateAdresser } from 'applications/SvarSed/PersonManager/Adresser/validation'
import { validateAlleForsikringPerioder } from 'applications/SvarSed/PersonManager/Forsikring/validation'
import { validateGrunnTilOpphor } from 'applications/SvarSed/PersonManager/GrunnTilOpphør/validation'
import { validateNasjonaliteter } from 'applications/SvarSed/PersonManager/Nasjonaliteter/validation'
import { validatePersonOpplysninger } from 'applications/SvarSed/PersonManager/PersonOpplysninger/validation'
import { validateRettTilYtelse } from 'applications/SvarSed/PersonManager/RettTilYtelser/validation'
import { ReplyPdu1 } from 'declarations/pd'
import { Adresse, ForsikringPeriode, PersonInfo, Statsborgerskap } from 'declarations/sed'
import { Validation } from 'declarations/types.d'
import _ from 'lodash'
import { FeiloppsummeringFeil } from 'nav-frontend-skjema'
import { TFunction } from 'react-i18next'

export interface ValidationPdu1SearchProps {
  fagsak: string | undefined
  namespace: string
  fnrOrDnr: string
}

export interface ValidationPDU1EditProps {
  replyPdu1: ReplyPdu1
}

export const validatePersonManager = (v: Validation, t: TFunction, replyPdu1: ReplyPdu1, personID: string): boolean => {
  let hasErrors: boolean = false
  let _error: boolean
  const personInfo: PersonInfo = _.get(replyPdu1, `${personID}.personInfo`)
  const personName: string = personInfo.fornavn + ' ' + (personInfo.etternavn ?? '')

  _error = validatePersonOpplysninger(v, t, {
    personInfo, namespace: `personmanager-${personID}-personopplysninger`, personName
  })
  hasErrors = hasErrors || _error

  const statsborgerskaper: Array<Statsborgerskap> = _.get(replyPdu1, `${personID}.personInfo.statsborgerskap`)
  _error = validateNasjonaliteter(v, t, {
    statsborgerskaper, namespace: `personmanager-${personID}-nasjonaliteter`, personName
  })
  hasErrors = hasErrors || _error

  const adresser: Array<Adresse> = _.get(replyPdu1, `${personID}.adresser`)
  _error = validateAdresser(v, t, {
    adresser, namespace: `personmanager-${personID}-adresser`, personName
  })
  hasErrors = hasErrors || _error

  const perioder: {[k in string]: Array<ForsikringPeriode>| undefined} = {
    perioderAnsattMedForsikring: replyPdu1.perioderAnsattMedForsikring,
    perioderSelvstendigMedForsikring: replyPdu1.perioderSelvstendigMedForsikring,
    perioderAnsattUtenForsikring: replyPdu1.perioderAnsattUtenForsikring,
    perioderSelvstendigUtenForsikring: replyPdu1.perioderSelvstendigUtenForsikring,
    // perioderSyk: replyPdu1.perioderSyk,
    // perioderSvangerskapBarn: replyPdu1.perioderSvangerskapBarn,
    // perioderUtdanning: replyPdu1.perioderUtdanning,
    // perioderMilitaertjeneste: replyPdu1.perioderMilitaertjeneste,
    // perioderFrihetsberoevet: replyPdu1.perioderFrihetsberoevet,
    // perioderFrivilligForsikring: replyPdu1.perioderFrivilligForsikring,
    // perioderKompensertFerie: replyPdu1.perioderKompensertFerie,
    perioderAnnenForsikring: replyPdu1.perioderAnnenForsikring
  }
  _error = validateAlleForsikringPerioder(v, t, {
    perioder, namespace: `personmanager-${personID}-forsikring`, personName
  })
  hasErrors = hasErrors || _error

  _error = validateGrunnTilOpphor(v, t, {
    grunntilopphor: replyPdu1.grunntilopphor,
    namespace: `personmanager-${personID}-grunntilopphør`
  })
  hasErrors = hasErrors || _error

  _error = validateRettTilYtelse(v, t, {
    rettTilTytelse: replyPdu1.rettTilYtelse,
    namespace: `personmanager-${personID}-retttilytelser`
  })
  hasErrors = hasErrors || _error

  return hasErrors
}

export const validatePdu1Search = (
  v: Validation,
  t: TFunction,
  {
    fagsak,
    namespace,
    fnrOrDnr
  }: ValidationPdu1SearchProps
): boolean => {
  let hasErrors: boolean = false
  if (_.isEmpty(fagsak)) {
    v[namespace + '-fagsak'] = {
      skjemaelementId: namespace + '-fagsak',
      feilmelding: t('validation:noFagsak')
    } as FeiloppsummeringFeil
    hasErrors = true
  }

  if (_.isEmpty(fnrOrDnr)) {
    v[namespace + '-fnrOrDnr'] = {
      skjemaelementId: namespace + '-fnrOrDnr',
      feilmelding: t('validation:noFnr')
    } as FeiloppsummeringFeil
    hasErrors = true
  }

  return hasErrors
}
export const validatePDU1Edit = (
  v: Validation,
  t: TFunction,
  {
    replyPdu1
  }: ValidationPDU1EditProps
): boolean => {
  let hasErrors: boolean = false

  // this is common to all seds
  const _error: boolean = validatePersonManager(v, t, replyPdu1, 'bruker')
  hasErrors = hasErrors || _error

  // @ts-ignore
  if (!_.isEmpty(replyPdu1?.ytterligereInfo?.trim()) && replyPdu1?.ytterligereInfo?.trim().length > 500) {
    v['editor-ytterligereInfo'] = {
      feilmelding: t('validation:textOver500Til', { person: 'SED' }),
      skjemaelementId: 'editor-ytterligereInfo'
    } as FeiloppsummeringFeil
    hasErrors = true
  }

  return hasErrors
}
