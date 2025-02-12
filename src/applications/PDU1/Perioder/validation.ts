import { PDPeriode, PDU1 } from 'declarations/pd.d'
import { Validation } from 'declarations/types'
import i18n from 'i18n'
import { getNSIdx } from 'utils/namespace'
import { addError, checkIfNotEmpty } from 'utils/validation'

export interface ValidationPDPeriodeProps {
  periode: PDPeriode | undefined
  nsIndex?: string
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
    nsIndex
  }: ValidationPDPeriodeProps
): boolean => {
  const hasErrors: Array<boolean> = []

  hasErrors.push(checkIfNotEmpty(v, {
    needle: periode?.__type,
    id: namespace + (nsIndex ?? '') + '-type',
    message: 'validation:noType'
  }))

  hasErrors.push(checkIfNotEmpty(v, {
    needle: periode?.startdato,
    id: namespace + (nsIndex ?? '') + '-startdato',
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
  const hasErrors: Array<boolean> = []
  perioder?.forEach((periode: PDPeriode, index: number) => {
    if (!Object.prototype.hasOwnProperty.call(periode, '__type')) {
      periode.__type = type
      periode.__index = index
    }

    hasErrors.push(validatePDPeriode(validation, namespace, {
      periode,
      nsIndex: getNSIdx(periode.__type, periode.__index)
    }))

    delete periode.__type
    delete periode.__index
  })

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
