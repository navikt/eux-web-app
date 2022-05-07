import { validatePeriode } from 'components/Forms/validation'
import { PensjonPeriode, Periode } from 'declarations/sed'
import { Validation } from 'declarations/types'
import _ from 'lodash'
import { getIdx } from 'utils/namespace'
import { addError } from 'utils/validation'

export interface ValidationDekkedePeriodeProps {
  periode: Periode | undefined
  type: string | undefined
  index?: number
  personName?: string | undefined
}

export interface ValidateTrygdeordningerProps {
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

export const validateDekkedePeriode = (
  v: Validation,
  namespace: string,
  {
    periode,
    type,
    index,
    personName
  }: ValidationDekkedePeriodeProps
): boolean => {
  const hasErrors: Array<boolean> = []
  const idx = getIdx(index)

  if (_.isNil(index) && _.isEmpty(type)) {
    hasErrors.push(addError(v, {
      id: namespace + '-type',
      message: 'validation:noType',
      personName
    }))
  }

  hasErrors.push(validatePeriode(v, namespace + idx, {
    periode,
    personName
  }))

  return hasErrors.find(value => value) !== undefined
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
  type: string,
  pageCategory: string,
  perioder: Array<Periode | PensjonPeriode>,
  personName?: string
): boolean => {
  const hasErrors: Array<boolean> = []
  perioder?.forEach((periode: Periode | PensjonPeriode, index: number) => {
    if (type === 'perioderMedPensjon') {
      hasErrors.push(validateFamilieytelserPeriode(v, namespace, { periode: (periode as PensjonPeriode), perioder: (perioder as Array<PensjonPeriode>), index, sedCategory: type, personName }))
    } else {
      hasErrors.push(validateDekkedePeriode(v, namespace, { periode: (periode as Periode), type, index, personName }))
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
  hasErrors.push(validatePerioder(v, namespace, 'perioderUtenforTrygdeordning', 'dekkede', perioder.perioderUtenforTrygdeordning, personName))
  hasErrors.push(validatePerioder(v, namespace, 'perioderMedArbeid', 'familieYtelse', perioder.perioderMedArbeid, personName))
  hasErrors.push(validatePerioder(v, namespace, 'perioderMedTrygd', 'familieYtelse', perioder.perioderMedTrygd, personName))
  hasErrors.push(validatePerioder(v, namespace, 'perioderMedYtelser', 'familieYtelse', perioder.perioderMedYtelser, personName))
  hasErrors.push(validatePerioder(v, namespace, 'perioderMedPensjon', 'familieYtelse', perioder.perioderMedPensjon, personName))
  return hasErrors.find(value => value) !== undefined
}
