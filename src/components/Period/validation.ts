import { Periode } from 'declarations/sed'
import { Validation } from 'declarations/types'
import _ from 'lodash'
import moment from 'moment'
import { FeiloppsummeringFeil } from 'nav-frontend-skjema'
import { TFunction } from 'react-i18next'

export interface ValidationPeriodProps {
  period: Periode
  index: number
  namespace: string,
  personName?: string
}

const datePattern = /^\d{4}-\d{2}-\d{2}$/

export const validatePeriod = (
  v: Validation,
  t: TFunction,
  {
    period,
    index,
    namespace,
    personName
  }: ValidationPeriodProps
): boolean => {
  let hasErrors: boolean = false
  const idx = (!_.isNil(index) && index >= 0 ? '[' + index + ']' : '')
  if (_.isEmpty(period.startdato)) {
    v[namespace + idx + '-startdato'] = {
      skjemaelementId: 'c-' + namespace + idx + '-startdato-date',
      feilmelding: personName
        ? t('message:validation-noDateForPerson', { person: personName })
        : t('message:validation-noDate')
    } as FeiloppsummeringFeil
    hasErrors = true
  }

  if (!_.isEmpty(period.startdato) && !period.startdato.match(datePattern)) {
    v[namespace + idx + '-startdato'] = {
      skjemaelementId: 'c-' + namespace + idx + '-startdato-date',
      feilmelding: personName
        ? t('message:validation-invalidDateForPerson', { person: personName })
        : t('message:validation-invalidDate')
    } as FeiloppsummeringFeil
    hasErrors = true
  }

  if (!_.isEmpty(period.sluttdato) && !period.sluttdato!.match(datePattern)) {
    v[namespace + idx + '-sluttdato'] = {
      skjemaelementId: 'c-' + namespace + idx + '-sluttdato-date',
      feilmelding: personName
        ? t('message:validation-invalidDateForPerson', { person: personName })
        : t('message:validation-invalidDate')
    } as FeiloppsummeringFeil
    hasErrors = true
  }

  if (!_.isEmpty(period.startdato) && !_.isEmpty(period.sluttdato) &&
    moment(period.startdato, 'YYYY-MM-DD')
      .isAfter(moment(period.sluttdato, 'YYYY-MM-DD'))) {
    v[namespace + idx + '-sluttdato'] = {
      skjemaelementId: 'c-' + namespace + idx + '-sluttdato-date',
      feilmelding: t('message:validation-endDateBeforeStartDate')
    } as FeiloppsummeringFeil
    hasErrors = true
  }
  return hasErrors
}
