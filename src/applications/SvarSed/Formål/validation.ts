import { Validation } from 'declarations/types'
import { checkIfNotEmpty } from 'utils/validation'

export interface ValidationFormålProps {
  formaal: Array<string> | undefined
}

export const validateFormål = (
  v: Validation,
  namespace: string,
  {
    formaal
  }: ValidationFormålProps
): boolean => {
  const hasErrors: Array<boolean> = []

  hasErrors.push(checkIfNotEmpty(v, {
    needle: formaal,
    id: namespace + '-checkbox',
    message: 'validation:noFormaal'
  }))

  return hasErrors.find(value => value) !== undefined
}
