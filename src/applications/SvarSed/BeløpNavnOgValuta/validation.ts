import { validatePeriode } from 'components/Forms/validation'
import { Ytelse } from 'declarations/sed'
import { Validation } from 'declarations/types'
import _ from 'lodash'
import { ErrorElement } from 'declarations/app.d'
import { getIdx } from 'utils/namespace'

export interface ValidationBeløpNavnOgValutaProps {
  ytelse: Ytelse
  index?: number
  namespace: string
  personID: string | undefined
  personName?: string
}

export const validateBeløpNavnOgValuta = (
  v: Validation,
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
      feilmelding: t('validation:noAntallPersoner') + (personName ? t('validation:til-person', { person: personName }) : '')
    } as ErrorElement
    hasErrors = true
  }

  if (_.isEmpty(ytelse?.ytelseNavn?.trim())) {
    v[namespace + '-ytelseNavn'] = {
      skjemaelementId: namespace + '-ytelseNavn',
      feilmelding: t('validation:noBetegnelsePåYtelse') + (personName ? t('validation:til-person', { person: personName }) : '')
    } as ErrorElement
    hasErrors = true
  }

  if (_.isEmpty(ytelse?.beloep?.trim())) {
    v[namespace + '-beloep'] = {
      skjemaelementId: namespace + '-beloep',
      feilmelding: t('validation:noBeløp') + (personName ? t('validation:til-person', { person: personName }) : '')
    } as ErrorElement
    hasErrors = true
  }

  if (!_.isEmpty(ytelse?.beloep?.trim()) && !ytelse?.beloep?.trim().match(/^[\d.,]+$/)) {
    v[namespace + '-beloep'] = {
      skjemaelementId: namespace + '-beloep',
      feilmelding: t('validation:invalidBeløp') + (personName ? t('validation:til-person', { person: personName }) : '')
    } as ErrorElement
    hasErrors = true
  }

  if (_.isEmpty(ytelse?.valuta?.trim())) {
    v[namespace + '-valuta'] = {
      skjemaelementId: namespace + '-valuta',
      feilmelding: t('validation:noValuta') + (personName ? t('validation:til-person', { person: personName }) : '')
    } as ErrorElement
    hasErrors = true
  }

  const periodErrors: boolean = validatePeriode(v, {
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
      feilmelding: t('validation:noNavn') + (personName ? t('validation:til-person', { person: personName }) : '')
    } as ErrorElement
    hasErrors = true
  }

  if (_.isEmpty(ytelse?.utbetalingshyppighet?.trim())) {
    v[namespace + '-utbetalingshyppighet'] = {
      skjemaelementId: namespace + '-utbetalingshyppighet',
      feilmelding: t('validation:noUtbetalingshyppighet') + (personName ? t('validation:til-person', { person: personName }) : '')
    } as ErrorElement
    hasErrors = true
  }

  if (hasErrors) {
    const namespaceBits = namespace.split('-')
    const mainNamespace = namespaceBits[0]
    const personNamespace = mainNamespace + '-' + namespaceBits[1]
    const categoryNamespace = personNamespace + '-' + namespaceBits[2]
    v[mainNamespace] = { feilmelding: 'error', skjemaelementId: '' } as ErrorElement
    v[personNamespace] = { feilmelding: 'error', skjemaelementId: '' } as ErrorElement
    v[categoryNamespace] = { feilmelding: 'error', skjemaelementId: '' } as ErrorElement
  }
  return hasErrors
}

interface ValidationBeløpNavnOgValutasProps {
  ytelser: Array<Ytelse>
  namespace: string
  personID: string | undefined
  personName?: string
}

export const validateBeløpNavnOgValutas = (
  validation: Validation,
  {
    ytelser,
    namespace,
    personID,
    personName
  }: ValidationBeløpNavnOgValutasProps
): boolean => {
  let hasErrors: boolean = false
  ytelser?.forEach((ytelse: Ytelse, index: number) => {
    const _error: boolean = validateBeløpNavnOgValuta(validation, { ytelse, index, namespace, personID, personName })
    hasErrors = hasErrors || _error
  })
  return hasErrors
}
