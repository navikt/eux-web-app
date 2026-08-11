import { validateAdresse } from 'applications/SvarSed/Adresser/validation'
import { AdresseMedVarighet } from '../../../declarations/h'
import { Adresse } from 'declarations/sed'
import { Validation } from 'declarations/types'
import { getIdx } from 'utils/namespace'
import { checkLength } from 'utils/validation'

type AdresseItem = AdresseMedVarighet | Adresse

export interface ValidationAdresseBostedItemProps {
  item: AdresseItem | undefined
  showVarighet: boolean
  index?: number
  personName?: string
}

export interface ValidationAdresserBostedProps {
  adresser: Array<AdresseItem> | undefined
  showVarighet: boolean
  personName?: string
}

export const validateAdresseBostedItem = (
  v: Validation,
  namespace: string,
  {
    item,
    showVarighet,
    index,
    personName
  }: ValidationAdresseBostedItemProps
): boolean => {
  const hasErrors: Array<boolean> = []
  const idx = getIdx(index)
  const adresse = showVarighet ? (item as AdresseMedVarighet | undefined)?.adresse : (item as Adresse | undefined)

  hasErrors.push(validateAdresse(v, namespace, {
    adresse,
    checkAdresseType: true,
    index,
    personName
  }))

  if (showVarighet) {
    const varighet = item as AdresseMedVarighet | undefined

    hasErrors.push(checkLength(v, {
      needle: varighet?.oppholdetsVarighet,
      id: namespace + idx + '-oppholdetsVarighet',
      max: 65,
      message: 'validation:textOverX',
      personName
    }))

    hasErrors.push(checkLength(v, {
      needle: varighet?.varighetUavbruttOpphold,
      id: namespace + idx + '-varighetUavbruttOpphold',
      max: 65,
      message: 'validation:textOverX',
      personName
    }))
  }

  return hasErrors.find(value => value) !== undefined
}

export const validateAdresserBosted = (
  v: Validation,
  namespace: string,
  {
    adresser,
    showVarighet,
    personName
  }: ValidationAdresserBostedProps
): boolean => {
  const hasErrors: Array<boolean> = []
  adresser?.forEach((item: AdresseItem, index: number) => {
    hasErrors.push(validateAdresseBostedItem(v, namespace, {
      item,
      showVarighet,
      index,
      personName
    }))
  })
  return hasErrors.find(value => value) !== undefined
}
