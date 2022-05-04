import {
  PDPeriode, PDU1
} from 'declarations/pd.d'
import { Validation } from 'declarations/types'
import { getIdx } from 'utils/namespace'
import { addError, checkIfNotEmpty } from 'utils/validation'

export interface ValidationPDPeriodeProps {
  periode: PDPeriode
  type: string | undefined
  index?: number
  namespace: string
}

export interface ValidatePDPerioderProps {
  perioder: Array<PDPeriode> |undefined
  type: string
  namespace: string
}

export interface ValidateAllePDPerioderProps {
  pdu1: PDU1
  namespace: string
}

export const validatePDPeriode = (
  v: Validation,
  {
    periode,
    type,
    index,
    namespace
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
  {
    type,
    perioder,
    namespace
  }: ValidatePDPerioderProps
): boolean => {
  const hasErrors: Array<boolean> = perioder?.map((periode: PDPeriode, index: number) =>
    validatePDPeriode(validation, {
      periode,
      type,
      index,
      namespace: namespace + '[' + type + ']'
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
        type: t('el:option-perioder-' + type),
        max: '' + max
      }
    })
    hasErrors.push(true)
  }

  return hasErrors.find(value => value) !== undefined
}

export const validateAllePDPerioder = (
  v: Validation,
  {
    pdu1,
    namespace
  } : ValidateAllePDPerioderProps
): boolean => {
  const hasErrors: Array<boolean> = []
  hasErrors.push(validatePDPerioder(v, { type: 'perioderAnsattMedForsikring', perioder: pdu1.perioderAnsattMedForsikring, namespace }))
  hasErrors.push(validatePDPerioder(v, { type: 'perioderSelvstendigMedForsikring', perioder: pdu1.perioderSelvstendigMedForsikring, namespace }))
  hasErrors.push(validatePDPerioder(v, { type: 'perioderAndreForsikringer', perioder: pdu1.perioderAndreForsikringer, namespace }))
  hasErrors.push(validatePDPerioder(v, { type: 'perioderAnsettSomForsikret', perioder: pdu1.perioderAnsettSomForsikret, namespace }))
  hasErrors.push(validatePDPerioder(v, { type: 'perioderAnsattUtenForsikring', perioder: pdu1.perioderAnsattUtenForsikring, namespace }))
  hasErrors.push(validatePDPerioder(v, { type: 'perioderSelvstendigUtenForsikring', perioder: pdu1.perioderSelvstendigUtenForsikring, namespace }))
  hasErrors.push(validatePDPerioder(v, { type: 'perioderLoennSomAnsatt', perioder: pdu1.perioderLoennSomAnsatt, namespace }))
  hasErrors.push(validatePDPerioder(v, { type: 'perioderInntektSomSelvstendig', perioder: pdu1.perioderInntektSomSelvstendig, namespace }))
  return hasErrors.find(value => value) !== undefined
}
