import { validatePeriode } from 'components/Forms/validation'
import {
  ForsikringPeriode,
  Periode,
  PeriodeAnnenForsikring,
  PeriodeMedForsikring, PeriodeUtenForsikring
} from 'declarations/sed'
import { Validation } from 'declarations/types'
import _ from 'lodash'
import { ErrorElement } from 'declarations/app.d'
import { TFunction } from 'react-i18next'
import { getIdx } from 'utils/namespace'
import { validateAdresse } from '../Adresser/validation'
import { validateInntektOgTimer } from './InntektOgTimer/validation'

export interface ValidationForsikringPeriodeProps {
  periode: ForsikringPeriode
  type: string | undefined
  index?: number
  namespace: string
  personName: string
}

interface ValidateForsikringPerioderProps {
  perioder: Array<ForsikringPeriode> |undefined
  type: string
  namespace: string
  personName: string
}

interface ValidateAlleForsikringPerioderProps {
  perioder: {[k in string]: Array<ForsikringPeriode> | undefined}
  namespace: string
  personName: string
}

export const validateForsikringPeriode = (
  v: Validation,
  t: TFunction,
  {
    periode,
    type,
    index,
    namespace,
    personName
  }: ValidationForsikringPeriodeProps
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

  if (type === 'perioderAnnenForsikring') {
    if (_.isEmpty((periode as PeriodeAnnenForsikring)?.annenTypeForsikringsperiode?.trim())) {
      v[namespace + idx + '-annenTypeForsikringsperiode'] = {
        feilmelding: t('validation:noAnnenTypeForsikringsperiode'),
        skjemaelementId: namespace + idx + '-annenTypeForsikringsperiode'
      } as ErrorElement
      hasErrors = true
    }
  }

  if (type && ['perioderAnsattMedForsikring', 'perioderSelvstendigMedForsikring', 'perioderAnsattUtenForsikring', 'perioderSelvstendigUtenForsikring']
    .indexOf(type) >= 0) {
    const _error: boolean = validateAdresse(v, t, {
      adresse: (periode as PeriodeMedForsikring)?.arbeidsgiver?.adresse,
      namespace: namespace + idx + '-arbeidsgiver-adresse',
      personName: (periode as PeriodeMedForsikring)?.arbeidsgiver?.navn ?? personName
    })
    hasErrors = hasErrors || _error

    if (_.isEmpty((periode as PeriodeMedForsikring)?.arbeidsgiver?.navn)) {
      v[namespace + idx + '-arbeidsgiver-navn'] = {
        feilmelding: t('validation:noInstitusjonensNavnTil', { person: personName }),
        skjemaelementId: namespace + idx + '-arbeidsgiver-navn'
      } as ErrorElement
      hasErrors = true
    }

    if (_.isEmpty((periode as PeriodeMedForsikring)?.arbeidsgiver?.identifikatorer)) {
      v[namespace + idx + '-arbeidsgiver-identifikatorer'] = {
        feilmelding: t('validation:noOrgnrTil', { person: personName }),
        skjemaelementId: namespace + idx + '-arbeidsgiver-identifikatorer'
      } as ErrorElement
      hasErrors = true
    }
  }

  if (type && ['perioderAnsattUtenForsikring', 'perioderSelvstendigUtenForsikring'].indexOf(type) >= 0) {
    const _error = validateInntektOgTimer(v, t, {
      inntektOgTimer: (periode as PeriodeUtenForsikring)?.inntektOgTimer,
      namespace: namespace + idx + '-inntektOgTimer',
      personName
    })
    hasErrors = hasErrors || _error

    if (_.isEmpty((periode as PeriodeUtenForsikring)?.inntektOgTimerInfo)) {
      v[namespace + idx + '-inntektOgTimerInfo'] = {
        feilmelding: t('validation:noInntektInfoTil', { person: personName }),
        skjemaelementId: namespace + idx + '-inntektOgTimerInfo'
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

export const validateForsikringPerioder = (
  validation: Validation,
  t: TFunction,
  {
    type,
    perioder,
    namespace,
    personName
  }: ValidateForsikringPerioderProps
): boolean => {
  let hasErrors: boolean = false
  perioder?.forEach((periode: Periode, index: number) => {
    const _errors: boolean = validateForsikringPeriode(validation, t, {
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

export const validateAlleForsikringPerioder = (
  v: Validation,
  t: TFunction,
  {
    perioder,
    namespace,
    personName
  } : ValidateAlleForsikringPerioderProps
): boolean => {
  let hasErrors: boolean = false
  let _error: boolean
  _error = validateForsikringPerioder(v, t, { type: 'perioderAnsattMedForsikring', perioder: perioder.perioderAnsattMedForsikring, namespace, personName })
  hasErrors = hasErrors || _error
  _error = validateForsikringPerioder(v, t, { type: 'perioderSelvstendigMedForsikring', perioder: perioder.perioderSelvstendigMedForsikring, namespace, personName })
  hasErrors = hasErrors || _error
  _error = validateForsikringPerioder(v, t, { type: 'perioderAnsattUtenForsikring', perioder: perioder.perioderAnsattUtenForsikring, namespace, personName })
  hasErrors = hasErrors || _error
  _error = validateForsikringPerioder(v, t, { type: 'perioderSelvstendigUtenForsikring', perioder: perioder.perioderSelvstendigUtenForsikring, namespace, personName })
  hasErrors = hasErrors || _error
  _error = validateForsikringPerioder(v, t, { type: 'perioderSyk', perioder: perioder.perioderSyk, namespace, personName })
  hasErrors = hasErrors || _error
  _error = validateForsikringPerioder(v, t, { type: 'perioderSvangerskapBarn', perioder: perioder.perioderSvangerskapBarn, namespace, personName })
  hasErrors = hasErrors || _error
  _error = validateForsikringPerioder(v, t, { type: 'perioderUtdanning', perioder: perioder.perioderUtdanning, namespace, personName })
  hasErrors = hasErrors || _error
  _error = validateForsikringPerioder(v, t, { type: 'perioderMilitaertjeneste', perioder: perioder.perioderMilitaertjeneste, namespace, personName })
  hasErrors = hasErrors || _error
  _error = validateForsikringPerioder(v, t, { type: 'perioderFrihetsberoevet', perioder: perioder.perioderFrihetsberoevet, namespace, personName })
  hasErrors = hasErrors || _error
  _error = validateForsikringPerioder(v, t, { type: 'perioderFrivilligForsikring', perioder: perioder.perioderFrivilligForsikring, namespace, personName })
  hasErrors = hasErrors || _error
  _error = validateForsikringPerioder(v, t, { type: 'perioderKompensertFerie', perioder: perioder.perioderKompensertFerie, namespace, personName })
  hasErrors = hasErrors || _error
  _error = validateForsikringPerioder(v, t, { type: 'perioderAnnenForsikring', perioder: perioder.perioderAnnenForsikring, namespace, personName })
  hasErrors = hasErrors || _error
  return hasErrors
}
