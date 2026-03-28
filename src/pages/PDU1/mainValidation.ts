import { validateDagpengerPerioder, ValidationDagpengerPerioderProps } from 'applications/PDU1/Dagpenger/validation'
import { validateAllePDPerioder, ValidateAllePDPerioderProps } from 'applications/PDU1/Perioder/validation'
import { validateRettTilDagpenger, ValidationRettTilDagpengerProps } from 'applications/PDU1/RettTilDagpenger/validation'
import { validateCoverLetter, ValidationCoverLetterProps } from 'applications/PDU1/CoverLetter/validation'
import {Pdu1Person, PDU1, Etterbetalinger, PDPeriode, Avsender, Oppsigelsesgrunn, RettTilDagpenger, IkkeRettTilDagpenger} from 'declarations/pd'
import { Validation } from 'declarations/types.d'
import _ from 'lodash'
import { validatePerson, ValidationPersonProps } from 'applications/PDU1/Person/validation'
import { validateOppsigelsesGrunn, ValidationOppsigelsesGrunnProps } from 'applications/PDU1/OppsigelsesGrunn/validation'
import { validateAvsender, ValidationAvsenderProps } from 'applications/PDU1/Avsender/validation'
import { validateEtterbetalinger, ValidationUtbetalingProps } from 'applications/PDU1/Etterbetalinger/validation'
import performValidation from 'utils/performValidation'
import { checkIfNotEmpty } from 'utils/validation'

export interface ValidationPdu1SearchProps {
  fagsakId: string | undefined
  saksreferanse: string | null | undefined
  fnrOrDnr: string | null | undefined
}

export interface ValidationPDU1EditProps {
  pdu1: PDU1
}

export const validatePDU1Edit = (v: Validation, namespace: string, {
  pdu1
}: ValidationPDU1EditProps): boolean => {
  const hasErrors: Array<boolean> = []

  const person : Pdu1Person = _.get(pdu1, 'bruker')
  hasErrors.push(performValidation<ValidationPersonProps>(v,
    `${namespace}-person`, validatePerson, { person }, true))

  hasErrors.push(performValidation<ValidateAllePDPerioderProps>(v,
    `${namespace}-perioder`, validateAllePDPerioder, { pdu1 }, true))

  const oppsigelsesGrunn: Oppsigelsesgrunn | undefined = _.get(pdu1, 'oppsigelsesgrunn')
  hasErrors.push(performValidation<ValidationOppsigelsesGrunnProps>(v,
    `${namespace}-oppsigelsesgrunn`, validateOppsigelsesGrunn, { oppsigelsesGrunn }, true))

  const etterbetalinger: Etterbetalinger | undefined = _.get(pdu1, 'etterbetalinger')
  hasErrors.push(performValidation<ValidationUtbetalingProps>(v,
    `${namespace}-etterbetalinger`, validateEtterbetalinger, { etterbetalinger: etterbetalinger }, true))

  const dagpenger: Array<PDPeriode> | undefined = _.get(pdu1, 'perioderDagpengerMottatt')
  hasErrors.push(performValidation<ValidationDagpengerPerioderProps>(v,
    `${namespace}-dagpenger`, validateDagpengerPerioder, { dagpenger }, true))

  const rettTilDagpenger: RettTilDagpenger | undefined = _.get(pdu1, 'rettTilDagpenger')
  const ikkeRettTilDagpenger: IkkeRettTilDagpenger | undefined = _.get(pdu1, 'ikkeRettTilDagpenger')
  hasErrors.push(performValidation<ValidationRettTilDagpengerProps>(v,
    `${namespace}-retttildagpenger`, validateRettTilDagpenger, { rettTilDagpenger, ikkeRettTilDagpenger }, true))

  const avsender: Avsender = _.get(pdu1, 'avsender')
  hasErrors.push(performValidation<ValidationAvsenderProps>(v,
    `${namespace}-avsender`, validateAvsender, { avsender, keyForCity: 'poststed', keyforZipCode: 'postnr' }, true))

  const info: string | undefined = _.get(pdu1, 'info')
  hasErrors.push(performValidation<ValidationCoverLetterProps>(v,
    `${namespace}-coverletter`, validateCoverLetter, { info }, true))

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
