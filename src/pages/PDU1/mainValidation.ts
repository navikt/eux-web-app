import { validateDagpenger } from 'applications/PDU1/Dagpenger/validation'
import { validateAllePDPerioder } from 'applications/PDU1/Perioder/validation'
import { NavInfo, Pdu1Person, PDU1, AndreMottatteUtbetalinger } from 'declarations/pd'
import { GrunnTilOpphør, Periode } from 'declarations/sed'
import { Validation } from 'declarations/types.d'
import _ from 'lodash'
import { ErrorElement } from 'declarations/app.d'
import { TFunction } from 'react-i18next'
import { validatePerson } from 'applications/PDU1/Person/validation'
import { validateSisteAnsettelseinfo } from 'applications/PDU1/SisteAnsettelseInfo/validation'
import { validateAvsender } from 'applications/PDU1/Avsender/validation'
import { validateUtbetaling } from 'applications/PDU1/Utbetaling/validation'

export interface ValidationPdu1SearchProps {
  fagsak: string | undefined
  namespace: string
  fnrOrDnr: string
}

export interface ValidationPDU1EditProps {
  pdu1: PDU1
}

export const validatePDU1Edit = (v: Validation, t: TFunction, {
  pdu1
}: ValidationPDU1EditProps): boolean => {
  const hasErrors: Array<boolean> = []

  const personID = 'bruker'
  const person : Pdu1Person = _.get(pdu1, personID)
  hasErrors.push(validatePerson(v, t, { person, namespace: `personmanager-${personID}-person` }))

  hasErrors.push(validateAllePDPerioder(v, t, { pdu1, namespace: `personmanager-${personID}-perioder` }))

  const sisteAnsettelseInfo: GrunnTilOpphør | undefined = _.get(pdu1, 'opphoer')
  hasErrors.push(validateSisteAnsettelseinfo(v, t, { sisteAnsettelseInfo, namespace: `personmanager-${personID}-sisteansettelseinfo` }))

  const utbetaling: AndreMottatteUtbetalinger | undefined = _.get(pdu1, 'andreMottatteUtbetalinger')
  hasErrors.push(validateUtbetaling(v, t, { utbetaling, namespace: `personmanager-${personID}-utbetaling` }))

  const dagpenger: Array<Periode> | undefined = _.get(pdu1, 'perioderDagpengerMottatt')
  hasErrors.push(validateDagpenger(v, t, { dagpenger, namespace: `personmanager-${personID}-dagpenger` }))

  const nav: NavInfo = _.get(pdu1, 'nav')
  hasErrors.push(validateAvsender(v, t, { nav, keyForCity: 'poststed', keyforZipCode: 'postnr', namespace: `personmanager-${personID}-avsender` }))

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
