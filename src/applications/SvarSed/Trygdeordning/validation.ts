import { validatePeriode } from 'components/Forms/validation'
import { PensjonPeriode, Periode, ReplySed } from 'declarations/sed'
import { Validation } from 'declarations/types'
import _ from 'lodash'
import { getNSIdx } from 'utils/namespace'
import { addError, checkIfNotEmpty } from 'utils/validation'

export interface ValidationDekkedePeriodeProps {
  periode: Periode | undefined
  perioder: Array<Periode> | undefined
  nsIndex?: string
  personName?: string | undefined
}

export interface ValidateTrygdeordningerProps {
  replySed: ReplySed
  personID: string
  personName: string | undefined
}

export interface ValidationFamilieytelsePeriodeProps {
  periode: Periode | PensjonPeriode | undefined,
  perioder: Array<Periode | PensjonPeriode> | undefined
  nsIndex?: string,
  personName?: string
}

export const validateDekkedePeriode = (
  v: Validation,
  namespace: string,
  {
    periode,
    perioder,
    nsIndex,
    personName
  }: ValidationDekkedePeriodeProps
): boolean => {
  const hasErrors: Array<boolean> = []

  hasErrors.push(checkIfNotEmpty(v, {
    needle: periode?.__type,
    id: namespace + (nsIndex ?? '') + '-type',
    message: 'validation:noType',
    personName
  }))

  hasErrors.push(validatePeriode(v, namespace + (nsIndex ?? ''), {
    periode,
    personName
  }))

  let haystack: Array<Periode> | undefined

  // check if the item is itself in the list, use a list without it, for proper duplicate check
  if (_.isEmpty(nsIndex)) {
    haystack = perioder
  } else {
    haystack = _.filter(perioder, (p: Periode) => {
      return getNSIdx(p.__type, p.__index) !== nsIndex
    })
  }

  const duplicate = _.find(haystack, (p: Periode) => {
    return p.startdato === periode?.startdato && p.sluttdato === periode?.sluttdato
  }) !== undefined

  if (duplicate) {
    hasErrors.push(addError(v, {
      id: namespace + (nsIndex ?? '') + '-startdato',
      message: 'validation:duplicateStartdato',
      personName
    }))
  }

  return hasErrors.find(value => value) !== undefined
}

export const validateFamilieytelserPeriode = (
  v: Validation,
  namespace: string,
  {
    periode,
    perioder,
    nsIndex,
    personName
  }: ValidationFamilieytelsePeriodeProps
): boolean => {
  const hasErrors: Array<boolean> = []

  const isPensjonPeriode = (p: Periode | PensjonPeriode | null | undefined): boolean => (
    p
      ? Object.prototype.hasOwnProperty.call(p, 'periode') || Object.prototype.hasOwnProperty.call(p, 'pensjonstype')
      : false
  )

  const _periode: Periode = isPensjonPeriode(periode)
    ? (periode as PensjonPeriode).periode
    : (periode as Periode)

  hasErrors.push(checkIfNotEmpty(v, {
    needle: _periode?.__type,
    id: namespace + (nsIndex ?? '') + '-type',
    message: 'validation:noType',
    personName
  }))

  if (_periode?.__type === 'perioderMedPensjon') {
    hasErrors.push(checkIfNotEmpty(v, {
      needle: (periode as PensjonPeriode).pensjonstype,
      id: namespace + (nsIndex ?? '') + '-pensjonstype',
      message: 'validation:noPensjonType',
      personName
    }))
  }

  hasErrors.push(validatePeriode(v, namespace + (nsIndex ?? ''), {
    periode: _periode,
    personName
  }))

  let haystack: Array<Periode | PensjonPeriode> | undefined

  // check if the item is itself in the list, use a list without it, for proper duplicate check
  if (_.isEmpty(nsIndex)) {
    haystack = perioder
  } else {
    haystack = _.filter(perioder, (p: Periode | PensjonPeriode) => {
      const _p: Periode = isPensjonPeriode(p) ? (p as PensjonPeriode).periode : (p as Periode)
      return getNSIdx(_p.__type, _p.__index) !== nsIndex
    })
  }

  const duplicate = _.find(haystack, (p: Periode | PensjonPeriode) => {
    return isPensjonPeriode(p)
      ? (p as PensjonPeriode).periode.startdato === _periode?.startdato && (p as PensjonPeriode).periode.sluttdato === _periode?.sluttdato
      : (p as Periode).startdato === _periode?.startdato && (p as Periode).sluttdato === _periode?.sluttdato
  }) !== undefined

  if (duplicate) {
    hasErrors.push(addError(v, {
      id: namespace + (nsIndex ?? '') + '-startdato',
      message: 'validation:duplicateStartdato',
      personName
    }))
  }

  return hasErrors.find(value => value) !== undefined
}

export const validateTrygdeordning = (
  v: Validation,
  namespace: string,
  type: string,
  perioder: Array<Periode | PensjonPeriode>,
  personName?: string
): boolean => {
  const hasErrors: Array<boolean> = []
  perioder?.forEach((periode: Periode | PensjonPeriode, index: number) => {
    // in validation run from mainValidation, periode does not have __type, but in
    // new/edit periode validations, I must check __type, so let's fill it if it doesn't have

    if (type === 'perioderMedPensjon') {
      if (!Object.prototype.hasOwnProperty.call((periode as PensjonPeriode).periode, '__type')) {
        (periode as PensjonPeriode).periode.__type = type;
        (periode as PensjonPeriode).periode.__index = index
      }
    } else {
      if (!Object.prototype.hasOwnProperty.call((periode as Periode), '__type')) {
        (periode as Periode).__type = type;
        (periode as Periode).__index = index
      }
    }

    if (type === 'perioderMedPensjon') {
      hasErrors.push(validateFamilieytelserPeriode(v, namespace, {
        periode: (periode as PensjonPeriode),
        perioder: (perioder as Array<PensjonPeriode>),
        nsIndex: getNSIdx(type, index),
        personName
      }))
    } else {
      hasErrors.push(validateDekkedePeriode(v, namespace, {
        periode: (periode as Periode),
        perioder: (perioder as Array<Periode>),
        nsIndex: getNSIdx(type, index),
        personName
      }))
    }
  })
  return hasErrors.find(value => value) !== undefined
}

export const validateTrygdeordninger = (
  v: Validation,
  namespace: string,
  {
    replySed,
    personID,
    personName
  } : ValidateTrygdeordningerProps
): boolean => {
  const hasErrors: Array<boolean> = []
  hasErrors.push(validateTrygdeordning(v, namespace, 'perioderMedITrygdeordning', _.get(replySed, `${personID}.perioderMedITrygdeordning`), personName))
  hasErrors.push(validateTrygdeordning(v, namespace, 'perioderUtenforTrygdeordning', _.get(replySed, `${personID}.perioderUtenforTrygdeordning`), personName))
  hasErrors.push(validateTrygdeordning(v, namespace, 'perioderMedArbeid', _.get(replySed, `${personID}.perioderMedArbeid`), personName))
  hasErrors.push(validateTrygdeordning(v, namespace, 'perioderMedTrygd', _.get(replySed, `${personID}.perioderMedTrygd`), personName))
  hasErrors.push(validateTrygdeordning(v, namespace, 'perioderMedYtelser', _.get(replySed, `${personID}.perioderMedYtelser`), personName))
  hasErrors.push(validateTrygdeordning(v, namespace, 'perioderMedPensjon', _.get(replySed, `${personID}.perioderMedPensjon`), personName))
  return hasErrors.find(value => value) !== undefined
}
