import { Validation } from 'declarations/types'
import { getIdx } from 'utils/namespace'
import { checkIfNotEmpty } from 'utils/validation'
import { KeyAndYtelse } from './KeyAndYtelse'

export interface ValidationKeyAndYtelseProps {
  keyAndYtelse: KeyAndYtelse
  index?: number
}

export const validateKeyAndYtelse = (
  v: Validation,
  namespace: string,
  {
    keyAndYtelse,
    index
  }: ValidationKeyAndYtelseProps
): boolean => {
  const hasErrors: Array<boolean> = []
  const idx = getIdx(index)

  hasErrors.push(checkIfNotEmpty(v, {
    needle: keyAndYtelse?.fullKey,
    id: namespace + '-keyandytelse' + idx + '-key',
    message: 'validation:noNavn'
  }))

  hasErrors.push(checkIfNotEmpty(v, {
    needle: keyAndYtelse?.ytelseNavn,
    id: namespace + '-keyandytelse' + idx + '-ytelseNavn',
    message: 'validation:noBetegnelsePåYtelse'
  }))

  return hasErrors.find(value => value) !== undefined
}
