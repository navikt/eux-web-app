import { Inntekt } from 'declarations/sed'
import { Validation } from 'declarations/types'
import _ from 'lodash'
import { ErrorElement } from 'declarations/app.d'
import { getIdx } from 'utils/namespace'

export interface ValidationInntekterProps {
  inntekt: Inntekt,
  index?: number
  namespace: string
}

export const validateInntekt = (
  v: Validation,
  {
    inntekt,
    index,
    namespace
  }: ValidationInntekterProps
): boolean => {
  let hasErrors: boolean = false
  const idx = getIdx(index)

  if (_.isEmpty(inntekt?.type?.trim())) {
    v[namespace + idx + '-type'] = {
      feilmelding: t('validation:noType'),
      skjemaelementId: namespace + idx + '-type'
    } as ErrorElement
    hasErrors = true
  }

  if (_.isEmpty(inntekt?.beloep?.trim())) {
    v[namespace + '-beloep'] = {
      skjemaelementId: namespace + '-beloep',
      feilmelding: t('validation:noBeløp')
    } as ErrorElement
    hasErrors = true
  }

  if (!_.isEmpty(inntekt?.beloep?.trim()) && !inntekt?.beloep?.trim().match(/^[\d.,]+$/)) {
    v[namespace + '-beloep'] = {
      skjemaelementId: namespace + '-beloep',
      feilmelding: t('validation:invalidBeløp')
    } as ErrorElement
    hasErrors = true
  }

  if (_.isEmpty(inntekt?.valuta?.trim())) {
    v[namespace + '-valuta'] = {
      skjemaelementId: namespace + '-valuta',
      feilmelding: t('validation:noValuta')
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

export const validateInntekter = (
  validation: Validation,
  inntekter: Array<Inntekt>,
  namespace: string
): boolean => {
  let hasErrors: boolean = false
  inntekter?.forEach((inntekt: Inntekt, index: number) => {
    const _errors: boolean = validateInntekt(validation, {
      inntekt,
      index,
      namespace
    })
    hasErrors = hasErrors || _errors
  })
  return hasErrors
}
