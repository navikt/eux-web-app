
import { validateStatsborgerskaper } from 'applications/PDU1/Statsborgerskap/validation'
import { Pdu1Person, ReplyPdu1 } from 'declarations/pd'
import { Adresse } from 'declarations/sed'
import { Validation } from 'declarations/types.d'
import _ from 'lodash'
import { ErrorElement } from 'declarations/app.d'
import { TFunction } from 'react-i18next'
import { validatePerson } from 'applications/PDU1/Person/validation'
import { validateAdresse } from 'applications/SvarSed/PersonManager/Adresser/validation'

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
  let hasErrors: boolean = false

  const person : Pdu1Person = _.get(replyPdu1, 'bruker')
  hasErrors ||= validatePerson(v, t, { person, namespace: 'personmanager-bruker-person' })

  const statsborgerskaper: Array<string> = _.get(replyPdu1, 'bruker.statsborgerskap')
  hasErrors ||= validateStatsborgerskaper(v, t, {
    statsborgerskaper, namespace: 'personmanager-bruker-statsborgerskap'
  })

  const adresse: Adresse = _.get(replyPdu1, 'bruker.adresse')
  hasErrors ||= validateAdresse(v, t, { adresse, namespace: 'personmanager-adresse' })
  /*
  const perioder: {[k in string]: Array<ForsikringPeriode>| undefined} = {
    perioderAnsattMedForsikring: replyPdu1.perioderAnsattMedForsikring,
    perioderSelvstendigMedForsikring: replyPdu1.perioderSelvstendigMedForsikring,
    perioderAnsattUtenForsikring: replyPdu1.perioderAnsattUtenForsikring,
    perioderSelvstendigUtenForsikring: replyPdu1.perioderSelvstendigUtenForsikring,
    perioderAnsettSomForsikret: replyPdu1.perioderAnsettSomForsikret,
    perioderAnnenForsikring: replyPdu1.perioderAndreForsikringer,
    perioderLoennSomAnsatt: replyPdu1.perioderLoennSomAnsatt,
    perioderInntektSomSelvstendig: replyPdu1.perioderInntektSomSelvstendig
  }
  _error = validateAlleForsikringPerioder(v, t, {
    perioder, namespace: `personmanager-${personID}-forsikring`, personName
  })
  hasErrors = hasErrors || _error

  hasErrors = hasErrors || _error
*/
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
