import { Validation } from 'declarations/types'
import _ from 'lodash'
import { FeiloppsummeringFeil } from 'nav-frontend-skjema'
import { TFunction } from 'react-i18next'

export interface ValidationPdu1SearchProps {
  fagsak: string | undefined
  namespace: string
  fnrOrDnr: string
}

export const validatePdu1Search = (
  v: Validation,
  t: TFunction,
  {
    fagsak,
    namespace,
    fnrOrDnr
  }: ValidationPdu1SearchProps
): boolean => {
  let hasErrors: boolean = false
  if (_.isEmpty(fagsak)) {
    v[namespace + '-fagsak'] = {
      skjemaelementId: namespace + '-fagsak',
      feilmelding: t('validation:noFagsak')
    } as FeiloppsummeringFeil
    hasErrors = true
  }

  if (_.isEmpty(fnrOrDnr)) {
    v[namespace + '-fnrOrDnr'] = {
      skjemaelementId: namespace + '-fnrOrDnr',
      feilmelding: t('validation:noFnr')
    } as FeiloppsummeringFeil
    hasErrors = true
  }

  return hasErrors
}
