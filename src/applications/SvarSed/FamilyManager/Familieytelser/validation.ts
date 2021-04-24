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
      skjemaelementId: 'c-' + namespace + '-antallPersoner-text',
      feilmelding: t('message:validation-noAntallToPerson', { person: personName })
    } as FeiloppsummeringFeil
    hasErrors = true
  } */

  if (_.isEmpty(motregning.ytelseNavn)) {
    v[namespace + idx + '-ytelseNavn'] = {
      skjemaelementId: 'c-' + namespace + idx + '-ytelseNavn-text',
      feilmelding: t('message:validation-noBetegnelsePåYtelseForPerson', { person: personName })
    } as FeiloppsummeringFeil
    hasErrors = true
  }

  if (_.isEmpty(motregning.beloep)) {
    v[namespace + idx + '-beloep'] = {
      skjemaelementId: 'c-' + namespace + idx + '-beloep-text',
      feilmelding: t('message:validation-noBeløpForPerson', { person: personName })
    } as FeiloppsummeringFeil
    hasErrors = true
  }

  if (_.isEmpty(motregning.valuta)) {
    v[namespace + idx + '-valuta'] = {
      skjemaelementId: 'c-' + namespace + idx + '-valuta-text',
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

  if (_.isEmpty(motregning.mottakersNavn)) {
    v[namespace + idx + '-mottakersNavn'] = {
      skjemaelementId: 'c-' + namespace + idx + '-mottakersNavn-text',
      feilmelding: t('message:validation-noNavnForPerson', { person: personName })
    } as FeiloppsummeringFeil
    hasErrors = true
  }

  if (_.isEmpty(motregning.utbetalingshyppighet)) {
    v[namespace + '-utbetalingshyppighet'] = {
      skjemaelementId: 'c-' + namespace + idx + '-utbetalingshyppighet-text',
      feilmelding: t('message:validation-noUtbetalingshyppighetForPerson', { person: personName })
    } as FeiloppsummeringFeil
    hasErrors = true
  }

  if (hasErrors) {
    const namespaceBits = namespace.split('-')
    const personNamespace = namespaceBits[0] + '-' + namespaceBits[1]
    const categoryNamespace = personNamespace + '-' + namespaceBits[2]
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
