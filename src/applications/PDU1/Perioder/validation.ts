import {
  PDPeriode, PDU1
} from 'declarations/pd.d'
import { Validation } from 'declarations/types'
import { getIdx } from 'utils/namespace'
import { addError, checkIfNotEmpty } from 'utils/validation'
import i18n from 'i18n'

export interface ValidationPDPeriodeProps {
  periode: PDPeriode
  type: string | undefined
  index?: number
}

export interface ValidatePDPerioderProps {
  perioder: Array<PDPeriode> |undefined
  type: string
}

export interface ValidateAllePDPerioderProps {
  pdu1: PDU1
}

export const validatePDPeriode = (
  v: Validation,
  namespace: string,
  {
    periode,
    type,
    index
  }: ValidationPDPeriodeProps
): boolean => {
  const idx = getIdx(index)
  const hasErrors: Array<boolean> = []

  if (index === undefined) {
    hasErrors.push(checkIfNotEmpty(v, {
      needle: type,
      id: namespace + '-type',
      message: 'validation:noType'
    }))
  }

  hasErrors.push(checkIfNotEmpty(v, {
    needle: periode?.startdato,
    id: namespace + idx + '-startdato',
    message: 'validation:noStartdato'
  }))

  return hasErrors.find(value => value) !== undefined
}

export const validatePDPerioder = (
  validation: Validation,
  namespace: string,
  {
    type,
    perioder
  }: ValidatePDPerioderProps
): boolean => {
  const hasErrors: Array<boolean> = perioder?.map((periode: PDPeriode, index: number) =>
    validatePDPeriode(validation, namespace + '[' + type + ']', {
      periode,
      type,
      index
    })) ?? []

  let max: number = 0
  switch (type) {
    case 'perioderAnsattMedForsikring':
      max = 20
      break
    case 'perioderSelvstendigMedForsikring':
      max = 13
      break
    case 'perioderAndreForsikringer':
      max = 7
      break
    case 'perioderAnsettSomForsikret':
    case 'perioderAnsattUtenForsikring' :
      max = 3
      break
    case 'perioderSelvstendigUtenForsikring':
      max = 5
      break
    case 'perioderLoennSomAnsatt':
    case 'perioderInntektSomSelvstendig':
      max = 30
      break
    default:
      break
  }

  if (perioder && perioder.length > max) {
    addError(validation, {
      id: namespace + '-generic',
      message: 'validation:tooManyPeriodsMaxIs',
      extra: {
        type: i18n.t('el:option-perioder-' + type),
        max: '' + max
      }
    })
    hasErrors.push(true)
  }

  return hasErrors.find(value => value) !== undefined
}

export const validateAllePDPerioder = (
  v: Validation,
  namespace: string,
  {
    pdu1
  } : ValidateAllePDPerioderProps
): boolean => {
  const hasErrors: Array<boolean> = []
  hasErrors.push(validatePDPerioder(v, namespace, { type: 'perioderAnsattMedForsikring', perioder: pdu1.perioderAnsattMedForsikring }))
  hasErrors.push(validatePDPerioder(v, namespace, { type: 'perioderSelvstendigMedForsikring', perioder: pdu1.perioderSelvstendigMedForsikring }))
  hasErrors.push(validatePDPerioder(v, namespace, { type: 'perioderAndreForsikringer', perioder: pdu1.perioderAndreForsikringer }))
  hasErrors.push(validatePDPerioder(v, namespace, { type: 'perioderAnsettSomForsikret', perioder: pdu1.perioderAnsettSomForsikret }))
  hasErrors.push(validatePDPerioder(v, namespace, { type: 'perioderAnsattUtenForsikring', perioder: pdu1.perioderAnsattUtenForsikring }))
  hasErrors.push(validatePDPerioder(v, namespace, { type: 'perioderSelvstendigUtenForsikring', perioder: pdu1.perioderSelvstendigUtenForsikring }))
  hasErrors.push(validatePDPerioder(v, namespace, { type: 'perioderLoennSomAnsatt', perioder: pdu1.perioderLoennSomAnsatt }))
  hasErrors.push(validatePDPerioder(v, namespace, { type: 'perioderInntektSomSelvstendig', perioder: pdu1.perioderInntektSomSelvstendig }))
  return hasErrors.find(value => value) !== undefined
}
