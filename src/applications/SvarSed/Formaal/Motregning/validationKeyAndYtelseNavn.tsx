import { Validation } from 'declarations/types'
import _ from 'lodash'
import { FeiloppsummeringFeil } from 'nav-frontend-skjema'
import { TFunction } from 'react-i18next'
import { getIdx } from 'utils/namespace'
import { IKeyAndYtelseNavn } from './KeyAndYtelseNavn'

export interface ValidationKeyAndYtelseNavnProps {
  keyAndYtelseNavn: IKeyAndYtelseNavn
  index?: number
  namespace: string
}

export const validateKeyAndYtelseNavn = (
  v: Validation,
  t: TFunction,
  {
    keyAndYtelseNavn,
    index,
    namespace
  }: ValidationKeyAndYtelseNavnProps
): boolean => {
  let hasErrors: boolean = false
  const idx = getIdx(index)

  if (_.isEmpty(keyAndYtelseNavn?.key?.trim())) {
    v[namespace + '-keyandytelsenavn' + idx + '-key'] = {
      feilmelding: t('message:validation-noNavn'),
      skjemaelementId: namespace + '-keyandytelsenavn' + idx + '-key'
    } as FeiloppsummeringFeil
    hasErrors = true
  }

  if (_.isEmpty(keyAndYtelseNavn?.ytelseNavn?.trim())) {
    v[namespace + '-keyandytelsenavn' + idx + '-ytelseNavn'] = {
      feilmelding: t('message:validation-noBetegnelsePåYtelse'),
      skjemaelementId: namespace + '-keyandytelsenavn' + idx + '-ytelseNavn'
    } as FeiloppsummeringFeil
    hasErrors = true
  }
  return hasErrors
}
