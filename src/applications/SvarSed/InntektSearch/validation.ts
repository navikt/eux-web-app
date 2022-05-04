import { Validation } from 'declarations/types'
import _ from 'lodash'
import moment from 'moment'
import { addError, checkIfNotDate, checkIfNotEmpty } from 'utils/validation'

export interface ValidationInntektSearchProps {
  fom: string | undefined
  tom: string | undefined
  inntektsliste: string | undefined
}

const monthPattern = /^\d{4}-\d{2}$/

export const validateInntektSearch = (
  v: Validation,
  namespace: string,
  {
    fom,
    tom,
    inntektsliste
  }: ValidationInntektSearchProps
): boolean => {
  const hasErrors: Array<boolean> = []

  hasErrors.push(checkIfNotEmpty(v, {
    needle: fom,
    id: namespace + '-startdato',
    message: 'validation:noDate'
  }))

  if (!_.isEmpty(fom?.trim())) {
    hasErrors.push(checkIfNotDate(v, {
      needle: fom,
      pattern: monthPattern,
      id: namespace + '-startdato',
      message: 'validation:invalidDate'
    }))

    if (fom?.trim()?.match(monthPattern)) {
      const fomDate = moment(fom, 'YYYY-MM')
      if (fomDate.isBefore(new Date(2015, 0, 1))) {
        hasErrors.push(addError(v, {
          id: namespace + '-startdato',
          message: 'validation:invalidDate2015'
        }))
      }
    }
  }

  hasErrors.push(checkIfNotEmpty(v, {
    needle: tom,
    id: namespace + '-sluttdato',
    message: 'validation:noDate'
  }))

  if (!_.isEmpty(tom?.trim())) {
    hasErrors.push(checkIfNotDate(v, {
      needle: tom,
      pattern: monthPattern,
      id: namespace + '-sluttdato',
      message: 'validation:invalidDate'
    }))

    if (tom?.trim()?.match(monthPattern)) {
      const fomDate = moment(fom, 'YYYY-MM')
      const tomDate = moment(tom, 'YYYY-MM')
      if (tomDate.isBefore(fomDate)) {
        hasErrors.push(addError(v, {
          id: namespace + '-sluttdato',
          message: 'validation:invalidDateFomTom'
        }))
      }
    }
  }

  hasErrors.push(checkIfNotEmpty(v, {
    needle: inntektsliste,
    id: namespace + '-inntektsliste',
    message: 'validation:noInntektsliste'
  }))

  return hasErrors.find(value => value) !== undefined
}
