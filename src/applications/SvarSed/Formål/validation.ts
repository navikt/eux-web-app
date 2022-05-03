import { Validation } from 'declarations/types'
import { TFunction } from 'react-i18next'
import { checkIfNotEmpty } from 'utils/validation'

export interface ValidationFormålProps {
  formaal: Array<string> | undefined
}

export const validateFormål = (
  v: Validation,
  t: TFunction,
  namespace: string,
  {
    formaal
  }: ValidationFormålProps
): boolean => {
  let hasErrors: Array<boolean> = []

  hasErrors.push(checkIfNotEmpty(v, {
    needle: formaal,
    id: namespace + '-checkbox',
    message: t('validation:noFormaal')
  }))

  return hasErrors.find(value => value) !== undefined
}
