import { Validation } from 'declarations/types'
import { checkIfNotEmpty } from 'utils/validation'

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
  return checkIfNotEmpty(v, {
    needle: saksnummerOrFnr,
    id: namespace + '-saksnummerOrFnr',
    message: 'validation:noSaksnummerOrFnr'
  })
}
