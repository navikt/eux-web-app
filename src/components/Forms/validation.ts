import { Periode, PeriodeInputType } from 'declarations/sed'
import { Validation } from 'declarations/types'
import _ from 'lodash'
import { getIdx } from 'utils/namespace'
import {addError, checkIfNotDate, checkIfNotEmpty, checkValidDateFormat} from 'utils/validation'
import {isDateValidFormat} from "../DateField/DateField";
import moment from 'moment'

export interface ValidationPeriodeProps {
  periode: Periode | undefined
  index?: number | undefined
  mandatoryStartdato ?: boolean
  mandatorySluttdato ?: boolean
  periodeType ?: PeriodeInputType
  personName?: string
}

export const validatePeriode = (
  v: Validation,
  namespace: string,
  {
    periode,
    index = undefined,
    mandatoryStartdato = true,
    mandatorySluttdato = false,
    periodeType = 'withcheckbox',
    personName
  }: ValidationPeriodeProps
): boolean => {
  const hasErrors: Array<boolean> = []
  const idx = getIdx(index)

  if (mandatoryStartdato) {
    hasErrors.push(checkIfNotEmpty(v, {
      needle: periode?.startdato,
      id: namespace + idx + '-startdato',
      message: 'validation:noDate',
      personName
    }))
  }

  hasErrors.push(checkIfNotDate(v, {
    needle: periode?.startdato,
    id: namespace + idx + '-startdato',
    message: 'validation:invalidDate',
    personName
  }))

  hasErrors.push(checkValidDateFormat(v, {
    needle: periode?.startdato,
    id: namespace + idx + '-startdato',
    message: 'validation:invalidDateFormat',
    personName
  }))

  if (mandatorySluttdato) {
    hasErrors.push(checkIfNotEmpty(v, {
      needle: periode?.sluttdato,
      id: namespace + idx + '-sluttdato',
      message: 'validation:noDate',
      personName
    }))
  }

  hasErrors.push(checkIfNotDate(v, {
    needle: periode?.sluttdato,
    id: namespace + idx + '-sluttdato',
    message: 'validation:invalidDate',
    personName
  }))

  hasErrors.push(checkValidDateFormat(v, {
    needle: periode?.sluttdato,
    id: namespace + idx + '-sluttdato',
    message: 'validation:invalidDateFormat',
    personName
  }))

  if (!_.isEmpty(periode?.startdato?.trim()) && !_.isEmpty(periode?.sluttdato?.trim()) &&
    (isDateValidFormat(periode!.startdato) && isDateValidFormat(periode!.sluttdato)) &&
    moment(periode!.startdato.trim(), 'YYYY-MM-DD').isAfter(moment(periode!.sluttdato?.trim(), 'YYYY-MM-DD'))) {
      hasErrors.push(addError(v, {
        id: namespace + idx + '-sluttdato',
        message: 'validation:endDateBeforeStartDate',
        personName
      }))
  }

  if (mandatoryStartdato && periodeType === 'withcheckbox' && _.isEmpty(periode?.sluttdato?.trim()) && _.isEmpty(periode?.aapenPeriodeType)) {
    hasErrors.push(addError(v, {
      id: namespace + idx + '-aapenPeriodeType',
      message: 'validation:noAapenPeriodeType',
      personName
    }))
  }

  return hasErrors.find(value => value) !== undefined
}
