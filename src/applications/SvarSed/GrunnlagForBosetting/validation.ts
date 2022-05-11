import { validatePeriode } from 'components/Forms/validation'
import { Flyttegrunn, Periode } from 'declarations/sed'
import { Validation } from 'declarations/types'
import _ from 'lodash'
import { addError, checkIfNotDate, checkLength } from 'utils/validation'

export interface ValidationGrunnlagForBosettingProps {
  periode: Periode | undefined
  perioder: Array<Periode> | undefined
  index?: number
  personName?: string
}

export interface ValidateAllGrunnlagForBosettingProps {
  flyttegrunn: Flyttegrunn | undefined
  personName?: string
}

export const validateGrunnlagForBosetting = (
  v: Validation,
  namespace: string,
  {
    periode,
    perioder,
    personName
  }: ValidationGrunnlagForBosettingProps
): boolean => {
  const hasErrors: Array<boolean> = []

  hasErrors.push(validatePeriode(v, namespace + '-perioder', {
    periode,
    personName
  }))

  if (!_.isEmpty(periode?.startdato)) {
    const duplicate: boolean = _.find(perioder, p => p.startdato === periode?.startdato) !== undefined
    if (duplicate) {
      hasErrors.push(addError(v, {
        message: 'validation:duplicateStartdato',
        id: namespace + 'perioder-startdato',
        personName
      }))
    }
  }

  return hasErrors.find(value => value) !== undefined
}

export const validateAllGrunnlagForBosetting = (
  v: Validation,
  namespace: string,
  {
    flyttegrunn,
    personName
  }: ValidateAllGrunnlagForBosettingProps
): boolean => {
  const hasErrors: Array<boolean> = []

  flyttegrunn?.perioder?.forEach((periode: Periode, index: number) => {
    hasErrors.push(validatePeriode(v, namespace + '-perioder', {
      periode,
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

  hasErrors.push(checkLength(v, {
    needle: flyttegrunn?.personligSituasjon,
    id: namespace + '-personligSituasjon',
    message: 'validation:textOverX',
    max: 500,
    personName
  }))

  return hasErrors.find(value => value) !== undefined
}
