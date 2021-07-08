import { validatePeriod } from 'components/Period/validation'
import { Ytelse } from 'declarations/sed'
import { Validation } from 'declarations/types'
import _ from 'lodash'
import { FeiloppsummeringFeil } from 'nav-frontend-skjema'
import { TFunction } from 'react-i18next'
import { getIdx } from 'utils/namespace'

export interface ValidationFamilieytelserProps {
  ytelse: Ytelse
  index?: number
  namespace: string,
  personName: string
}

export const validateFamilieytelse = (
  v: Validation,
  t: TFunction,
  {
    ytelse = {} as any,
    index,
    namespace,
    personName
  }: ValidationFamilieytelserProps
): boolean => {
  let hasErrors: boolean = false
  const idx = getIdx(index)

  if (_.isEmpty(ytelse?.antallPersoner?.trim())) {
    v[namespace + idx + '-antallPersoner'] = {
      skjemaelementId: namespace + idx + '-antallPersoner',
      feilmelding: t('message:validation-noAntallPersonerForPerson', { person: personName })
    } as FeiloppsummeringFeil
    hasErrors = true
  }

  if (_.isEmpty(ytelse?.ytelseNavn?.trim())) {
    v[namespace + idx + '-ytelseNavn'] = {
      skjemaelementId: namespace + idx + '-ytelseNavn',
      feilmelding: t('message:validation-noBetegnelsePåYtelseForPerson', { person: personName })
    } as FeiloppsummeringFeil
    hasErrors = true
  }

  if (_.isEmpty(ytelse?.beloep?.trim())) {
    v[namespace + idx + '-beloep'] = {
      skjemaelementId: namespace + idx + '-beloep',
      feilmelding: t('message:validation-noBeløpForPerson', { person: personName })
    } as FeiloppsummeringFeil
    hasErrors = true
  }

  if (_.isEmpty(ytelse?.valuta?.trim())) {
    v[namespace + idx + '-valuta'] = {
      skjemaelementId: namespace + idx + '-valuta',
      feilmelding: t('message:validation-noValutaForPerson', { person: personName })
    } as FeiloppsummeringFeil
    hasErrors = true
  }

  const periodErrors: boolean = validatePeriod(v, t, {
    period: {
      startdato: ytelse.startdato,
      sluttdato: ytelse.sluttdato
    },
    namespace: namespace + idx
  })
  hasErrors = hasErrors || periodErrors

  if (_.isEmpty(ytelse?.mottakersNavn?.trim())) {
    v[namespace + idx + '-mottakersNavn'] = {
      skjemaelementId: namespace + idx + '-mottakersNavn',
      feilmelding: t('message:validation-noNavnTilPerson', { person: personName })
    } as FeiloppsummeringFeil
    hasErrors = true
  }

  if (_.isEmpty(ytelse?.utbetalingshyppighet?.trim())) {
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
