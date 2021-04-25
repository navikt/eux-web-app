import { validatePeriod } from 'components/Period/validation'
import { FormalVedtak, PeriodeMedVedtak } from 'declarations/sed'
import { Validation } from 'declarations/types'
import _ from 'lodash'
import { FeiloppsummeringFeil } from 'nav-frontend-skjema'
import { TFunction } from 'react-i18next'
import { getIdx } from 'utils/namespace'

export interface ValidationVedtakPeriodeProps {
  periode: PeriodeMedVedtak
  index: number
  namespace: string
}

export const validateVedtakPeriode = (
  v: Validation,
  t: TFunction,
  {
    periode,
    index,
    namespace
  }:ValidationVedtakPeriodeProps
): boolean => {
  let hasErrors: boolean = false
  const idx = getIdx(index)

  let periodeError: boolean = validatePeriod(
    v, t, {
      period: periode?.periode,
      index: -1,
      namespace: namespace + '-vedtaksperioder' + idx + '-periode'
    }
  )
  hasErrors = hasErrors || periodeError

  if (_.isEmpty(periode.vedtak)) {
    v[namespace + '-vedtaksperioder' + idx + '-vedtak'] = {
      feilmelding: t('message:validation-noVedtakType'),
      skjemaelementId: namespace + '-vedtaksperioder' + idx + '-vedtak'
    } as FeiloppsummeringFeil
    hasErrors = true
  }
  return hasErrors
}


export const validateVedtakPerioder = (
  v: Validation,
  t: TFunction,
  perioder: Array<PeriodeMedVedtak>,
  namespace: string
): boolean => {
  let hasErrors: boolean = false
  perioder?.forEach((periode: PeriodeMedVedtak, index: number) => {
    let _error: boolean = validateVedtakPeriode(v, t, {periode, index, namespace})
    hasErrors = hasErrors || _error
  })
  return hasErrors
}

export const validateVedtak = (
  v: Validation,
  t: TFunction,
  vedtak: FormalVedtak,
  namespace: string
): boolean => {
  let hasErrors: boolean = false

  if (_.isEmpty(vedtak?.barn)) {
    v[namespace + '-barn'] = {
      feilmelding: t('message:validation-noBarnValgt'),
      skjemaelementId: namespace + '-barn'
    } as FeiloppsummeringFeil
    hasErrors = true
  }

  let periodeError: boolean = validatePeriod(
    v, t, {
      period: vedtak?.periode,
      index: -1,
      namespace: namespace + '-periode'
    }
  )
  hasErrors = hasErrors || periodeError

  if (_.isEmpty(vedtak?.type)) {
    v[namespace + '-type'] = {
      feilmelding: t('message:validation-noVedtakType'),
      skjemaelementId: 'vedtak-type'
    } as FeiloppsummeringFeil
    hasErrors = true
  }

  let _error =  validateVedtakPerioder(v, t, vedtak?.vedtaksperioder, namespace)
  hasErrors = hasErrors || _error
  if (hasErrors) {
    const namespaceBits = namespace.split('-')
    const formaalNamespace = namespaceBits[0]
    v[formaalNamespace] = { feilmelding: 'notnull', skjemaelementId: '' } as FeiloppsummeringFeil
  }
  return hasErrors
}
