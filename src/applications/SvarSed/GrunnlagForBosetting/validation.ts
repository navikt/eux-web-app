import { validatePeriode } from 'components/Forms/validation'
import { Flyttegrunn, Periode } from 'declarations/sed'
import { Validation } from 'declarations/types'
import { getIdx } from 'utils/namespace'
import {checkIfDuplicate, checkIfNotDate, checkLength, checkValidDateFormat} from 'utils/validation'
import _ from "lodash";

export interface ValidationGrunnlagForBosettingPeriodeProps {
  periode: Periode | undefined
  perioder: Array<Periode> | undefined
  index?: number
  personName?: string
}

export interface ValidateGrunnlagForBosettingProps {
  flyttegrunn: Flyttegrunn | undefined
  personName?: string
}

export const validateGrunnlagForBosettingPeriode = (
  v: Validation,
  namespace: string,
  {
    periode,
    perioder,
    index,
    personName
  }: ValidationGrunnlagForBosettingPeriodeProps
): boolean => {
  const hasErrors: Array<boolean> = []
  const idx = getIdx(index)

  hasErrors.push(validatePeriode(v, namespace, {
    periode,
    personName,
    index
  }))

  hasErrors.push(checkIfDuplicate(v, {
    needle: periode,
    haystack: perioder,
    matchFn: (p: Periode) => p.startdato === periode?.startdato && p.sluttdato === periode?.sluttdato,
    message: 'validation:duplicateStartdato',
    id: namespace + idx + '-startdato',
    index,
    personName
  }))

  return hasErrors.find(value => value) !== undefined
}

export const validateGrunnlagForBosetting = (
  v: Validation,
  namespace: string,
  {
    flyttegrunn,
    personName
  }: ValidateGrunnlagForBosettingProps
): boolean => {
  const hasErrors: Array<boolean> = []

  flyttegrunn?.perioder?.forEach((periode: Periode, index: number) => {
    hasErrors.push(validateGrunnlagForBosettingPeriode(v, namespace, {
      periode,
      perioder: flyttegrunn?.perioder,
      index,
      personName
    }))
  })

  hasErrors.push(checkIfNotDate(v, {
    needle: flyttegrunn?.datoFlyttetTilAvsenderlandet,
    id: namespace + '-datoFlyttetTilAvsenderlandet',
    message: 'validation:invalidDate',
    personName
  }))

  hasErrors.push(checkValidDateFormat(v, {
    needle: flyttegrunn?.datoFlyttetTilAvsenderlandet,
    id: namespace + '-datoFlyttetTilAvsenderlandet',
    message: 'validation:invalidDateFormat',
    personName
  }))

  if (!_.isEmpty(flyttegrunn?.datoFlyttetTilMottakerlandet)){
    hasErrors.push(checkValidDateFormat(v, {
      needle: flyttegrunn?.datoFlyttetTilMottakerlandet,
      id: namespace + '-datoFlyttetTilMottakerlandet',
      message: 'validation:invalidDateFormat',
      personName
    }))
  }

  hasErrors.push(checkLength(v, {
    needle: flyttegrunn?.personligSituasjon,
    id: namespace + '-personligSituasjon',
    message: 'validation:textOverX',
    max: 255,
    personName
  }))

  return hasErrors.find(value => value) !== undefined
}
