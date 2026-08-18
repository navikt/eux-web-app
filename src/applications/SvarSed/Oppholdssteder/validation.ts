import { validateAdresse } from 'applications/SvarSed/Adresser/validation'
import { Oppholdssted } from '../../../declarations/h'
import { Validation } from 'declarations/types'
import { getIdx } from 'utils/namespace'
import { checkLength } from 'utils/validation'

export interface ValidationOppholdsstedProps {
  oppholdssted: Oppholdssted | undefined
  showVarighet: boolean
  index?: number
  personName?: string
}

export interface ValidationOppholdsstederProps {
  oppholdssteder: Array<Oppholdssted> | undefined
  showVarighet: boolean
  personName?: string
}

export const validateOppholdssted = (
  v: Validation,
  namespace: string,
  {
    oppholdssted,
    showVarighet,
    index,
    personName
  }: ValidationOppholdsstedProps
): boolean => {
  const hasErrors: Array<boolean> = []
  const idx = getIdx(index)
  const adresse = oppholdssted?.adresse

  hasErrors.push(validateAdresse(v, namespace, {
    adresse,
    checkAdresseType: true,
    index,
    personName
  }))

  if (showVarighet) {
    hasErrors.push(checkLength(v, {
      needle: oppholdssted?.oppholdetsVarighet,
      id: namespace + idx + '-oppholdetsVarighet',
      max: 65,
      message: 'validation:textOverX',
      personName
    }))

    hasErrors.push(checkLength(v, {
      needle: oppholdssted?.varighetUavbruttOpphold,
      id: namespace + idx + '-varighetUavbruttOpphold',
      max: 65,
      message: 'validation:textOverX',
      personName
    }))
  }

  return hasErrors.find(value => value) !== undefined
}

export const validateOppholdssteder = (
  v: Validation,
  namespace: string,
  {
    oppholdssteder,
    showVarighet,
    personName
  }: ValidationOppholdsstederProps
): boolean => {
  const hasErrors: Array<boolean> = []
  oppholdssteder?.forEach((oppholdssted: Oppholdssted, index: number) => {
    hasErrors.push(validateOppholdssted(v, namespace, {
      oppholdssted,
      showVarighet,
      index,
      personName
    }))
  })
  return hasErrors.find(value => value) !== undefined
}
