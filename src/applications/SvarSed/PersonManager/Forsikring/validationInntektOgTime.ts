import { validatePeriode } from 'components/Forms/validation'
import { InntektOgTime } from 'declarations/sed'
import { Validation } from 'declarations/types'
import _ from 'lodash'
import { FeiloppsummeringFeil } from 'nav-frontend-skjema'
import { TFunction } from 'react-i18next'
import { getIdx } from 'utils/namespace'

export interface ValidationInntektOgTimeProps {
  inntektOgTime: InntektOgTime
  index?: number
  namespace: string
  personName: string
}

interface ValidationInntektOgTimerProps {
  inntektOgTimer: Array<InntektOgTime> | undefined
  namespace: string
  personName: string
}

export const validateInntektOgTime = (
  v: Validation,
  t: TFunction,
  {
    inntektOgTime,
    index,
    namespace,
    personName
  }: ValidationInntektOgTimeProps
): boolean => {
  let hasErrors: boolean = false
  const idx = getIdx(index)

  const periodeError: boolean = validatePeriode(v, t, {
    periode: inntektOgTime.inntektsperiode,
    namespace: namespace + idx + '-periode'
  })
  hasErrors = hasErrors || periodeError

  if (!_.isEmpty(inntektOgTime?.bruttoinntekt)) {
    v[namespace + idx + '-bruttoinntekt'] = {
      feilmelding: t('message:validation-noInntektTil', { person: personName }),
      skjemaelementId: namespace + idx + '-bruttoinntekt'
    } as FeiloppsummeringFeil
    hasErrors = true
  }

  if (!_.isEmpty(inntektOgTime?.valuta)) {
    v[namespace + idx + '-valuta'] = {
      feilmelding: t('message:validation-noValutaTil', { person: personName }),
      skjemaelementId: namespace + idx + '-valuta'
    } as FeiloppsummeringFeil
    hasErrors = true
  }

  if (!_.isEmpty(inntektOgTime?.arbeidstimer)) {
    v[namespace + idx + '-arbeidstimer'] = {
      feilmelding: t('message:validation-noArbeidstimerTil', { person: personName }),
      skjemaelementId: namespace + idx + '-arbeidstimer'
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

export const validateInntektOgTimer = (
  validation: Validation,
  t: TFunction,
  {
    inntektOgTimer,
    namespace,
    personName
  }: ValidationInntektOgTimerProps
): boolean => {
  let hasErrors: boolean = false
  inntektOgTimer?.forEach((inntektOgTime: InntektOgTime, index: number) => {
    const _errors: boolean = validateInntektOgTime(validation, t, {
      inntektOgTime,
      index,
      namespace,
      personName
    })
    hasErrors = hasErrors || _errors
  })
  return hasErrors
}
