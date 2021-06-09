import { validatePeriod } from 'components/Period/validation'
import { FormalVedtak, PeriodeMedVedtak } from 'declarations/sed'
import { Validation } from 'declarations/types'
import _ from 'lodash'
import { FeiloppsummeringFeil } from 'nav-frontend-skjema'
import { TFunction } from 'react-i18next'
import { getIdx } from 'utils/namespace'

export interface ValidationVedtakPeriodeProps {
  periode: PeriodeMedVedtak
  perioder: Array<PeriodeMedVedtak>
  index?: number
  namespace: string
  personName?: string
}

export const validateVedtakPeriode = (
  v: Validation,
  t: TFunction,
  {
    periode,
    perioder,
    index,
    namespace,
    personName
  }:ValidationVedtakPeriodeProps
): boolean => {
  let hasErrors: boolean = false
  const idx = getIdx(index)

  const periodeError: boolean = validatePeriod(
    v, t, {
      period: periode?.periode,
      namespace: namespace + '-vedtaksperioder' + idx + '-periode',
      personName: personName
    }
  )
  hasErrors = hasErrors || periodeError

  if (!_.isEmpty(periode?.periode.startdato)) {
    let duplicate: boolean
    duplicate = _.find(perioder, p => p.periode.startdato === periode?.periode.startdato) !== undefined
    if (duplicate) {
      v[namespace + '-vedtaksperioder' + idx + '-periode-startdato'] = {
        feilmelding: t('message:validation-duplicateStartdatoForPerson', { person: personName }),
        skjemaelementId: namespace + '-vedtaksperioder' + idx + '-periode-startdato'
      } as FeiloppsummeringFeil
      hasErrors = true
    }
  }

  if (_.isEmpty(periode?.vedtak?.trim())) {
    v[namespace + '-vedtaksperioder' + idx + '-vedtak'] = {
      feilmelding: personName
        ? t('message:validation-noVedtakTilPerson', { person: personName })
        : t('message:validation-noVedtak'),
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
  namespace: string,
  personName: string
): boolean => {
  let hasErrors: boolean = false
  perioder?.forEach((periode: PeriodeMedVedtak, index: number) => {
    const _error: boolean = validateVedtakPeriode(v, t, { periode, perioder, index, namespace, personName })
    hasErrors = hasErrors || _error
  })

  return hasErrors
}

export const validateVedtak = (
  v: Validation,
  t: TFunction,
  vedtak: FormalVedtak,
  namespace: string,
  personName: string
): boolean => {
  let hasErrors: boolean = false

  if (_.isEmpty(vedtak?.barn)) {
    v[namespace + '-barn'] = {
      feilmelding: t('message:validation-noBarnValgtTilPerson', { person: personName }),
      skjemaelementId: namespace + '-barn'
    } as FeiloppsummeringFeil
    hasErrors = true
  }

  const periodeError: boolean = validatePeriod(
    v, t, {
      period: vedtak?.periode,
      namespace: namespace + '-periode',
      personName: personName
    }
  )
  hasErrors = hasErrors || periodeError

  if (_.isEmpty(vedtak?.type?.trim())) {
    v[namespace + '-type'] = {
      feilmelding: t('message:validation-noVedtakTypeTilPerson', { person: personName }),
      skjemaelementId: namespace + '-type'
    } as FeiloppsummeringFeil
    hasErrors = true
  }

  const _error = validateVedtakPerioder(v, t, vedtak?.vedtaksperioder, namespace, personName)
  hasErrors = hasErrors || _error

  if (vedtak?.grunnen?.trim()?.length > 500) {
    v[namespace + '-grunnen'] = {
      feilmelding: t('message:validation-textOver500TilPerson', { person: personName }),
      skjemaelementId: namespace + '-grunnen'
    } as FeiloppsummeringFeil
    hasErrors = true
  }


  if (hasErrors) {
    const namespaceBits = namespace.split('-')
    const mainNamespace = namespaceBits[0]
    const formaalNamespace = mainNamespace + '-' + namespaceBits[1]
    v[mainNamespace] = { feilmelding: 'notnull', skjemaelementId: '' } as FeiloppsummeringFeil
    v[formaalNamespace] = { feilmelding: 'notnull', skjemaelementId: '' } as FeiloppsummeringFeil
  }
  return hasErrors
}
