import { validatePeriode } from 'components/Forms/validation'
import { Periode, Ytelse } from 'declarations/sed'
import { Validation } from 'declarations/types'
import _ from 'lodash'
import { getIdx } from 'utils/namespace'
import { addError, checkIfNotEmpty } from 'utils/validation'

export interface ValidationBeløpNavnOgValutaProps {
  ytelse: Ytelse | undefined
  index?: number
  personID: string | undefined
  personName?: string
}

export interface ValidationBeløpNavnOgValutasProps {
  ytelser: Array<Ytelse> | undefined
  personID: string | undefined
  personName?: string
}

export const validateBeløpNavnOgValuta = (
  v: Validation,
  namespace: string,
  {
    ytelse,
    index,
    personID,
    personName
  }: ValidationBeløpNavnOgValutaProps
): boolean => {
  const hasErrors: Array<boolean> = []
  const idx = getIdx(index)

  if (personID === 'familie') {
    hasErrors.push(checkIfNotEmpty(v, {
      needle: ytelse?.antallPersoner,
      id: namespace + idx + '-antallPersoner',
      message: 'validation:noAntallPersoner',
      personName
    }))
  }

  hasErrors.push(checkIfNotEmpty(v, {
    needle: ytelse?.ytelseNavn,
    id: namespace + idx + '-ytelseNavn',
    message: 'validation:noBetegnelsePåYtelse',
    personName
  }))

  hasErrors.push(checkIfNotEmpty(v, {
    needle: ytelse?.beloep,
    id: namespace + idx + '-beloep',
    message: 'validation:noBeløp',
    personName
  }))

  if (!_.isEmpty(ytelse?.beloep?.trim()) && !ytelse?.beloep?.trim().match(/^[\d.,]+$/)) {
    hasErrors.push(addError(v, {
      id: namespace + idx + '-beloep',
      message: 'validation:invalidBeløp',
      personName
    }))
  }

  hasErrors.push(checkIfNotEmpty(v, {
    needle: ytelse?.valuta,
    id: namespace + idx + '-valuta',
    message: 'validation:noValuta',
    personName
  }))

  hasErrors.push(validatePeriode(v, namespace, {
    periode: {
      startdato: ytelse?.startdato,
      sluttdato: ytelse?.sluttdato
    } as Periode,
    periodeType: 'simple',
    index,
    personName
  }))

  hasErrors.push(checkIfNotEmpty(v, {
    needle: ytelse?.mottakersNavn,
    id: namespace + idx + '-mottakersNavn',
    message: 'validation:noNavn',
    personName
  }))

  hasErrors.push(checkIfNotEmpty(v, {
    needle: ytelse?.utbetalingshyppighet,
    id: namespace + idx + '-utbetalingshyppighet',
    message: 'validation:noUtbetalingshyppighet',
    personName
  }))

  return hasErrors.find(value => value) !== undefined
}

export const validateBeløpNavnOgValutas = (
  validation: Validation,
  namespace: string,
  {
    ytelser,
    personID,
    personName
  }: ValidationBeløpNavnOgValutasProps
): boolean => {
  const hasErrors: Array<boolean> = []
  ytelser?.forEach((ytelse: Ytelse, index: number) => {
    hasErrors.push(validateBeløpNavnOgValuta(validation, namespace, {
      ytelse, index, personID, personName
    }))
  })
  return hasErrors.find(value => value) !== undefined
}
