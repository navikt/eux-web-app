import { Periode } from 'declarations/sed'
import { Validation } from 'declarations/types'
import _ from 'lodash'
import moment from 'moment'
import { ErrorElement } from 'declarations/app.d'
import { TFunction } from 'react-i18next'
import { getIdx } from 'utils/namespace'

export interface ValidationPeriodeProps {
  periode: Periode
  index?: number | undefined
  mandatoryStartdato ?: boolean
  namespace: string,
  personName?: string
}

const datePattern = /^\d{4}-\d{2}-\d{2}$/

export const validatePeriode = (
  v: Validation,
  t: TFunction,
  {
    periode,
    index = undefined,
    namespace,
    mandatoryStartdato = true,
    personName
  }: ValidationPeriodeProps
): boolean => {
  let hasErrors: boolean = false
  const idx = getIdx(index)
  if (mandatoryStartdato && _.isEmpty(periode?.startdato?.trim())) {
    v[namespace + idx + '-startdato'] = {
      skjemaelementId: namespace + idx + '-startdato',
      feilmelding: t('validation:noDate') + (personName ? t('validation:til-person', { person: personName }) : '')
    } as ErrorElement
    hasErrors = true
  }

  if (!_.isEmpty(periode?.startdato?.trim()) && !(periode.startdato!.trim().match(datePattern))) {
    v[namespace + idx + '-startdato'] = {
      skjemaelementId: namespace + idx + '-startdato',
      feilmelding: t('validation:invalidDate') + (personName ? t('validation:til-person', { person: personName }) : '')
    } as ErrorElement
    hasErrors = true
  }

  if (!_.isEmpty(periode?.sluttdato?.trim()) && !(periode.sluttdato!.trim().match(datePattern))) {
    v[namespace + idx + '-sluttdato'] = {
      skjemaelementId: namespace + idx + '-sluttdato',
      feilmelding: t('validation:invalidDate') + (personName ? t('validation:til-person', { person: personName }) : '')
    } as ErrorElement
    hasErrors = true
  }

  if (!_.isEmpty(periode?.startdato?.trim()) && !_.isEmpty(periode?.sluttdato?.trim()) &&
    moment(periode.startdato.trim(), 'YYYY-MM-DD')
      .isAfter(moment(periode.sluttdato?.trim(), 'YYYY-MM-DD'))) {
    v[namespace + idx + '-sluttdato'] = {
      skjemaelementId: namespace + idx + '-sluttdato',
      feilmelding: t('validation:endDateBeforeStartDate')
    } as ErrorElement
    hasErrors = true
  }
  return hasErrors
}
