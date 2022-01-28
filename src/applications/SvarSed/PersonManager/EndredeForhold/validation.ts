import { ReplySed } from 'declarations/sed'
import { Validation } from 'declarations/types'
import _ from 'lodash'
import { TFunction } from 'react-i18next'
import { checkIfNotEmpty, checkLength, propagateError } from 'utils/validation'
import { Velg } from './EndredeForhold'

export interface ValidationEndredeForholdProps {
  replySed: ReplySed
  namespace: string,
  personName: string
}

export const validateEndredeForhold = (
  v: Validation,
  t: TFunction,
  {
    replySed,
    namespace,
    personName
  }: ValidationEndredeForholdProps
): boolean => {
  const hasErrors: Array<boolean> = []

  const where: Velg = !_.isEmpty(_.get(replySed, 'anmodning.info'))
    ? 'anmodning'
    : !_.isEmpty(_.get(replySed, 'melding.info'))
        ? 'melding'
        : undefined

  const needle: string | undefined = where === 'anmodning'
    ? _.get(replySed, 'anmodning.info')
    : where === 'melding'
      ? _.get(replySed, 'melding.info')
      : undefined

  hasErrors.push(checkIfNotEmpty(v, {
    needle: needle,
    id: namespace + '-velg',
    message: 'validation:noVelg',
    personName
  }))

  hasErrors.push(checkLength(v, {
    needle: needle,
    max: 500,
    id: namespace + '-tekst',
    message: 'validation:textOverX',
    personName
  }))

  const hasError: boolean = hasErrors.find(value => value) !== undefined
  if (hasError) propagateError(v, namespace)
  return hasError
}
