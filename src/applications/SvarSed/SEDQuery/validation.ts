import { Validation } from 'declarations/types'
import { addError, checkIfNotEmpty } from 'utils/validation'

const UUID_REGEX = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/
const UUID_NO_DASH_REGEX = /^[0-9a-fA-F]{32}$/

export const isInternationalId = (value: string): boolean =>
  UUID_REGEX.test(value) || UUID_NO_DASH_REGEX.test(value)

interface ValidationSEDQueryProps {
  saksnummerOrFnr: string
}

export const validateSEDQuery = (
  v: Validation,
  namespace: string,
  {
    saksnummerOrFnr
  }: ValidationSEDQueryProps
): boolean => {
  const hasError = checkIfNotEmpty(v, {
    needle: saksnummerOrFnr,
    id: namespace + '-saksnummerOrFnr',
    message: 'validation:noSaksnummerOrFnr'
  })
  if (hasError) return hasError

  if (!/^\d+$/.test(saksnummerOrFnr) && !isInternationalId(saksnummerOrFnr)) {
    return addError(v, {
      id: namespace + '-saksnummerOrFnr',
      message: 'validation:invalidSaksnummerOrFnr'
    })
  }

  return false
}
