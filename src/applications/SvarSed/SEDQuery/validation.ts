import { Validation } from 'declarations/types'
import { addError, checkIfNotEmpty } from 'utils/validation'

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

  if (!/^\d+$/.test(saksnummerOrFnr)) {
    return addError(v, {
      id: namespace + '-saksnummerOrFnr',
      message: 'validation:invalidSaksnummerOrFnr'
    })
  }

  return false
}
