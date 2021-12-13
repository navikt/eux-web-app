import { DagpengerMottatt } from 'declarations/pd'
import { Periode } from 'declarations/sed'
import { Validation } from 'declarations/types'
import { TFunction } from 'react-i18next'
import { getIdx } from 'utils/namespace'
import { addError, checkIfNotEmpty, propagateError } from 'utils/validation'
import { validateAdresse } from '../Adresse/validation'

export interface ValidationDagpengerPeriodeProps {
  startdato: string | undefined
  sluttdato: string |undefined
  index ? : number
  namespace: string
}

export interface ValidationDagpengerProps {
  dagpenger: DagpengerMottatt
  namespace: string
}

export const validateDagpengerPeriode = (
  v: Validation,
  t: TFunction,
  {
    startdato,
    sluttdato,
    index,
    namespace
  }: ValidationDagpengerPeriodeProps
): boolean => {
  const hasErrors: Array<boolean> = []
  const idx = getIdx(index)

  hasErrors.push(checkIfNotEmpty(v, {
    needle: startdato,
    id: namespace + idx + '-startdato',
    message: 'validation:noStartdato'
  }))

  hasErrors.push(checkIfNotEmpty(v, {
    needle: sluttdato,
    id: namespace + idx + '-sluttdato',
    message: 'validation:noSluttdato'
  }))

  return hasErrors.find(value => value) !== undefined
}

export const validateDagpenger = (
  v: Validation,
  t: TFunction,
  {
    dagpenger,
    namespace
  }: ValidationDagpengerProps
): boolean => {
  const hasErrors: Array<boolean> = []

  dagpenger?.perioder?.forEach((periode: Periode, index: number) => {
    hasErrors.push(validateDagpengerPeriode(v, t, {
      startdato: periode.startdato,
      sluttdato: periode.sluttdato,
      index,
      namespace: namespace + '-perioder'
    }))
  })

  if (dagpenger?.perioder && dagpenger.perioder.length > 3) {
    addError(v, {
      id: namespace + '-generic',
      message: 'validation:tooManyPeriodsMaxIs',
      extra: {
        type: t('label:dagpenger'),
        max: '3'
      }
    })
    hasErrors.push(true)
  }

  hasErrors.push(checkIfNotEmpty(v, {
    needle: dagpenger?.sisteUtbetaler?.sisteNavKontor,
    id: namespace + '-sisteUtbetaler-sisteNavKontor',
    message: 'validation:noSisteNavKontor'
  }))

  hasErrors.push(checkIfNotEmpty(v, {
    needle: dagpenger?.sisteUtbetaler?.id,
    id: namespace + '-sisteUtbetaler-id',
    message: 'validation:noId'
  }))

  hasErrors.push(checkIfNotEmpty(v, {
    needle: dagpenger?.sisteUtbetaler?.navn,
    id: namespace + '-sisteUtbetaler-navn',
    message: 'validation:noNavn'
  }))

  hasErrors.push(checkIfNotEmpty(v, {
    needle: dagpenger?.sisteUtbetaler?.navn,
    id: namespace + '-sisteUtbetaler-navn',
    message: 'validation:noNavn'
  }))

  hasErrors.push(validateAdresse(v, t, {
    namespace: namespace + '-adresse',
    adresse: dagpenger?.sisteUtbetaler?.adresse
  }))

  const hasError: boolean = hasErrors.find(value => value) !== undefined
  if (hasError) propagateError(v, namespace)
  return hasError
}
