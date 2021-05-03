import { Periode } from 'declarations/sed'
import { Validation } from 'declarations/types'
import _ from 'lodash'
import moment from 'moment'
import { FeiloppsummeringFeil } from 'nav-frontend-skjema'
import { TFunction } from 'react-i18next'
import { getIdx } from 'utils/namespace'

export interface ValidationPeriodProps {
  period: Periode
  index?: number | undefined
  namespace: string,
  personName?: string
}

const datePattern = /^\d{4}-\d{2}-\d{2}$/

export const validatePeriod = (
  v: Validation,
  t: TFunction,
  {
    period,
    index = undefined,
    namespace,
    personName
  }: ValidationPeriodProps
): boolean => {
  let hasErrors: boolean = false
  const idx = getIdx(index)
  if (_.isEmpty(period?.startdato?.trim())) {
    v[namespace + idx + '-startdato'] = {
      skjemaelementId: namespace + idx + '-startdato',
      feilmelding: personName
        ? t('message:validation-noDateForPerson', { person: personName })
        : t('message:validation-noDate')
    } as FeiloppsummeringFeil
    hasErrors = true
  }

  if (!_.isEmpty(period?.startdato?.trim()) && !(period.startdato!.trim().match(datePattern))) {
    v[namespace + idx + '-startdato'] = {
      skjemaelementId: namespace + idx + '-startdato',
      feilmelding: personName
        ? t('message:validation-invalidDateForPerson', { person: personName })
        : t('message:validation-invalidDate')
    } as FeiloppsummeringFeil
    hasErrors = true
  }

  if (!_.isEmpty(period?.sluttdato?.trim()) && !(period.sluttdato!.trim().match(datePattern))) {
    v[namespace + idx + '-sluttdato'] = {
      skjemaelementId: namespace + idx + '-sluttdato',
      feilmelding: personName
        ? t('message:validation-invalidDateForPerson', { person: personName })
        : t('message:validation-invalidDate')
    } as FeiloppsummeringFeil
    hasErrors = true
  }

  if (!_.isEmpty(period?.startdato?.trim()) && !_.isEmpty(period?.sluttdato?.trim()) &&
    moment(period.startdato.trim(), 'YYYY-MM-DD')
      .isAfter(moment(period.sluttdato?.trim(), 'YYYY-MM-DD'))) {
    v[namespace + idx + '-sluttdato'] = {
      skjemaelementId: namespace + idx + '-sluttdato',
      feilmelding: t('message:validation-endDateBeforeStartDate')
    } as FeiloppsummeringFeil
    hasErrors = true
  }
  return hasErrors
}
