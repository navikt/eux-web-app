import { validatePeriod } from 'components/Period/validation'
import { Motregning } from 'declarations/sed'
import { Validation } from 'declarations/types'
import _ from 'lodash'
import { FeiloppsummeringFeil } from 'nav-frontend-skjema'
import { TFunction } from 'react-i18next'
import { getIdx } from 'utils/namespace'

export interface ValidationFamilieytelserProps {
  motregning: Motregning
  index: number
  namespace: string,
  personName: string
}

export const validateFamilieytelse = (
  v: Validation,
  t: TFunction,
  {
    motregning,
    index,
    namespace,
    personName
  }: ValidationFamilieytelserProps
): boolean => {
  let hasErrors: boolean = false
  const idx = getIdx(index)
  /*
  if (_.isEmpty(motregning.number)) {
    v[namespace + '-antallPersoner'] = {
      skjemaelementId: namespace + '-antallPersoner',
      feilmelding: t('message:validation-noAntallToPerson', { person: personName })
    } as FeiloppsummeringFeil
    hasErrors = true
  } */

  if (_.isEmpty(motregning?.ytelseNavn?.trim())) {
    v[namespace + idx + '-ytelseNavn'] = {
      skjemaelementId: namespace + idx + '-ytelseNavn',
      feilmelding: t('message:validation-noBetegnelsePåYtelseForPerson', { person: personName })
    } as FeiloppsummeringFeil
    hasErrors = true
  }

  if (_.isEmpty(motregning?.beloep?.trim())) {
    v[namespace + idx + '-beloep'] = {
      skjemaelementId: namespace + idx + '-beloep',
      feilmelding: t('message:validation-noBeløpForPerson', { person: personName })
    } as FeiloppsummeringFeil
    hasErrors = true
  }

  if (_.isEmpty(motregning?.valuta?.trim())) {
    v[namespace + idx + '-valuta'] = {
      skjemaelementId: namespace + idx + '-valuta',
      feilmelding: t('message:validation-noValutaForPerson', { person: personName })
    } as FeiloppsummeringFeil
    hasErrors = true
  }

  const periodErrors: boolean = validatePeriod(v, t, {
    period: {
      startdato: motregning.startdato,
      sluttdato: motregning.sluttdato
    },
    index: -1,
    namespace: namespace + idx
  })
  hasErrors = hasErrors || periodErrors

  if (_.isEmpty(motregning?.mottakersNavn?.trim())) {
    v[namespace + idx + '-mottakersNavn'] = {
      skjemaelementId: namespace + idx + '-mottakersNavn',
      feilmelding: t('message:validation-noNavnForPerson', { person: personName })
    } as FeiloppsummeringFeil
    hasErrors = true
  }

  if (_.isEmpty(motregning?.utbetalingshyppighet?.trim())) {
    v[namespace + '-utbetalingshyppighet'] = {
      skjemaelementId: namespace + idx + '-utbetalingshyppighet',
      feilmelding: t('message:validation-noUtbetalingshyppighetForPerson', { person: personName })
    } as FeiloppsummeringFeil
    hasErrors = true
  }

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

export const validateFamilieytelser = (
  validation: Validation,
  t: TFunction,
  motregninger: Array<Motregning>,
  namespace: string,
  personName: string
): boolean => {
  let hasErrors: boolean = false
  motregninger?.forEach((motregning: Motregning, index: number) => {
    const _errors: boolean = validateFamilieytelse(validation, t, { motregning, index, namespace, personName })
    hasErrors = hasErrors || _errors
  })
  return hasErrors
}
