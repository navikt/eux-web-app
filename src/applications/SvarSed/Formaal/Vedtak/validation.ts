import { validatePeriode } from 'components/Forms/validation'
import { Vedtak, VedtakPeriode, Periode } from 'declarations/sed'
import { Validation } from 'declarations/types'
import _ from 'lodash'
import { FeiloppsummeringFeil } from 'nav-frontend-skjema'
import { TFunction } from 'react-i18next'
import { getIdx } from 'utils/namespace'

export interface ValidationVedtakPeriodeProps {
  periode: Periode
  perioder: Array<Periode>
  index?: number
  namespace: string
  formalName?: string
}

export interface ValidationVedtakVedtaksperiodeProps {
  vedtaksperiode: VedtakPeriode
  vedtaksperioder: Array<VedtakPeriode>
  vedtaktype: string
  index?: number
  namespace: string
  formalName?: string
}

const datePattern = /^\d{4}-\d{2}-\d{2}$/

export const validateVedtakPeriode = (
  v: Validation,
  t: TFunction,
  {
    periode,
    perioder,
    index,
    namespace,
    formalName
  }: ValidationVedtakPeriodeProps
): boolean => {
  let hasErrors: boolean = false
  const idx = getIdx(index)
  const periodeError: boolean = validatePeriode(
    v, t, {
      periode: periode,
      namespace: namespace + '-perioder' + idx,
      personName: formalName
    }
  )
  hasErrors = hasErrors || periodeError

  if (!_.isEmpty(periode?.startdato)) {
    let duplicate: boolean
    if (_.isNil(index)) {
      duplicate = _.find(perioder, p => p.startdato === periode?.startdato && p.sluttdato === periode?.sluttdato) !== undefined
    } else {
      const otherPerioder: Array<Periode> = _.filter(perioder, (p, i) => i !== index)
      duplicate = _.find(otherPerioder, p => p.startdato === periode?.startdato && p.sluttdato === periode?.sluttdato) !== undefined
    }
    if (duplicate) {
      v[namespace + '-perioder' + idx + '-startdato'] = {
        feilmelding: t('message:validation-duplicateStartdatoForPerson', { person: formalName }),
        skjemaelementId: namespace + '-perioder' + idx + '-startdato'
      } as FeiloppsummeringFeil
      hasErrors = true
    }
  }
  return hasErrors
}

export const validateVedtakVedtaksperiode = (
  v: Validation,
  t: TFunction,
  {
    vedtaksperiode,
    vedtaksperioder,
    vedtaktype,
    index,
    namespace,
    formalName
  }:ValidationVedtakVedtaksperiodeProps
): boolean => {
  let hasErrors: boolean = false
  let idx = getIdx(index)
  if (!_.isEmpty(idx)) {
    idx = '-' + vedtaktype + idx
  }
  const periodeError: boolean = validatePeriode(
    v, t, {
      periode: vedtaksperiode?.periode,
      namespace: namespace + '-vedtaksperioder' + idx + '-periode',
      personName: formalName
    }
  )
  hasErrors = hasErrors || periodeError

  if (!_.isEmpty(vedtaksperiode?.periode.startdato)) {
    let duplicate: boolean
    if (_.isNil(index)) {
      duplicate = _.find(vedtaksperioder, p => p.periode.startdato === vedtaksperiode?.periode.startdato && p.periode.sluttdato === vedtaksperiode?.periode.sluttdato) !== undefined
    } else {
      const otherPerioder: Array<VedtakPeriode> = _.filter(vedtaksperioder, (p, i) => i !== index)
      duplicate = _.find(otherPerioder, p => p.periode.startdato === vedtaksperiode?.periode.startdato && p.periode.sluttdato === vedtaksperiode?.periode.sluttdato) !== undefined
    }
    if (duplicate) {
      v[namespace + '-vedtaksperioder' + idx + '-periode-startdato'] = {
        feilmelding: t('message:validation-duplicateStartdatoForPerson', { person: formalName }),
        skjemaelementId: namespace + '-vedtaksperioder' + idx + '-periode-startdato'
      } as FeiloppsummeringFeil
      hasErrors = true
    }
  }

  if (_.isEmpty(vedtaksperiode?.skalYtelseUtbetales?.trim())) {
    v[namespace + '-vedtaksperioder' + idx + '-skalYtelseUtbetales'] = {
      feilmelding: t('message:validation-noSkalYtelseUtbetalesTilPerson', { person: formalName }),
      skjemaelementId: namespace + '-vedtaksperioder' + idx + '-skalYtelseUtbetales'
    } as FeiloppsummeringFeil
    hasErrors = true
  }
  return hasErrors
}

