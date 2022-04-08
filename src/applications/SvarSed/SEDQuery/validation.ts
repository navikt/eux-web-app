import { ErrorElement } from 'declarations/app'
import { Validation } from 'declarations/types'
import _ from 'lodash'
import { TFunction } from 'react-i18next'

interface ValidationSEDQueryProps {
  saksnummerOrFnr: string
  namespace: string
}

export const validateSEDQuery = (
  v: Validation,
  t: TFunction,
  {
    saksnummerOrFnr,
    namespace
  }: ValidationSEDQueryProps
): boolean => {
  let hasErrors: boolean = false
  if (_.isEmpty(saksnummerOrFnr.trim())) {
    v[namespace + '-saksnummerOrFnr'] = {
      feilmelding: t('validation:noSaksnummerOrFnr'),
      skjemaelementId: namespace + '-saksnummerOrFnr'
    } as ErrorElement
    hasErrors = true
  }
  return hasErrors
}
