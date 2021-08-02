import { Inntekt } from 'declarations/sed'
import { Validation } from 'declarations/types'
import _ from 'lodash'
import { FeiloppsummeringFeil } from 'nav-frontend-skjema'
import { TFunction } from 'react-i18next'
import { getIdx } from 'utils/namespace'

export interface ValidationInntekterProps {
  inntekt: Inntekt,
  index?: number
  namespace: string
}

export const validateInntekt = (
  v: Validation,
  t: TFunction,
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
      feilmelding: t('message:validation-noType'),
      skjemaelementId: namespace + idx + '-type'
    } as FeiloppsummeringFeil
    hasErrors = true
  }

  if (_.isEmpty(inntekt?.beloep?.trim())) {
    v[namespace + '-beloep'] = {
      skjemaelementId: namespace + '-beloep',
      feilmelding: t('message:validation-noBeløp')
    } as FeiloppsummeringFeil
    hasErrors = true
  }

  if (!_.isEmpty(inntekt?.beloep?.trim()) && !inntekt?.beloep?.trim().match(/^\d+$/)) {
    v[namespace + '-beloep'] = {
      skjemaelementId: namespace + '-beloep',
      feilmelding: t('message:validation-invalidBeløp')
    } as FeiloppsummeringFeil
    hasErrors = true
  }

  if (_.isEmpty(inntekt?.valuta?.trim())) {
    v[namespace + '-valuta'] = {
      skjemaelementId: namespace + '-valuta',
      feilmelding: t('message:validation-noValuta')
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

export const validateInntekter = (
  validation: Validation,
  t: TFunction,
  inntekter: Array<Inntekt>,
  namespace: string
): boolean => {
  let hasErrors: boolean = false
  inntekter?.forEach((inntekt: Inntekt, index: number) => {
    const _errors: boolean = validateInntekt(validation, t, {
      inntekt,
      index,
      namespace
    })
    hasErrors = hasErrors || _errors
  })
  return hasErrors
}
