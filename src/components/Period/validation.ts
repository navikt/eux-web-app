import { Periode } from 'declarations/sed'
import { Validation } from 'declarations/types'
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
  if (!period.startdato) {
    v[namespace + '-startdato'] = {
      skjemaelementId: 'c-' + namespace + (index >= 0 ? '[' + index + ']' : '') + '-startdato-date',
      feilmelding: t('message:validation-noDate')
    } as FeiloppsummeringFeil
  }

  if (period.startdato && !period.startdato.match(datePattern)) {
    v[namespace + '-startdato'] = {
      skjemaelementId: 'c-' + namespace + (index >= 0 ? '[' + index + ']' : '') + '-startdato-date',
      feilmelding: t('message:validation-invalidDate')
    } as FeiloppsummeringFeil
  }

  if (period.sluttdato && !period.sluttdato.match(datePattern)) {
    v[namespace + '-sluttdato'] = {
      skjemaelementId: 'c-' + namespace + (index >= 0 ? '[' + index + ']' : '') + '-sluttdato-date',
      feilmelding: t('message:validation-invalidDate')
    } as FeiloppsummeringFeil
  }
}