interface ValidateVedtakProps {
  vedtak: Vedtak
  namespace: string
  formalName: string
}

export const validateVedtak = (
  v: Validation,
  t: TFunction,
  {
    vedtak,
    namespace,
    formalName
  }: ValidateVedtakProps
): boolean => {
  let hasErrors: boolean = false

  if (_.isEmpty(vedtak?.gjelderAlleBarn)) {
    v[namespace + '-gjelderAlleBarn'] = {
      feilmelding: t('message:validation-noBarnValgtTilPerson', { person: formalName }),
      skjemaelementId: namespace + '-gjelderAlleBarn'
    } as FeiloppsummeringFeil
    hasErrors = true
  }

  vedtak?.vedtaksperioder?.forEach((vedtaksperioder, index) => {
    const _error: boolean = validateVedtakPeriode(v, t, { periode: vedtaksperioder, perioder: vedtak.vedtaksperioder, index, namespace, formalName: formalName })
    hasErrors = hasErrors || _error
  })

  if (_.isEmpty(vedtak?.vedtakstype?.trim())) {
    v[namespace + '-vedtakstype'] = {
      feilmelding: t('message:validation-noVedtakTypeTilPerson', { person: formalName }),
      skjemaelementId: namespace + '-vedtakstype'
    } as FeiloppsummeringFeil
    hasErrors = true
  }

  if (_.isEmpty(vedtak?.vedtaksdato?.trim())) {
    v[namespace + '-vedtaksdato'] = {
      feilmelding: t('message:validation-noDateForPerson', { person: formalName }),
      skjemaelementId: namespace + '-vedtaksdato'
    } as FeiloppsummeringFeil
    hasErrors = true
  } else {
    if (!vedtak?.vedtaksdato?.trim().match(datePattern)) {
      v[namespace + '-vedtaksdato'] = {
        skjemaelementId: namespace + '-vedtaksdato',
        feilmelding: t('message:validation-invalidDateForPerson', { person: formalName })
      } as FeiloppsummeringFeil
      hasErrors = true
    }
  }

  if (_.isEmpty(vedtak?.begrunnelse?.trim())) {
    v[namespace + '-begrunnelse'] = {
      feilmelding: t('message:validation-noBegrunnelseTilPerson', { person: formalName }),
      skjemaelementId: namespace + '-begrunnelse'
    } as FeiloppsummeringFeil
    hasErrors = true
  } else {
    if (vedtak?.begrunnelse?.trim()?.length > 500) {
      v[namespace + '-begrunnelse'] = {
        feilmelding: t('message:validation-textOver500TilPerson', { person: formalName }),
        skjemaelementId: namespace + '-begrunnelse'
      } as FeiloppsummeringFeil
      hasErrors = true
    }
  }

  if (vedtak?.ytterligereInfo?.trim()?.length > 500) {
    v[namespace + '-ytterligereInfo'] = {
      feilmelding: t('message:validation-textOver500TilPerson', { person: formalName }),
      skjemaelementId: namespace + '-ytterligereInfo'
    } as FeiloppsummeringFeil
    hasErrors = true
  }

  let _error: boolean
  ['primaerkompetanseArt58', 'sekundaerkompetanseArt58', 'primaerkompetanseArt68', 'sekundaerkompetanseArt68'].forEach(vedtaktype => {
    const vedtaksperioder: Array<VedtakPeriode> | undefined = _.get(vedtak, vedtaktype)
    vedtaksperioder?.forEach((vp: VedtakPeriode, index: number) => {
      _error = validateVedtakVedtaksperiode(v, t, {
        vedtaksperiode: vp,
        vedtaksperioder: vedtaksperioder,
        vedtaktype: vedtaktype,
        index,
        namespace,
        formalName: formalName
      })
      hasErrors = hasErrors || _error
    })
  })

  if (hasErrors) {
    const namespaceBits = namespace.split('-')
    const mainNamespace = namespaceBits[0]
    const formaalNamespace = mainNamespace + '-' + namespaceBits[1]
    v[mainNamespace] = { feilmelding: 'notnull', skjemaelementId: '' } as FeiloppsummeringFeil
    v[formaalNamespace] = { feilmelding: 'notnull', skjemaelementId: '' } as FeiloppsummeringFeil
  }
  return hasErrors
}
