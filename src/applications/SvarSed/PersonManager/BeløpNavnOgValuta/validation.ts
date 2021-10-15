import { validatePeriode } from 'components/Forms/validation'
import { Ytelse } from 'declarations/sed'
import { Validation } from 'declarations/types'
import _ from 'lodash'
import { FeiloppsummeringFeil } from 'nav-frontend-skjema'
import { TFunction } from 'react-i18next'
import { getIdx } from 'utils/namespace'

export interface ValidationBeløpNavnOgValutaProps {
  ytelse: Ytelse
  index?: number
  namespace: string
  personID: string | undefined
  personName: string
}

export const validateBeløpNavnOgValuta = (
  v: Validation,
  t: TFunction,
  {
    ytelse,
    index,
    namespace,
    personID,
    personName
  }: ValidationBeløpNavnOgValutaProps
): boolean => {
  let hasErrors: boolean = false
  const idx = getIdx(index)

  if (personID === 'familie' && _.isEmpty(ytelse?.antallPersoner?.trim())) {
    v[namespace + idx + '-antallPersoner'] = {
      skjemaelementId: namespace + idx + '-antallPersoner',
      feilmelding: t('message:validation-noAntallPersonerTil', { person: personName })
    } as FeiloppsummeringFeil
    hasErrors = true
  }

  if (_.isEmpty(ytelse?.ytelseNavn?.trim())) {
    v[namespace + '-ytelseNavn'] = {
      skjemaelementId: namespace + '-ytelseNavn',
      feilmelding: t('message:validation-noBetegnelsePåYtelseTil', { person: personName })
    } as FeiloppsummeringFeil
    hasErrors = true
  }

  if (_.isEmpty(ytelse?.beloep?.trim())) {
    v[namespace + '-beloep'] = {
      skjemaelementId: namespace + '-beloep',
      feilmelding: t('message:validation-noBeløpTil', { person: personName })
    } as FeiloppsummeringFeil
    hasErrors = true
  }

  if (!_.isEmpty(ytelse?.beloep?.trim()) && !ytelse?.beloep?.trim().match(/^[\d.,]+$/)) {
    v[namespace + '-beloep'] = {
      skjemaelementId: namespace + '-beloep',
      feilmelding: t('message:validation-invalidBeløpTil', { person: personName })
    } as FeiloppsummeringFeil
    hasErrors = true
  }

  if (_.isEmpty(ytelse?.valuta?.trim())) {
    v[namespace + '-valuta'] = {
      skjemaelementId: namespace + '-valuta',
      feilmelding: t('message:validation-noValutaTil', { person: personName })
    } as FeiloppsummeringFeil
    hasErrors = true
  }

  const periodErrors: boolean = validatePeriode(v, t, {
    periode: {
      startdato: ytelse?.startdato,
      sluttdato: ytelse?.sluttdato
    },
    namespace
  })
  hasErrors = hasErrors || periodErrors

  if (_.isEmpty(ytelse?.mottakersNavn?.trim())) {
    v[namespace + '-mottakersNavn'] = {
      skjemaelementId: namespace + '-mottakersNavn',
      feilmelding: t('message:validation-noNavnTil', { person: personName })
    } as FeiloppsummeringFeil
    hasErrors = true
  }

  if (_.isEmpty(ytelse?.utbetalingshyppighet?.trim())) {
    v[namespace + '-utbetalingshyppighet'] = {
      skjemaelementId: namespace + '-utbetalingshyppighet',
      feilmelding: t('message:validation-noUtbetalingshyppighetTil', { person: personName })
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

interface ValidationBeløpNavnOgValutasProps {
  ytelser: Array<Ytelse>
  namespace: string
  personID: string | undefined
  personName: string
}

export const validateBeløpNavnOgValutas = (
  validation: Validation,
  t: TFunction,
  {
    ytelser,
    namespace,
    personID,
    personName
  }: ValidationBeløpNavnOgValutasProps
): boolean => {
  let hasErrors: boolean = false
  ytelser?.forEach((ytelse: Ytelse, index: number) => {
    const _error: boolean = validateBeløpNavnOgValuta(validation, t, { ytelse, index, namespace, personID, personName })
    hasErrors = hasErrors || _error
  })
  return hasErrors
}
