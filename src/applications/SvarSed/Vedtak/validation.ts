import { validatePeriode } from 'components/Forms/validation'
import { Vedtak, Periode, KompetansePeriode } from 'declarations/sed'
import { Validation } from 'declarations/types'
import _ from 'lodash'
import { getIdx, getNSIdx } from 'utils/namespace'
import {
  addError,
  checkIfDuplicate,
  checkIfNotDate,
  checkIfNotEmpty,
  checkLength,
  checkValidDateFormat
} from 'utils/validation'

export interface ValidationVedtakPeriodeProps {
  periode: Periode | undefined
  perioder: Array<Periode> | undefined
  index?: number
  formalName?: string
}

export interface ValidationKompetansePeriodeProps {
  kompetanseperiode: KompetansePeriode | undefined
  kompetanseperioder: Array<KompetansePeriode> | undefined
  nsIndex?: string
  formalName?: string
}

export interface ValidationVedtakProps {
  vedtak: Vedtak | undefined
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

  hasErrors.push(validatePeriode(v, namespace + '-vedtaksperioder' + idx, {
    periode,
    personName: formalName
  }))

  hasErrors.push(checkIfDuplicate(v, {
    needle: periode,
    haystack: perioder,
    matchFn: (p: Periode) => p.startdato === periode?.startdato && p.sluttdato === periode?.sluttdato,
    id: namespace + '-vedtaksperioder' + idx + '-startdato',
    message: 'validation:duplicateStartdato',
    index,
    personName: formalName
  }))

  return hasErrors.find(value => value) !== undefined
}

export const validateKompetansePeriode = (
  v: Validation,
  namespace: string,
  {
    kompetanseperiode,
    kompetanseperioder,
    nsIndex,
    formalName
  }:ValidationKompetansePeriodeProps
): boolean => {
  const hasErrors: Array<boolean> = []

  hasErrors.push(validatePeriode(v, namespace + (nsIndex ?? '') + '-periode', {
    periode: kompetanseperiode?.periode,
    personName: formalName
  }))

  let haystack: Array<KompetansePeriode> | undefined

  // check if the item is itself in the list, use a list without it, for proper duplicate check
  if (_.isEmpty(nsIndex)) {
    haystack = kompetanseperioder
  } else {
    haystack = _.reject(kompetanseperioder, (p: KompetansePeriode) =>
      getNSIdx(p.periode.__type, p.periode.__index) === nsIndex)
  }

  const duplicate = _.find(haystack, (p: KompetansePeriode) =>
    p.periode.startdato === kompetanseperiode?.periode.startdato &&
    p.periode.sluttdato === kompetanseperiode?.periode.sluttdato
  ) !== undefined

  if (duplicate) {
    hasErrors.push(addError(v, {
      id: namespace + (nsIndex ?? '') + '-periode-startdato',
      message: 'validation:duplicateStartdato',
      personName: formalName
    }))
  }

  if(kompetanseperiode?.periode.__type === "primaerkompetanseArt68" || kompetanseperiode?.periode.__type === "sekundaerkompetanseArt68"){
    hasErrors.push(checkIfNotEmpty(v, {
      needle: kompetanseperiode?.skalYtelseUtbetales,
      id: namespace + (nsIndex ?? '') + '-skalYtelseUtbetales',
      message: 'validation:noSkalYtelseUtbetales',
      personName: formalName
    }))
  }

  return hasErrors.find(value => value) !== undefined
}

export const validateVedtak = (
  v: Validation,
  namespace: string,
  {
    vedtak,
    formalName
  }: ValidationVedtakProps
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

  hasErrors.push(checkValidDateFormat(v, {
    needle: vedtak?.vedtaksdato,
    id: namespace + '-vedtaksdato',
    message: 'validation:invalidDateFormat',
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
    const kompetanseperioder: Array<KompetansePeriode> | undefined = _.get(vedtak, vedtaktype) as Array<KompetansePeriode> | undefined

    kompetanseperioder?.forEach((vp: KompetansePeriode, index: number) => {
      vp.periode.__type = vedtaktype
      vp.periode.__index = index
      const nsIndex = getNSIdx(vedtaktype, index)
      hasErrors.push(validateKompetansePeriode(v, namespace, {
        kompetanseperiode: vp,
        kompetanseperioder,
        nsIndex,
        formalName
      }))
      delete vp.periode.__index
      delete vp.periode.__type
    })
  })

  return hasErrors.find(value => value) !== undefined
}
