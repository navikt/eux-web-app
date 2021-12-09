import { validatePeriode } from 'components/Forms/validation'
import {
  PDPeriode, PeriodeMedAktivitetstype, PeriodeMedBegrunnelse, PeriodeMedLoenn, PeriodeMedType
} from 'declarations/pd.d'
import { Validation } from 'declarations/types'
import _ from 'lodash'
import { ErrorElement } from 'declarations/app.d'
import { TFunction } from 'react-i18next'
import { getIdx } from 'utils/namespace'

export interface ValidationPDPeriodeProps {
  periode: PDPeriode
  type: string | undefined
  index?: number
  namespace: string
  personName: string
}

export interface ValidatePDPerioderProps {
  perioder: Array<PDPeriode> |undefined
  type: string
  namespace: string
  personName: string
}

export interface ValidateAllePDPerioderProps {
  perioder: {[k in string]: Array<PDPeriode> | undefined}
  namespace: string
  personName: string
}

export const validatePDPeriode = (
  v: Validation,
  t: TFunction,
  {
    periode,
    type,
    index,
    namespace,
    personName
  }: ValidationPDPeriodeProps
): boolean => {
  const idx = getIdx(index)
  let hasErrors

  if (_.isNil(index) && _.isEmpty(type)) {
    v[namespace + '-type'] = {
      skjemaelementId: namespace + '-type',
      feilmelding: t('validation:noType')
    } as ErrorElement
    hasErrors = true
  }

  const _error: boolean = validatePeriode(v, t, {
    periode,
    namespace: namespace + idx,
    personName
  })
  hasErrors = hasErrors || _error

  if (type === 'perioderAndreForsikringer') {
    if (_.isEmpty((periode as PeriodeMedType)?.type?.trim())) {
      v[namespace + idx + '-type'] = {
        feilmelding: t('validation:noType'),
        skjemaelementId: namespace + idx + '-type'
      } as ErrorElement
      hasErrors = true
    }
  }

  if (type === 'perioderAnsettSomForsikret') {
    if (_.isEmpty((periode as PeriodeMedBegrunnelse)?.begrunnelse?.trim())) {
      v[namespace + idx + '-begrunnelse'] = {
        feilmelding: t('validation:noBegrunnelse'),
        skjemaelementId: namespace + idx + '-begrunnelse'
      } as ErrorElement
      hasErrors = true
    }
  }

  if (type === 'perioderAnsattUtenForsikring' || type == 'perioderSelvstendigUtenForsikring') {
    if (_.isEmpty((periode as PeriodeMedAktivitetstype)?.aktivitetstype?.trim())) {
      v[namespace + idx + '-aktivitetstype'] = {
        feilmelding: t('validation:noAktivitetstype'),
        skjemaelementId: namespace + idx + '-aktivitetstype'
      } as ErrorElement
      hasErrors = true
    }
  }

  if (type === 'perioderLoennSomAnsatt' || type == 'perioderInntektSomSelvstendig') {
    if (_.isEmpty((periode as PeriodeMedLoenn)?.loenn?.trim())) {
      v[namespace + idx + '-loenn'] = {
        feilmelding: t('validation:noLoenn'),
        skjemaelementId: namespace + idx + '-loenn'
      } as ErrorElement
      hasErrors = true
    }
  }

  if (hasErrors) {
    const namespaceBits = namespace.split('-')
    const mainNamespace = namespaceBits[0]
    const personNamespace = mainNamespace + '-' + namespaceBits[1]
    let categoryNamespace = personNamespace + '-' + namespaceBits[2]
    // clean up category names, like forsikring[periodeSyk][1] to forsikring
    if (categoryNamespace.indexOf('[') >= 0) {
      categoryNamespace = categoryNamespace.substring(0, categoryNamespace.indexOf('['))
    }
    v[mainNamespace] = { feilmelding: 'notnull', skjemaelementId: '' } as ErrorElement
    v[personNamespace] = { feilmelding: 'notnull', skjemaelementId: '' } as ErrorElement
    v[categoryNamespace] = { feilmelding: 'notnull', skjemaelementId: '' } as ErrorElement
  }
  return hasErrors
}

export const validatePDPerioder = (
  validation: Validation,
  t: TFunction,
  {
    type,
    perioder,
    namespace,
    personName
  }: ValidatePDPerioderProps
): boolean => {
  let hasErrors: boolean = false
  perioder?.forEach((periode: PDPeriode, index: number) => {
    const _errors: boolean = validatePDPeriode(validation, t, {
      periode: periode,
      type,
      index,
      namespace: namespace + '[' + type + ']',
      personName
    })
    hasErrors = hasErrors || _errors
  })
  return hasErrors
}

export const validateAllePDPerioder = (
  v: Validation,
  t: TFunction,
  {
    perioder,
    namespace,
    personName
  } : ValidateAllePDPerioderProps
): boolean => {
  let hasErrors: boolean = false
  let _error: boolean
  _error = validatePDPerioder(v, t, { type: 'perioderAnsattMedForsikring', perioder: perioder.perioderAnsattMedForsikring, namespace, personName })
  hasErrors = hasErrors || _error
  _error = validatePDPerioder(v, t, { type: 'perioderSelvstendigMedForsikring', perioder: perioder.perioderSelvstendigMedForsikring, namespace, personName })
  hasErrors = hasErrors || _error
  _error = validatePDPerioder(v, t, { type: 'perioderAndreForsikringer', perioder: perioder.perioderAndreForsikringer, namespace, personName })
  hasErrors = hasErrors || _error
  _error = validatePDPerioder(v, t, { type: 'perioderAnsettSomForsikret', perioder: perioder.perioderAnsettSomForsikret, namespace, personName })
  hasErrors = hasErrors || _error
  _error = validatePDPerioder(v, t, { type: 'perioderAnsattUtenForsikring', perioder: perioder.perioderAnsattUtenForsikring, namespace, personName })
  hasErrors = hasErrors || _error
  _error = validatePDPerioder(v, t, { type: 'perioderSelvstendigUtenForsikring', perioder: perioder.perioderSelvstendigUtenForsikring, namespace, personName })
  hasErrors = hasErrors || _error
  _error = validatePDPerioder(v, t, { type: 'perioderLoennSomAnsatt', perioder: perioder.perioderLoennSomAnsatt, namespace, personName })
  hasErrors = hasErrors || _error
  _error = validatePDPerioder(v, t, { type: 'perioderInntektSomSelvstendig', perioder: perioder.perioderInntektSomSelvstendig, namespace, personName })
  hasErrors = hasErrors || _error
  return hasErrors
}
