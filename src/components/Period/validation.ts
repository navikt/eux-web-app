import { Periode } from 'declarations/sed'
import { Validation } from 'declarations/types'
import moment from 'moment'
import { FeiloppsummeringFeil } from 'nav-frontend-skjema'
import { TFunction } from 'react-i18next'

export interface ValidationPeriodProps {
  period: Periode
  index: number
  namespace: string
}

const datePattern = /^\d{4}-\d{2}-\d{2}$/

export const validatePeriod = (
  v: Validation,
  t: TFunction,
  {
   period,
   index,
   namespace
  }: ValidationPeriodProps
): void => {
  const idx = (index >= 0 ? '[' + index + ']' : '')
  if (!period.startdato) {
    v[namespace + '-startdato'] = {
      skjemaelementId: 'c-' + namespace + idx + '-startdato-date',
      feilmelding: t('message:validation-noDate')
    } as FeiloppsummeringFeil
  }

  if (period.startdato && !period.startdato.match(datePattern)) {
    v[namespace + '-startdato'] = {
      skjemaelementId: 'c-' + namespace + idx + '-startdato-date',
      feilmelding: t('message:validation-invalidDate')
    } as FeiloppsummeringFeil
  }

  if (period.sluttdato && !period.sluttdato.match(datePattern)) {
    v[namespace + '-sluttdato'] = {
      skjemaelementId: 'c-' + namespace + idx + '-sluttdato-date',
      feilmelding: t('message:validation-invalidDate')
    } as FeiloppsummeringFeil
  }

  if (period.sluttdato && period.startdato &&
    moment(period.startdato, 'YYYY-MM-DD').isAfter(moment(period.sluttdato,'YYYY-MM-DD'))) {
    v[namespace + '-sluttdato'] = {
      skjemaelementId: 'c-' + namespace + idx + '-sluttdato-date',
      feilmelding: t('message:validation-endDateBeforeStartDate')
    } as FeiloppsummeringFeil
  }
}
