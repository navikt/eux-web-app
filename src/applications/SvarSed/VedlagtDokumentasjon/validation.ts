import { H070Sed } from 'declarations/h070'
import { ReplySed } from 'declarations/sed'
import { Validation } from 'declarations/types'
import _ from 'lodash'
import { getIdx } from 'utils/namespace'
import { checkIfNotEmpty, checkLength } from 'utils/validation'

export interface ValidationVedlagtDokumentasjonProps {
  replySed: ReplySed
  personName?: string
}

export interface ValidationAnnetDokumentProps {
  annetDokument: string | undefined
  index?: number
  personName?: string
}

export const validateAnnetDokument = (
  v: Validation,
  namespace: string,
  {
    annetDokument,
    index,
    personName
  }: ValidationAnnetDokumentProps
): boolean => {
  const hasErrors: Array<boolean> = []
  const idx = getIdx(index)

  hasErrors.push(checkIfNotEmpty(v, {
    needle: annetDokument,
    id: namespace + idx + '-annetDokument',
    message: 'validation:noAnnetDokument',
    personName
  }))

  hasErrors.push(checkLength(v, {
    needle: annetDokument,
    max: 255,
    id: namespace + idx + '-annetDokument',
    message: 'validation:textOverX',
    personName
  }))

  return hasErrors.find(value => value) !== undefined
}

export const validateVedlagtDokumentasjon = (
  v: Validation,
  namespace: string,
  {
    replySed,
    personName
  }: ValidationVedlagtDokumentasjonProps
): boolean => {
  const hasErrors: Array<boolean> = []
  const sed = replySed as H070Sed

  const isAnnetSelected = sed.dokument?.forhaandsdefinerteDokumenter?.includes('annet')
  const annetDokumenter = sed.dokument?.annetDokument

  if (isAnnetSelected) {
    if (_.isEmpty(annetDokumenter)) {
      hasErrors.push(checkIfNotEmpty(v, {
        needle: undefined,
        id: namespace + '-annetDokument',
        message: 'validation:noAnnetDokument',
        personName
      }))
    } else {
      annetDokumenter!.forEach((annetDokument: string, index: number) => {
        hasErrors.push(validateAnnetDokument(v, namespace, {
          annetDokument,
          index,
          personName
        }))
      })
    }
  }

  return hasErrors.find(value => value) !== undefined
}
