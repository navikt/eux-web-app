import { validatePeriode } from 'components/Forms/validation'
import { Vedtak, VedtakPeriode, Periode } from 'declarations/sed'
import { Validation } from 'declarations/types'
import _ from 'lodash'
import { getIdx } from 'utils/namespace'
import { checkIfDuplicate, checkIfNotDate, checkIfNotEmpty, checkLength } from 'utils/validation'

export interface ValidationVedtakPeriodeProps {
  periode: Periode
  perioder: Array<Periode>
  index?: number
  formalName?: string
}

export interface ValidationVedtakVedtaksperiodeProps {
  vedtaksperiode: VedtakPeriode
  vedtaksperioder: Array<VedtakPeriode> | undefined
  vedtaktype: string
  index?: number
  formalName?: string
}

export const validateVedtakPeriode = (
  v: Validation,
  namespace: string,
  {
    periode,
    perioder,
    index,
    formalName
  }: ValidationVedtakPeriodeProps
): boolean => {
  const hasErrors: Array<boolean> = []
  const idx = getIdx(index)

  hasErrors.push(validatePeriode(v, namespace + '-perioder' + idx, {
    periode,
    personName: formalName
  }))

  hasErrors.push(checkIfDuplicate(v, {
    needle: periode,
    haystack: perioder,
    matchFn: (p: Periode) => p.startdato === periode?.startdato && p.sluttdato === periode?.sluttdato,
    id: namespace + '-perioder' + idx + '-startdato',
    message: 'validation:duplicateStartdato',
    index,
    personName: formalName
  }))

  return hasErrors.find(value => value) !== undefined
}

export const validateVedtakVedtaksperiode = (
  v: Validation,
  namespace: string,
  {
    vedtaksperiode,
    vedtaksperioder,
    vedtaktype,
    index,
    formalName
  }:ValidationVedtakVedtaksperiodeProps
): boolean => {
  const hasErrors: Array<boolean> = []
  let idx = getIdx(index)

  if (!_.isEmpty(idx)) {
    idx = '-' + vedtaktype + idx
  }
  hasErrors.push(validatePeriode(v, namespace + '-vedtaksperioder' + idx + '-periode', {
    periode: vedtaksperiode?.periode,
    personName: formalName
  }))

  hasErrors.push(checkIfDuplicate(v, {
    needle: vedtaksperiode?.periode,
    haystack: vedtaksperioder,
    matchFn: (p: VedtakPeriode) => p.periode.startdato === vedtaksperiode?.periode?.startdato && p.periode.sluttdato === vedtaksperiode?.periode?.sluttdato,
    id: namespace + '-vedtaksperioder' + idx + '-periode-startdato',
    message: 'validation:duplicateStartdato',
    index,
    personName: formalName
  }))

  hasErrors.push(checkIfNotEmpty(v, {
    needle: vedtaksperiode?.skalYtelseUtbetales,
    id: namespace + '-vedtaksperioder' + idx + '-skalYtelseUtbetales',
    message: 'validation:noSkalYtelseUtbetales',
    personName: formalName
  }))

  return hasErrors.find(value => value) !== undefined
}

interface ValidateVedtakProps {
  vedtak: Vedtak
  formalName: string
}

export const validateVedtak = (
  v: Validation,
  namespace: string,
  {
    vedtak,
    formalName
  }: ValidateVedtakProps
): boolean => {
  const hasErrors: Array<boolean> = []

  hasErrors.push(checkIfNotEmpty(v, {
    needle: vedtak?.gjelderAlleBarn,
    id: namespace + '-gjelderAlleBarn',
    message: 'validation:noBarnValgt',
    personName: formalName
  }))

  vedtak?.vedtaksperioder?.forEach((vedtaksperioder, index) => {
    hasErrors.push(validateVedtakPeriode(v, namespace, { periode: vedtaksperioder, perioder: vedtak.vedtaksperioder, index, formalName }))
  })

  hasErrors.push(checkIfNotEmpty(v, {
    needle: vedtak?.vedtakstype,
    id: namespace + '-vedtakstype',
    message: 'validation:noVedtakType',
    personName: formalName
  }))

  hasErrors.push(checkIfNotEmpty(v, {
    needle: vedtak?.vedtaksdato,
    id: namespace + '-vedtaksdato',
    message: 'validation:noDate',
    personName: formalName
  }))

  hasErrors.push(checkIfNotDate(v, {
    needle: vedtak?.vedtaksdato,
    id: namespace + '-vedtaksdato',
    message: 'validation:invalidDate',
    personName: formalName
  }))

  hasErrors.push(checkIfNotEmpty(v, {
    needle: vedtak?.begrunnelse,
    id: namespace + '-begrunnelse',
    message: 'validation:noBegrunnelse',
    personName: formalName
  }))

  hasErrors.push(checkLength(v, {
    needle: vedtak?.begrunnelse,
    max: 500,
    id: namespace + '-begrunnelse',
    message: 'validation:textOverX',
    personName: formalName
  }))

  hasErrors.push(checkLength(v, {
    needle: vedtak?.ytterligereInfo,
    max: 500,
    id: namespace + '-ytterligereInfo',
    message: 'validation:textOverX',
    personName: formalName
  }));

  ['primaerkompetanseArt58', 'sekundaerkompetanseArt58', 'primaerkompetanseArt68', 'sekundaerkompetanseArt68'].forEach(vedtaktype => {
    const vedtaksperioder: Array<VedtakPeriode> | undefined = _.get(vedtak, vedtaktype) as Array<VedtakPeriode> | undefined
    vedtaksperioder?.forEach((vp: VedtakPeriode, index: number) => {
      hasErrors.push(validateVedtakVedtaksperiode(v, namespace, {
        vedtaksperiode: vp,
        vedtaksperioder,
        vedtaktype,
        index,
        formalName
      }))
    })
  })

  return hasErrors.find(value => value) !== undefined
}
