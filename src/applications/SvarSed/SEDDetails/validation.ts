import { validatePeriode } from 'components/Forms/validation'
import { LokaleSakId, Periode } from 'declarations/sed'
import { Validation } from 'declarations/types'
import _ from 'lodash'
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
  {
    anmodningsperiode,
    namespace
  }: ValidationSEDDetailsProps
): boolean => {
  const hasErrors = validatePeriode(v, {
    periode: anmodningsperiode,
    namespace
  })
  return hasErrors
}

export const validateSakseier = (
  v: Validation,
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
