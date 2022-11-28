import { validateDagpengerPerioder, ValidationDagpengerPerioderProps } from 'applications/PDU1/Dagpenger/validation'
import { validateAllePDPerioder, ValidateAllePDPerioderProps } from 'applications/PDU1/Perioder/validation'
import { NavInfo, Pdu1Person, PDU1, AndreMottatteUtbetalinger, PDPeriode } from 'declarations/pd'
import { SisteAnsettelseInfo } from 'declarations/sed'
import { Validation } from 'declarations/types.d'
import _ from 'lodash'
import { validatePerson, ValidationPersonProps } from 'applications/PDU1/Person/validation'
import { validateSisteAnsettelseinfo, ValidationSisteAnsettelseinfoProps } from 'applications/PDU1/SisteAnsettelseInfo/validation'
import { validateAvsender, ValidationAvsenderProps } from 'applications/PDU1/Avsender/validation'
import { validateUtbetaling, ValidationUtbetalingProps } from 'applications/PDU1/Utbetaling/validation'
import performValidation from 'utils/performValidation'
import { checkIfNotEmpty } from 'utils/validation'

export interface ValidationPdu1SearchProps {
  fagsakId: string | undefined
  saksreferanse: string | undefined
  fnrOrDnr: string | null | undefined
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
  hasErrors.push(performValidation<ValidationPersonProps>(v,
    `${namespace}-${personID}-person`, validatePerson, { person }, true))

  hasErrors.push(performValidation<ValidateAllePDPerioderProps>(v,
    `${namespace}-${personID}-perioder`, validateAllePDPerioder, { pdu1 }, true))

  const sisteAnsettelseInfo: SisteAnsettelseInfo | undefined = _.get(pdu1, 'opphoer')
  hasErrors.push(performValidation<ValidationSisteAnsettelseinfoProps>(v,
    `${namespace}-${personID}-sisteansettelseinfo`, validateSisteAnsettelseinfo, { sisteAnsettelseInfo }, true))

  const utbetaling: AndreMottatteUtbetalinger | undefined = _.get(pdu1, 'andreMottatteUtbetalinger')
  hasErrors.push(performValidation<ValidationUtbetalingProps>(v,
    `${namespace}-${personID}-utbetaling`, validateUtbetaling, { utbetaling }, true))

  const dagpenger: Array<PDPeriode> | undefined = _.get(pdu1, 'perioderDagpengerMottatt')
  hasErrors.push(performValidation<ValidationDagpengerPerioderProps>(v,
    `${namespace}-${personID}-dagpenger`, validateDagpengerPerioder, { dagpenger }, true))

  const nav: NavInfo = _.get(pdu1, 'nav')
  hasErrors.push(performValidation<ValidationAvsenderProps>(v,
    `${namespace}-${personID}-avsender`, validateAvsender, { nav, keyForCity: 'poststed', keyforZipCode: 'postnr' }, true))

  return hasErrors.find(value => value) !== undefined
}

export const validatePdu1Search = (
  v: Validation,
  namespace: string,
  {
    fagsakId,
    saksreferanse,
    fnrOrDnr
  }: ValidationPdu1SearchProps
): boolean => {
  const hasErrors: Array<boolean> = []

  hasErrors.push(checkIfNotEmpty(v, {
    needle: fagsakId,
    id: namespace + '-pdu1results',
    message: 'validation:noFagsak'
  }))

  hasErrors.push(checkIfNotEmpty(v, {
    needle: fnrOrDnr,
    id: namespace + '-fnrOrDnr',
    message: 'validation:noFnr'
  }))

  hasErrors.push(checkIfNotEmpty(v, {
    needle: saksreferanse,
    id: namespace + '-saksreferanse',
    message: 'validation:noSaksreferanse'
  }))

  return hasErrors.find(value => value) !== undefined
}
