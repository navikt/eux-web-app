import { validatePeriode } from 'components/Forms/validation'
import { Periode } from 'declarations/sed'
import { Validation } from 'declarations/types'
import {checkLength} from "../../../utils/validation";

export interface ValidationAnmodningsPerioderProps {
  anmodningsperioder: Array<Periode> | undefined
}

export interface ValidationKravProps {
  krav: any | undefined
}

export interface ValidationAnmodningsPeriodeProps {
  anmodningsperiode: Periode | undefined
  index ?: number
}
export const validateAnmodningsPeriode = (
  v: Validation,
  namespace: string,
  {
    anmodningsperiode,
    index
  }: ValidationAnmodningsPeriodeProps
): boolean => {
  return validatePeriode(v, namespace, {
    periode: anmodningsperiode,
    index
  })
}

export const validateAnmodningsPerioder = (
  v: Validation,
  namespace: string,
  {
    anmodningsperioder
  }: ValidationAnmodningsPerioderProps
): boolean => {
  const hasErrors: Array<boolean> = []
  anmodningsperioder?.forEach((anmodningsperiode: Periode, index: number) => {
    hasErrors.push(validateAnmodningsPeriode(v, namespace, {
      anmodningsperiode,
      index
    }))
  })
  return hasErrors.find(value => value) !== undefined
}

export const validateKrav = (
  v: Validation,
  namespace: string,
  {
    krav
  }: ValidationKravProps
): boolean => {
  const hasErrors: Array<boolean> = []

  if(krav?.infoType === 'gi_oss_punktvise_opplysninger'){
    hasErrors.push(checkLength(v, {
      needle: krav?.infoPresisering,
      max: 255,
      id: namespace + '-opplysninger',
      message: 'validation:textOverX',
    }))
  }

  return hasErrors.find(value => value) !== undefined
}
