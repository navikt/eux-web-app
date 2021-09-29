import { Periode } from 'declarations/sed'
import { Validation } from 'declarations/types'
import _ from 'lodash'
import moment from 'moment'
import { FeiloppsummeringFeil } from 'nav-frontend-skjema'
import { TFunction } from 'react-i18next'
import { getIdx } from 'utils/namespace'

export interface ValidationPeriodeProps {
  periode: Periode
  index?: number | undefined
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
    personName
  }: ValidationPeriodeProps
): boolean => {
  let hasErrors: boolean = false
  const idx = getIdx(index)
  if (_.isEmpty(periode?.startdato?.trim())) {
    v[namespace + idx + '-startdato'] = {
      skjemaelementId: namespace + idx + '-startdato',
      feilmelding: personName
        ? t('message:validation-noDateForPerson', { person: personName })
        : t('message:validation-noDate')
    } as FeiloppsummeringFeil
    hasErrors = true
  }

  if (!_.isEmpty(periode?.startdato?.trim()) && !(periode.startdato!.trim().match(datePattern))) {
    v[namespace + idx + '-startdato'] = {
      skjemaelementId: namespace + idx + '-startdato',
      feilmelding: personName
        ? t('message:validation-invalidDateForPerson', { person: personName })
        : t('message:validation-invalidDate')
    } as FeiloppsummeringFeil
    hasErrors = true
  }

  if (!_.isEmpty(periode?.sluttdato?.trim()) && !(periode.sluttdato!.trim().match(datePattern))) {
    v[namespace + idx + '-sluttdato'] = {
      skjemaelementId: namespace + idx + '-sluttdato',
      feilmelding: personName
        ? t('message:validation-invalidDateForPerson', { person: personName })
        : t('message:validation-invalidDate')
    } as FeiloppsummeringFeil
    hasErrors = true
  }

  if (!_.isEmpty(periode?.startdato?.trim()) && !_.isEmpty(periode?.sluttdato?.trim()) &&
    moment(periode.startdato.trim(), 'YYYY-MM-DD')
      .isAfter(moment(periode.sluttdato?.trim(), 'YYYY-MM-DD'))) {
    v[namespace + idx + '-sluttdato'] = {
      skjemaelementId: namespace + idx + '-sluttdato',
      feilmelding: t('message:validation-endDateBeforeStartDate')
    } as FeiloppsummeringFeil
    hasErrors = true
  }
  return hasErrors
}
