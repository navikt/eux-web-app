import { Validation } from 'declarations/types'
import _ from 'lodash'
import { ErrorElement } from 'declarations/app.d'
import { TFunction } from 'react-i18next'
import { getIdx } from 'utils/namespace'
import { KeyAndYtelse } from './KeyAndYtelse'

export interface ValidationKeyAndYtelseProps {
  keyAndYtelse: KeyAndYtelse
  index?: number
  namespace: string
}

export const validateKeyAndYtelse = (
  v: Validation,
  t: TFunction,
  {
    keyAndYtelse,
    index,
    namespace
  }: ValidationKeyAndYtelseProps
): boolean => {
  let hasErrors: boolean = false
  const idx = getIdx(index)

  if (_.isEmpty(keyAndYtelse?.fullKey?.trim())) {
    v[namespace + '-keyandytelse' + idx + '-key'] = {
      feilmelding: t('validation:noNavn'),
      skjemaelementId: namespace + '-keyandytelse' + idx + '-key'
    } as ErrorElement
    hasErrors = true
  }

  if (_.isEmpty(keyAndYtelse?.ytelseNavn?.trim())) {
    v[namespace + '-keyandytelse' + idx + '-ytelseNavn'] = {
      feilmelding: t('validation:noBetegnelsePåYtelse'),
      skjemaelementId: namespace + '-keyandytelse' + idx + '-ytelseNavn'
    } as ErrorElement
    hasErrors = true
  }
  return hasErrors
}
