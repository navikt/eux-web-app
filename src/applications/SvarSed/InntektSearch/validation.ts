
import { Validation } from 'declarations/types'
import _ from 'lodash'
import moment from 'moment'
import { ErrorElement } from 'declarations/app.d'

export interface ValidationInntektSearchProps {
  fom: string
  tom: string
  inntektsliste: string | undefined
  namespace: string
}

const datePattern = /^\d{4}-\d{2}$/

export const validateInntektSearch = (
  v: Validation,
  {
    fom,
    tom,
    inntektsliste,
    namespace
  }: ValidationInntektSearchProps
): boolean => {
  let hasErrors: boolean = false
  if (_.isEmpty(fom.trim())) {
    v[namespace + '-startdato'] = {
      skjemaelementId: namespace + '-startdato',
      feilmelding: t('validation:noDate')
    } as ErrorElement
    hasErrors = true
  } else {
    if (!fom?.trim().match(datePattern)) {
      v[namespace + '-startdato'] = {
        feilmelding: t('validation:invalidDate'),
        skjemaelementId: namespace + '-startdato'
      } as ErrorElement
      hasErrors = true
    } else {
      const fomDate = moment(fom, 'YYYY-MM')
      if (fomDate.isBefore(new Date(2015, 0, 1))) {
        v[namespace + '-startdato'] = {
          feilmelding: t('validation:invalidDate2015'),
          skjemaelementId: namespace + '-startdato'
        } as ErrorElement
        hasErrors = true
      }
    }
  }

  if (_.isEmpty(tom.trim())) {
    v[namespace + '-sluttdato'] = {
      skjemaelementId: namespace + '-sluttdato',
      feilmelding: t('validation:noDate')
    } as ErrorElement
    hasErrors = true
  } else {
    if (!(tom.trim().match(datePattern))) {
      v[namespace + '-sluttdato'] = {
        skjemaelementId: namespace + '-sluttdato',
        feilmelding: t('validation:invalidDate')
      } as ErrorElement
      hasErrors = true
    } else {
      const fomDate = moment(fom, 'YYYY-MM')
      const tomDate = moment(tom, 'YYYY-MM')
      if (tomDate.isBefore(fomDate)) {
        v[namespace + '-sluttdato'] = {
          feilmelding: t('validation:invalidDateFomTom'),
          skjemaelementId: namespace + '-sluttdato'
        } as ErrorElement
        hasErrors = true
      }
    }
  }

  if (_.isEmpty(inntektsliste?.trim())) {
    v[namespace + '-inntektsliste'] = {
      skjemaelementId: namespace + '-inntektsliste',
      feilmelding: t('validation:noInntektsliste')
    } as ErrorElement
    hasErrors = true
  }

  return hasErrors
}
