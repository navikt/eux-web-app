import { Validation } from 'declarations/types'
import _ from 'lodash'
import { ErrorElement } from 'declarations/app.d'
import { TFunction } from 'react-i18next'
import { getIdx } from 'utils/namespace'

export interface ValidationDagpengerProps {
  startdato: string | undefined
  sluttdato: string |undefined
  index ? : number
  namespace: string
}

export const validateDagpenger = (
  v: Validation,
  t: TFunction,
  {
    startdato,
    sluttdato,
    index,
    namespace
  }: ValidationDagpengerProps
): boolean => {
  let hasErrors: boolean = false
  const idx = getIdx(index)

  if (_.isEmpty(startdato?.trim())) {
    v[namespace + idx + '-startdato'] = {
      feilmelding: t('validation:noStartdato'),
      skjemaelementId: namespace + idx + '-startdato'
    } as ErrorElement
    hasErrors = true
  }

  if (_.isEmpty(sluttdato?.trim())) {
    v[namespace + idx + '-sluttdato'] = {
      feilmelding: t('validation:noSluttdato'),
      skjemaelementId: namespace + idx + '-sluttdato'
    } as ErrorElement
    hasErrors = true
  }

  if (hasErrors) {
    const namespaceBits = namespace.split('-')
    const mainNamespace = namespaceBits[0]
    const personNamespace = mainNamespace + '-' + namespaceBits[1]
    const categoryNamespace = personNamespace + '-' + namespaceBits[2]
    v[mainNamespace] = { feilmelding: 'notnull', skjemaelementId: '' } as ErrorElement
    v[personNamespace] = { feilmelding: 'notnull', skjemaelementId: '' } as ErrorElement
    v[categoryNamespace] = { feilmelding: 'notnull', skjemaelementId: '' } as ErrorElement
  }
  return hasErrors
}
