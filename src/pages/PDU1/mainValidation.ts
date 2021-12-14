
import { validateCoverLetter } from 'applications/PDU1/CoverLetter/validation'
import { validateDagpenger } from 'applications/PDU1/Dagpenger/validation'
import { validateAllePDPerioder } from 'applications/PDU1/Perioder/validation'
import { validateStatsborgerskaper } from 'applications/PDU1/Statsborgerskap/validation'
import { NavInfo, Pdu1Person, ReplyPdu1 } from 'declarations/pd'
import { Adresse, GrunnTilOpphør, Periode } from 'declarations/sed'
import { Validation } from 'declarations/types.d'
import _ from 'lodash'
import { ErrorElement } from 'declarations/app.d'
import { TFunction } from 'react-i18next'
import { validatePerson } from 'applications/PDU1/Person/validation'
import { validateAdresse } from 'applications/PDU1/Adresse/validation'
import { validateSisteAnsettelseinfo } from 'applications/PDU1/SisteAnsettelseInfo/validation'
import { validateNavInfo } from 'applications/PDU1/NavInfo/validation'

export interface ValidationPdu1SearchProps {
  fagsak: string | undefined
  namespace: string
  fnrOrDnr: string
}

export interface ValidationPDU1EditProps {
  replyPdu1: ReplyPdu1
}

export const validatePDU1Edit = (v: Validation, t: TFunction, {
  replyPdu1
}: ValidationPDU1EditProps): boolean => {
  const hasErrors: Array<boolean> = []

  const personID = 'bruker'
  const person : Pdu1Person = _.get(replyPdu1, personID)
  hasErrors.push(validatePerson(v, t, { person, namespace: `personmanager-${personID}-person` }))

  const statsborgerskaper: Array<string> = _.get(replyPdu1, `${personID}.statsborgerskap`)
  hasErrors.push(validateStatsborgerskaper(v, t, { statsborgerskaper, namespace: `personmanager-${personID}-statsborgerskap` }))

  const adresse: Adresse = _.get(replyPdu1, `${personID}.adresse`)
  hasErrors.push(validateAdresse(v, t, { adresse, namespace: `personmanager-${personID}-adresse` }))

  hasErrors.push(validateAllePDPerioder(v, t, { replyPdu1, namespace: `personmanager-${personID}-perioder` }))

  const sisteAnsettelseInfo: GrunnTilOpphør = _.get(replyPdu1, 'opphoer')
  hasErrors.push(validateSisteAnsettelseinfo(v, t, { sisteAnsettelseInfo, namespace: `personmanager-${personID}-sisteAnsettelseInfo` }))

  const dagpenger: Array<Periode> | undefined = _.get(replyPdu1, 'perioderDagpengerMottatt')
  hasErrors.push(validateDagpenger(v, t, { dagpenger, namespace: `personmanager-${personID}-dagpenger` }))

  const nav: NavInfo = _.get(replyPdu1, 'nav')
  hasErrors.push(validateNavInfo(v, t, { nav, namespace: `personmanager-${personID}-navinfo` }))

  const info: string = _.get(replyPdu1, 'info')
  hasErrors.push(validateCoverLetter(v, t, { info, namespace: `personmanager-${personID}-coverletter` }))

  return hasErrors.find(value => value) !== undefined
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
    } as ErrorElement
    hasErrors = true
  }

  if (_.isEmpty(fnrOrDnr)) {
    v[namespace + '-fnrOrDnr'] = {
      skjemaelementId: namespace + '-fnrOrDnr',
      feilmelding: t('validation:noFnr')
    } as ErrorElement
    hasErrors = true
  }

  return hasErrors
}
