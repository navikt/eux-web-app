import { validatePeriode } from 'components/Forms/validation'
import {Periode, VedtakF003} from 'declarations/sed'
import { Validation } from 'declarations/types'
import { getIdx } from 'utils/namespace'
import {
  checkIfDuplicate,
  checkIfNotEmpty,
  checkLength
} from 'utils/validation'

export interface ValidationVedtakPeriodeProps {
  periode: Periode | undefined
  perioder: Array<Periode> | undefined
  index?: number
  formalName?: string
}

export interface ValidationVedtakProps {
  vedtak: VedtakF003 | undefined
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

  if(vedtak?.gjelderAlleBarn && vedtak?.gjelderAlleBarn === "nei"){
    hasErrors.push(checkIfNotEmpty(v, {
      needle: vedtak?.barnVedtaketOmfatter,
      id: namespace + '-barnVedtaketOmfatter',
      message: 'validation:noBarnValgt',
      personName: formalName
    }))
  }

  vedtak?.vedtaksperioder?.forEach((vedtaksperioder, index) => {
    hasErrors.push(validateVedtakPeriode(v, namespace, { periode: vedtaksperioder, perioder: vedtak.vedtaksperioder, index, formalName }))
  })

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

  return hasErrors.find(value => value) !== undefined
}
