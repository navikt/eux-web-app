import { validatePeriode } from 'components/Forms/validation'
import { LokaleSakId, Periode } from 'declarations/sed'
import { Validation } from 'declarations/types'
import _ from 'lodash'
import { getIdx } from 'utils/namespace'

export interface ValidationSEDDetailsProps {
  anmodningsperiode: Periode
}

export interface ValidationSakseierProps {
  lokaleSakId: LokaleSakId,
  index?: number
}

export const validateSEDDetail = (
  v: Validation,
  namespace: string,
  {
    anmodningsperiode
  }: ValidationSEDDetailsProps
): boolean => {
  const hasErrors = validatePeriode(v, namespace, {
    periode: anmodningsperiode
  })
  return hasErrors
}

export const validateSakseier = (
  v: Validation,
  namespace: string,
  {
    lokaleSakId,
    index
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
