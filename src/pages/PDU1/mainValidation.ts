import { validateDagpengerPerioder } from 'applications/PDU1/Dagpenger/validation'
import { validateAllePDPerioder } from 'applications/PDU1/Perioder/validation'
import { NavInfo, Pdu1Person, PDU1, AndreMottatteUtbetalinger, PDPeriode } from 'declarations/pd'
import { SisteAnsettelseInfo } from 'declarations/sed'
import { Validation } from 'declarations/types.d'
import _ from 'lodash'
import { validatePerson } from 'applications/PDU1/Person/validation'
import { validateSisteAnsettelseinfo } from 'applications/PDU1/SisteAnsettelseInfo/validation'
import { validateAvsender } from 'applications/PDU1/Avsender/validation'
import { validateUtbetaling } from 'applications/PDU1/Utbetaling/validation'
import { checkIfNotEmpty } from 'utils/validation'

export interface ValidationPdu1SearchProps {
  fagsak: string | undefined
  fnrOrDnr: string | undefined
}

export interface ValidationPDU1EditProps {
  pdu1: PDU1
}

export const validatePDU1Edit = (v: Validation, namespace: string, {
  pdu1
}: ValidationPDU1EditProps): boolean => {
  const hasErrors: Array<boolean> = []

  const personID = 'bruker'
  const person : Pdu1Person = _.get(pdu1, personID)
  hasErrors.push(validatePerson(v, `${namespace}-${personID}-person`, { person }))

  hasErrors.push(validateAllePDPerioder(v, `${namespace}-${personID}-perioder`, { pdu1 }))

  const sisteAnsettelseInfo: SisteAnsettelseInfo | undefined = _.get(pdu1, 'opphoer')
  hasErrors.push(validateSisteAnsettelseinfo(v, `${namespace}-${personID}-sisteansettelseinfo`, { sisteAnsettelseInfo }))

  const utbetaling: AndreMottatteUtbetalinger | undefined = _.get(pdu1, 'andreMottatteUtbetalinger')
  hasErrors.push(validateUtbetaling(v, `${namespace}-${personID}-utbetaling`, { utbetaling }))

  const dagpenger: Array<PDPeriode> | undefined = _.get(pdu1, 'perioderDagpengerMottatt')
  hasErrors.push(validateDagpengerPerioder(v, `${namespace}-${personID}-dagpenger`, { dagpenger }))

  const nav: NavInfo = _.get(pdu1, 'nav')
  hasErrors.push(validateAvsender(v, `${namespace}-${personID}-avsender`, { nav, keyForCity: 'poststed', keyforZipCode: 'postnr' }))

  return hasErrors.find(value => value) !== undefined
}

export const validatePdu1Search = (
  v: Validation,
  namespace: string,
  {
    fagsak,
    fnrOrDnr
  }: ValidationPdu1SearchProps
): boolean => {
  const hasErrors: Array<boolean> = []

  hasErrors.push(checkIfNotEmpty(v, {
    needle: fagsak,
    id: namespace + '-fagsak',
    message: 'validation:noFagsak'
  }))

  hasErrors.push(checkIfNotEmpty(v, {
    needle: fnrOrDnr,
    id: namespace + '-fnrOrDnr',
    message: 'validation:noFnr'
  }))

  return hasErrors.find(value => value) !== undefined
}
