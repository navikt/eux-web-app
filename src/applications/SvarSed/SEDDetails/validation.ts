import { validatePeriod } from 'components/Period/validation'
import { LokaleSakId, Periode } from 'declarations/sed'
import { Validation } from 'declarations/types'
import _ from 'lodash'
import { TFunction } from 'react-i18next'
import { getIdx } from 'utils/namespace'

export interface ValidationSEDDetailsProps {
  anmodningsperiode: Periode,
  namespace: string
}

export interface ValidationSakseierProps {
  lokaleSakId: LokaleSakId,
  index?: number
  namespace: string
}

export const validateSEDDetail = (
  v: Validation,
  t: TFunction,
  {
    anmodningsperiode,
    namespace
  }: ValidationSEDDetailsProps
): boolean => {
  const hasErrors = validatePeriod(v, t, {
    period: anmodningsperiode,
    namespace
  })
  return hasErrors
}

export const validateSakseier = (
  v: Validation,
  t: TFunction,
  {
    lokaleSakId,
    index,
    namespace
  }: ValidationSakseierProps
): boolean => {
  let hasErrors = false
  const idx = getIdx(index)

  if (_.isEmpty(lokaleSakId.institusjonsid)) {
    v[namespace + idx + '-institusjonsid'] = {
      feilmelding: '',
      skjemaelementId: namespace + idx + '-institusjonsid'
    }
    hasErrors = true
  }

  return hasErrors
}
