import {
  PDPeriode, PeriodeMedAktivitetstype, PeriodeMedBegrunnelse,
  PeriodeMedInntekt, PeriodeMedLoenn, PeriodeMedType, ReplyPdu1
} from 'declarations/pd.d'
import { Validation } from 'declarations/types'
import { TFunction } from 'react-i18next'
import { getIdx } from 'utils/namespace'
import { addError, checkIfNotEmpty, propagateError } from 'utils/validation'

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
  replyPdu1: ReplyPdu1
  namespace: string
}

export const validatePDPeriode = (
  v: Validation,
  t: TFunction,
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

  if (type === 'perioderAndreForsikringer') {
    hasErrors.push(checkIfNotEmpty(v, {
      needle: (periode as PeriodeMedType)?.type,
      id: namespace + idx + '-type',
      message: 'validation:noType'
    }))
  }

  if (type === 'perioderAnsettSomForsikret') {
    hasErrors.push(checkIfNotEmpty(v, {
      needle: (periode as PeriodeMedBegrunnelse)?.begrunnelse,
      id: namespace + idx + '-begrunnelse',
      message: 'validation:noBegrunnelse'
    }))
  }

  if (type === 'perioderAnsattUtenForsikring' || type === 'perioderSelvstendigUtenForsikring') {
    hasErrors.push(checkIfNotEmpty(v, {
      needle: (periode as PeriodeMedAktivitetstype)?.aktivitetstype,
      id: namespace + idx + '-aktivitetstype',
      message: 'validation:noAktivitetstype'
    }))
  }

  if (type === 'perioderLoennSomAnsatt') {
    hasErrors.push(checkIfNotEmpty(v, {
      needle: (periode as PeriodeMedLoenn)?.loenn,
      id: namespace + idx + '-loenn',
      message: 'validation:noLoenn'
    }))
  }

  if (type === 'perioderInntektSomSelvstendig') {
    hasErrors.push(checkIfNotEmpty(v, {
      needle: (periode as PeriodeMedInntekt)?.inntekt,
      id: namespace + idx + '-inntekt',
      message: 'validation:noInntekt'
    }))
  }


  const hasError: boolean = hasErrors.find(value => value) !== undefined
  if (hasError) propagateError(v, namespace)
  return hasError
}

export const validatePDPerioder = (
  validation: Validation,
  t: TFunction,
  {
    type,
    perioder,
    namespace
  }: ValidatePDPerioderProps
): boolean => {
  const hasErrors: Array<boolean> = perioder?.map((periode: PDPeriode, index: number) =>
    validatePDPeriode(validation, t, {
      periode: periode,
      type,
      index,
      namespace: namespace + '[' + type + ']'
    })) ?? []

  if (type === 'perioderAnsattMedForsikring' || type === 'perioderSelvstendigMedForsikring') {
    if (perioder && perioder.length > 7) {
      addError(validation, {
        id: namespace + '-generic',
        message: 'validation:tooManyPeriodsMaxIs',
        extra: {
          type: t('el:option-perioder-' + type),
          max: '7'
        }
      })
      hasErrors.push(true)
    }
  } else {
    if (perioder && perioder.length > 3) {
      addError(validation, {
        id: namespace + '-generic',
        message: 'validation:tooManyPeriodsMaxIs',
        extra: {
          type: t('el:option-perioder-' + type),
          max: '3'
        }
      })
      hasErrors.push(true)
    }
  }

  if (type === 'perioderAnsattMedForsikring' || type === 'perioderSelvstendigMedForsikring') {
    if (perioder && perioder.length > 7) {
      addError(validation, {
        id: namespace + '-generic',
        message: 'validation:tooManyPeriodsMaxIs',
        extra: {
          type: t('el:option-perioder-' + type),
          max: '7'
        }
      })
      hasErrors.push(true)
    }
  }

  return hasErrors.find(value => value) !== undefined
}

export const validateAllePDPerioder = (
  v: Validation,
  t: TFunction,
  {
    replyPdu1,
    namespace
  } : ValidateAllePDPerioderProps
): boolean => {
  const hasErrors: Array<boolean> = []
  hasErrors.push(validatePDPerioder(v, t, { type: 'perioderAnsattMedForsikring', perioder: replyPdu1.perioderAnsattMedForsikring, namespace: namespace }))
  hasErrors.push(validatePDPerioder(v, t, { type: 'perioderSelvstendigMedForsikring', perioder: replyPdu1.perioderSelvstendigMedForsikring, namespace }))
  hasErrors.push(validatePDPerioder(v, t, { type: 'perioderAndreForsikringer', perioder: replyPdu1.perioderAndreForsikringer, namespace }))
  hasErrors.push(validatePDPerioder(v, t, { type: 'perioderAnsettSomForsikret', perioder: replyPdu1.perioderAnsettSomForsikret, namespace }))
  hasErrors.push(validatePDPerioder(v, t, { type: 'perioderAnsattUtenForsikring', perioder: replyPdu1.perioderAnsattUtenForsikring, namespace }))
  hasErrors.push(validatePDPerioder(v, t, { type: 'perioderSelvstendigUtenForsikring', perioder: replyPdu1.perioderSelvstendigUtenForsikring, namespace }))
  hasErrors.push(validatePDPerioder(v, t, { type: 'perioderLoennSomAnsatt', perioder: replyPdu1.perioderLoennSomAnsatt, namespace }))
  hasErrors.push(validatePDPerioder(v, t, { type: 'perioderInntektSomSelvstendig', perioder: replyPdu1.perioderInntektSomSelvstendig, namespace }))
  return hasErrors.find(value => value) !== undefined
}
