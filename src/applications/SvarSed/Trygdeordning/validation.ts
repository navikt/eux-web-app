import { validatePeriode } from 'components/Forms/validation'
import { PensjonPeriode, Periode } from 'declarations/sed'
import { Validation } from 'declarations/types'
import _ from 'lodash'
import { getIdx } from 'utils/namespace'
import { addError, checkIfDuplicate } from 'utils/validation'

export interface ValidationDekkedePeriodeProps {
  periode: Periode,
  perioder: Array<Periode>,
  index?: number,
  personName?: string
}

export interface ValidationUdekkedePeriodeProps {
  periode: Periode,
  perioder: Array<Periode>,
  index?: number,
  personName?: string
}

interface ValidateTrygdeordningerProps {
  perioder: {[k in string]: Array<Periode | PensjonPeriode>}
  personName?: string
}

export interface ValidationFamilieytelsePeriodeProps {
  periode: Periode | PensjonPeriode,
  perioder: Array<Periode | PensjonPeriode>
  index?: number,
  sedCategory: string,
  personName?: string
}

const validateGenericPeriode = (
  v: Validation,
  namespace: string,
  {
    periode,
    perioder,
    index,
    personName
  }: ValidationDekkedePeriodeProps,
  pageCategory: string,
  sedCategory: string
): boolean => {
  const hasErrors: Array<boolean> = []
  const idx = getIdx(index)

  const extraNamespace = namespace + '-' + (!_.isNil(index) && index >= 0 ? sedCategory : pageCategory)

  hasErrors.push(validatePeriode(v, extraNamespace, {
    periode,
    index,
    personName
  }))

  hasErrors.push(checkIfDuplicate(v, {
    needle: periode,
    haystack: perioder,
    matchFn: (p: Periode) => p.startdato === periode?.startdato && p.sluttdato === periode?.sluttdato,
    id: namespace + idx + '-startdato',
    message: 'validation:duplicateStartdato',
    personName
  }))

  return hasErrors.find(value => value) !== undefined
}

export const validateDekkedePeriode = (
  v: Validation,
  namespace: string,
  {
    periode,
    perioder,
    index,
    personName
  }: ValidationDekkedePeriodeProps
): boolean => {
  return validateGenericPeriode(v, namespace, {
    periode,
    perioder,
    index,
    personName
  },
  'dekkede', 'perioderMedITrygdeordning')
}

export const validateUdekkedePeriode = (
  v: Validation,
  namespace: string,
  {
    periode,
    perioder,
    index,
    personName
  }: ValidationDekkedePeriodeProps
): boolean => {
  return validateGenericPeriode(v, namespace, {
    periode,
    perioder,
    index,
    personName
  },
  'udekkede', 'perioderUtenforTrygdeordning')
}

