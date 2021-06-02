import { validatePeriod } from 'components/Period/validation'
import { PensjonPeriode, Periode } from 'declarations/sed'
import { Arbeidsgiver, Validation } from 'declarations/types'
import _ from 'lodash'
import { FeiloppsummeringFeil } from 'nav-frontend-skjema'
import { TFunction } from 'react-i18next'
import { getIdx } from 'utils/namespace'

export interface ValidationArbeidsgiverProps {
  arbeidsgiver: Arbeidsgiver
  namespace: string
}

export interface ValidationArbeidsperiodeProps {
  periode: Periode,
  perioder: Array<Periode> | undefined,
  index?: number
  namespace: string
  personName: string
}

const datePattern = /^\d{4}-\d{2}-\d{2}$/

export const validateArbeidsgiver = (
  v: Validation,
  t: TFunction,
  {
    arbeidsgiver,
    namespace
  }: ValidationArbeidsgiverProps
): boolean => {
  let hasErrors: boolean = false
  if (_.isEmpty(arbeidsgiver?.arbeidsgiversNavn?.trim())) {
    v[namespace + '-arbeidsgiver-navn'] = {
      skjemaelementId: namespace + '-arbeidsgiver-navn',
      feilmelding: t('message:validation-noNavn')
    } as FeiloppsummeringFeil
    hasErrors = true
  }
  if (_.isEmpty(arbeidsgiver?.arbeidsgiversOrgnr?.trim())) {
    v[namespace + '-arbeidsgiver-orgnr'] = {
      skjemaelementId: namespace + '-arbeidsgiver-orgnr',
      feilmelding: t('message:validation-noOrgnr')
    } as FeiloppsummeringFeil
    hasErrors = true
  }
  if (_.isEmpty(arbeidsgiver?.fraDato?.trim())) {
    v[namespace + '-arbeidsgiver-startdato'] = {
      skjemaelementId: namespace + '-arbeidsgiver-startdato',
      feilmelding: t('message:validation-noDate')
    } as FeiloppsummeringFeil
    hasErrors = true
  }
  if (!_.isEmpty(arbeidsgiver.fraDato) && !(arbeidsgiver.fraDato!.trim().match(datePattern))) {
    v[namespace + '-arbeidsgiver-startdato'] = {
      skjemaelementId: namespace + '-arbeidsgiver-startdato',
      feilmelding: t('message:validation-invalidDate')
    } as FeiloppsummeringFeil
    hasErrors = true
  }
  if (!_.isEmpty(arbeidsgiver.tilDato) && !(arbeidsgiver.tilDato!.trim().match(datePattern))) {
    v[namespace + '-arbeidsgiver-sluttdato'] = {
      skjemaelementId: namespace + '-arbeidsgiver-sluttdato',
      feilmelding: t('message:validation-invalidDate')
    } as FeiloppsummeringFeil
    hasErrors = true
  }
  return hasErrors
}

export const validateAnsattPeriode = (
  v: Validation,
  t: TFunction,
  {
    periode,
    perioder,
    index,
    namespace,
    personName
  }: ValidationArbeidsperiodeProps
): boolean => {
  let hasErrors: boolean = validatePeriod(v, t, {
    period: periode,
    namespace: namespace + '-periode',
    index: index,
    personName: personName
  })
  const idx = getIdx(index)
  if (!_.isEmpty(periode?.startdato)) {
    let duplicate: boolean
    if (_.isNil(index)) {
      duplicate = _.find(perioder, p => p.startdato === periode?.startdato) !== undefined
    } else {
      const otherPerioder: Array<Periode> = _.filter(perioder, (p, i) => i !== index)
      duplicate = _.find(otherPerioder, e => e.startdato === periode?.startdato) !== undefined
    }
    if (duplicate) {
      v[namespace + '-periode' + idx + '-startdato'] = {
        feilmelding: t('message:validation-duplicateStartdatoForPerson', { person: personName }),
        skjemaelementId: namespace + '-periode' + idx + '-startdato'
      } as FeiloppsummeringFeil
      hasErrors = true
    }
  }

  return hasErrors
}

export const validateAnsattPerioder = (
  v: Validation,
  t: TFunction,
  perioder: Array<Periode>,
  namespace: string,
  personName: string
): boolean => {
  let hasErrors: boolean = false
  perioder?.forEach((periode: Periode | PensjonPeriode, index: number) => {
    const _error = validateAnsattPeriode(v, t, { periode: (periode as Periode), perioder, index, namespace, personName })
    hasErrors = hasErrors || _error
  })

  if (hasErrors) {
    const namespaceBits = namespace.split('-')
    const mainNamespace = namespaceBits[0]
    const personNamespace = mainNamespace + '-' + namespaceBits[1]
    const categoryNamespace = personNamespace + '-' + namespaceBits[2]
    v[mainNamespace] = { feilmelding: 'notnull', skjemaelementId: '' } as FeiloppsummeringFeil
    v[personNamespace] = { feilmelding: 'notnull', skjemaelementId: '' } as FeiloppsummeringFeil
    v[categoryNamespace] = { feilmelding: 'notnull', skjemaelementId: '' } as FeiloppsummeringFeil
  }
  return hasErrors
}
