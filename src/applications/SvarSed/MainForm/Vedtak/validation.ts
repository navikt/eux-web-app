import { validatePeriode } from 'components/Forms/validation'
import { Vedtak, VedtakPeriode, Periode } from 'declarations/sed'
import { Validation } from 'declarations/types'
import _ from 'lodash'
import { ErrorElement } from 'declarations/app.d'
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
      periode,
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
        feilmelding: t('validation:duplicateStartdato') + (formalName ? t('validation:til-person', { person: formalName }) : ''),
        skjemaelementId: namespace + '-perioder' + idx + '-startdato'
      } as ErrorElement
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
        feilmelding: t('validation:duplicateStartdato') + (formalName ? t('validation:til-person', { person: formalName }) : ''),
        skjemaelementId: namespace + '-vedtaksperioder' + idx + '-periode-startdato'
      } as ErrorElement
      hasErrors = true
    }
  }

  if (_.isEmpty(vedtaksperiode?.skalYtelseUtbetales?.trim())) {
    v[namespace + '-vedtaksperioder' + idx + '-skalYtelseUtbetales'] = {
      feilmelding: t('validation:noSkalYtelseUtbetales') + (formalName ? t('validation:til-person', { person: formalName }) : ''),
      skjemaelementId: namespace + '-vedtaksperioder' + idx + '-skalYtelseUtbetales'
    } as ErrorElement
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
      feilmelding: t('validation:noBarnValgt') + (formalName ? t('validation:til-person', { person: formalName }) : ''),
      skjemaelementId: namespace + '-gjelderAlleBarn'
    } as ErrorElement
    hasErrors = true
  }

  vedtak?.vedtaksperioder?.forEach((vedtaksperioder, index) => {
    const _error: boolean = validateVedtakPeriode(v, t, { periode: vedtaksperioder, perioder: vedtak.vedtaksperioder, index, namespace, formalName })
    hasErrors = hasErrors || _error
  })

  if (_.isEmpty(vedtak?.vedtakstype?.trim())) {
    v[namespace + '-vedtakstype'] = {
      feilmelding: t('validation:noVedtakType') + (formalName ? t('validation:til-person', { person: formalName }) : ''),
      skjemaelementId: namespace + '-vedtakstype'
    } as ErrorElement
    hasErrors = true
  }

  if (_.isEmpty(vedtak?.vedtaksdato?.trim())) {
    v[namespace + '-vedtaksdato'] = {
      feilmelding: t('validation:noDate') + (formalName ? t('validation:til-person', { person: formalName }) : ''),
      skjemaelementId: namespace + '-vedtaksdato'
    } as ErrorElement
    hasErrors = true
  } else {
    if (!vedtak?.vedtaksdato?.trim().match(datePattern)) {
      v[namespace + '-vedtaksdato'] = {
        skjemaelementId: namespace + '-vedtaksdato',
        feilmelding: t('validation:invalidDate') + (formalName ? t('validation:til-person', { person: formalName }) : '')
      } as ErrorElement
      hasErrors = true
    }
  }

  if (_.isEmpty(vedtak?.begrunnelse?.trim())) {
    v[namespace + '-begrunnelse'] = {
      feilmelding: t('validation:noBegrunnelse') + (formalName ? t('validation:til-person', { person: formalName }) : ''),
      skjemaelementId: namespace + '-begrunnelse'
    } as ErrorElement
    hasErrors = true
  } else {
    if (vedtak?.begrunnelse?.trim()?.length > 500) {
      v[namespace + '-begrunnelse'] = {
        feilmelding: t('validation:textOverX', { x: 500 }) + (formalName ? t('validation:til-person', { person: formalName }) : ''),
        skjemaelementId: namespace + '-begrunnelse'
      } as ErrorElement
      hasErrors = true
    }
  }

  if (vedtak?.ytterligereInfo?.trim()?.length > 500) {
    v[namespace + '-ytterligereInfo'] = {
      feilmelding: t('validation:textOverX', { x: 500 }) + (formalName ? t('validation:til-person', { person: formalName }) : ''),
      skjemaelementId: namespace + '-ytterligereInfo'
    } as ErrorElement
    hasErrors = true
  }

  let _error: boolean
  ['primaerkompetanseArt58', 'sekundaerkompetanseArt58', 'primaerkompetanseArt68', 'sekundaerkompetanseArt68'].forEach(vedtaktype => {
    const vedtaksperioder: Array<VedtakPeriode> | undefined = _.get(vedtak, vedtaktype)
    vedtaksperioder?.forEach((vp: VedtakPeriode, index: number) => {
      _error = validateVedtakVedtaksperiode(v, t, {
        vedtaksperiode: vp,
        vedtaksperioder,
        vedtaktype,
        index,
        namespace,
        formalName
      })
      hasErrors = hasErrors || _error
    })
  })

  if (hasErrors) {
    const namespaceBits = namespace.split('-')
    const mainNamespace = namespaceBits[0]
    const formaalNamespace = mainNamespace + '-' + namespaceBits[1]
    v[mainNamespace] = { feilmelding: 'notnull', skjemaelementId: '' } as ErrorElement
    v[formaalNamespace] = { feilmelding: 'notnull', skjemaelementId: '' } as ErrorElement
  }
  return hasErrors
}