export const validateFamilieytelserPeriode = (
  v: Validation,
  namespace: string,
  {
    periode,
    perioder,
    index,
    sedCategory,
    personName
  }: ValidationFamilieytelsePeriodeProps
): boolean => {
  const hasErrors: Array<boolean> = []
  const idx = getIdx(index)

  const extraNamespace = namespace + '-' + (!_.isNil(index) && index >= 0 ? sedCategory : 'familieYtelse') + idx
  let extraperiodeNamespace = extraNamespace
  if (sedCategory === 'perioderMedPensjon' && !_.isNil(index) && index >= 0) {
    extraperiodeNamespace += '-periode'
  }
  const _periode = sedCategory === 'perioderMedPensjon' ? (periode as PensjonPeriode).periode : (periode as Periode)

  hasErrors.push(validatePeriode(v, extraperiodeNamespace, {
    periode: _periode,
    personName
  }))

  let duplicate: boolean
  if (_.isNil(index)) {
    if (sedCategory === 'perioderMedPensjon') {
      duplicate = _.find(perioder, (p: PensjonPeriode) => p.periode.startdato === _periode.startdato && p.periode.sluttdato === _periode.sluttdato) !== undefined
    } else {
      duplicate = _.find(perioder, (p: Periode) => p.startdato === _periode.startdato && p.sluttdato === _periode.sluttdato) !== undefined
    }
  } else {
    if (sedCategory === 'perioderMedPensjon') {
      if (_.isNil(index)) {
        duplicate = _.find(perioder, (p: PensjonPeriode) => p.periode.startdato === _periode?.startdato && p.periode.sluttdato === _periode.sluttdato) !== undefined
      } else {
        const otherPensjonPerioder: Array<PensjonPeriode> = _.filter(perioder, (p, i: number) => i !== index) as Array<PensjonPeriode>
        duplicate = _.find(otherPensjonPerioder, p => p.periode.startdato === _periode.startdato && p.periode.sluttdato === _periode.sluttdato) !== undefined
      }
    } else {
      if (_.isNil(index)) {
        duplicate = _.find(perioder, (p: Periode) => p.startdato === _periode?.startdato && p.sluttdato === _periode?.sluttdato) !== undefined
      } else {
        const otherPensjonPerioder: Array<Periode> = _.filter(perioder, (p, i: number) => i !== index) as Array<Periode>
        duplicate = _.find(otherPensjonPerioder, p => p.startdato === _periode.startdato && p.sluttdato === _periode.sluttdato) !== undefined
      }
    }
  }
  if (duplicate) {
    hasErrors.push(addError(v, {
      id: extraperiodeNamespace + '-startdato',
      message: 'validation:duplicateStartdato',
      personName
    }))
  }

  if (sedCategory === 'perioderMedPensjon') {
    if (_.isEmpty((periode as PensjonPeriode).pensjonstype)) {
      hasErrors.push(addError(v, {
        id: extraNamespace + '-pensjonstype',
        message: 'validation:noPensjonType',
        personName
      }))
    }
  }
  return hasErrors.find(value => value) !== undefined
}

export const validatePerioder = (
  v: Validation,
  namespace: string,
  sedCategory: string,
  pageCategory: string,
  perioder: Array<Periode | PensjonPeriode>,
  personName?: string
): boolean => {
  const hasErrors: Array<boolean> = []
  perioder?.forEach((periode: Periode | PensjonPeriode, index: number) => {
    if (sedCategory === 'perioderMedPensjon') {
      hasErrors.push(validateFamilieytelserPeriode(v, namespace, { periode: (periode as PensjonPeriode), perioder: (perioder as Array<PensjonPeriode>), index, sedCategory, personName }))
    } else {
      hasErrors.push(validateGenericPeriode(v, namespace, { periode: (periode as Periode), perioder: (perioder as Array<Periode>), index, personName }, pageCategory, sedCategory))
    }
  })
  return hasErrors.find(value => value) !== undefined
}

export const validateTrygdeordninger = (
  v: Validation,
  namespace: string,
  {
    perioder,
    personName
  } : ValidateTrygdeordningerProps
): boolean => {
  const hasErrors: Array<boolean> = []
  hasErrors.push(validatePerioder(v, namespace, 'perioderMedITrygdeordning', 'dekkede', perioder.perioderMedITrygdeordning, personName))
  hasErrors.push(validatePerioder(v, namespace, 'perioderUtenforTrygdeordning', 'udekkede', perioder.perioderUtenforTrygdeordning, personName))
  hasErrors.push(validatePerioder(v, namespace, 'perioderMedArbeid', 'familieYtelse', perioder.perioderMedArbeid, personName))
  hasErrors.push(validatePerioder(v, namespace, 'perioderMedTrygd', 'familieYtelse', perioder.perioderMedTrygd, personName))
  hasErrors.push(validatePerioder(v, namespace, 'perioderMedYtelser', 'familieYtelse', perioder.perioderMedYtelser, personName))
  hasErrors.push(validatePerioder(v, namespace, 'perioderMedPensjon', 'familieYtelse', perioder.perioderMedPensjon, personName))
  return hasErrors.find(value => value) !== undefined
}
