import { validateAdresse } from 'applications/SvarSed/Adresser/validation'
import { Adresse } from 'declarations/sed'
import { Validation } from 'declarations/types'

export interface ValidationAdressePositivtSvarItemProps {
  item: Adresse | undefined
  index?: number
  personName?: string
}

export interface ValidationAdresserPositivtSvarProps {
  adresser: Array<Adresse> | undefined
  personName?: string
}

export const validateAdressePositivtSvarItem = (
  v: Validation,
  namespace: string,
  {
    item,
    index,
    personName
  }: ValidationAdressePositivtSvarItemProps
): boolean => {
  const hasErrors: Array<boolean> = []

  hasErrors.push(validateAdresse(v, namespace, {
    adresse: item,
    checkAdresseType: true,
    index,
    personName
  }))

  return hasErrors.find(value => value) !== undefined
}

export const validateAdresserPositivtSvar = (
  v: Validation,
  namespace: string,
  {
    adresser,
    personName
  }: ValidationAdresserPositivtSvarProps
): boolean => {
  const hasErrors: Array<boolean> = []
  adresser?.forEach((item: Adresse, index: number) => {
    hasErrors.push(validateAdressePositivtSvarItem(v, namespace, {
      item,
      index,
      personName
    }))
  })
  return hasErrors.find(value => value) !== undefined
}
