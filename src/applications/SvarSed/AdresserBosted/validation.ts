import { validateAdresse } from 'applications/SvarSed/Adresser/validation'
import { H005AdresseMedVarighet } from 'declarations/h005'
import { Validation } from 'declarations/types'
import { getIdx } from 'utils/namespace'
import { checkLength } from 'utils/validation'

export interface ValidationAdresseBostedItemProps {
  item: H005AdresseMedVarighet | undefined
  index?: number
  personName?: string
}

export interface ValidationAdresserBostedProps {
  adresser: Array<H005AdresseMedVarighet> | undefined
  personName?: string
}

export const validateAdresseBostedItem = (
  v: Validation,
  namespace: string,
  {
    item,
    index,
    personName
  }: ValidationAdresseBostedItemProps
): boolean => {
  const hasErrors: Array<boolean> = []
  const idx = getIdx(index)

  hasErrors.push(validateAdresse(v, namespace, {
    adresse: item?.adresse,
    checkAdresseType: true,
    index,
    personName
  }))

  hasErrors.push(checkLength(v, {
    needle: item?.oppholdetsVarighet,
    id: namespace + idx + '-oppholdetsVarighet',
    max: 65,
    message: 'validation:textOverX'
  }))

  hasErrors.push(checkLength(v, {
    needle: item?.varighetUavbruttOpphold,
    id: namespace + idx + '-varighetUavbruttOpphold',
    max: 65,
    message: 'validation:textOverX'
  }))

  return hasErrors.find(value => value) !== undefined
}

export const validateAdresserBosted = (
  v: Validation,
  namespace: string,
  {
    adresser,
    personName
  }: ValidationAdresserBostedProps
): boolean => {
  const hasErrors: Array<boolean> = []
  adresser?.forEach((item: H005AdresseMedVarighet, index: number) => {
    hasErrors.push(validateAdresseBostedItem(v, namespace, {
      item,
      index,
      personName
    }))
  })
  return hasErrors.find(value => value) !== undefined
}
