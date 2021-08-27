
import { Validation } from 'declarations/types'
import _ from 'lodash'
import moment from 'moment'
import { FeiloppsummeringFeil } from 'nav-frontend-skjema'
import { TFunction } from 'react-i18next'

export interface ValidationInntektSearchProps {
  fom: string
  tom: string
  inntektsliste: string | undefined
  namespace: string
}

const datePattern = /^\d{4}-\d{2}-\d{2}$/

export const validateInntektSearch = (
  v: Validation,
  t: TFunction,
  {
    fom,
    tom,
    inntektsliste,
    namespace
  }: ValidationInntektSearchProps
): boolean => {
  let hasErrors: boolean = false

  if (!_.isEmpty(fom.trim())) {

    if (!fom?.trim().match(datePattern)) {
      v[namespace + '-startdato'] = {
        feilmelding: t('message:validation-invalidDate'),
        skjemaelementId: namespace + '-startdato'
      } as FeiloppsummeringFeil
      hasErrors = true
    } else {
      let fomDate = moment(fom, 'YYYY-MM-DD')
      if (fomDate.isBefore(new Date(2015, 0, 1))) {
        v[namespace + '-startdato'] = {
          feilmelding: t('message:validation-invalidDate2015'),
          skjemaelementId: namespace + '-startdato'
        } as FeiloppsummeringFeil
        hasErrors = true
      }
    }
  }

   if (!_.isEmpty(tom?.trim()) && !tom?.trim().match(datePattern)) {
     v[namespace + '-sluttdato'] = {
       feilmelding: t('message:validation-invalidDate'),
       skjemaelementId: namespace + '-sluttdato'
     } as FeiloppsummeringFeil
     hasErrors = true
   }

  if (_.isEmpty(inntektsliste?.trim())) {
    v[namespace + '-inntektsliste'] = {
      skjemaelementId: namespace + '-inntektsliste',
      feilmelding: t('message:validation-noInntektsliste')
    } as FeiloppsummeringFeil
    hasErrors = true
  }

  return hasErrors
}
