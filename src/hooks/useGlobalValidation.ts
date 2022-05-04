import { setValidation } from 'actions/validation'
import { ErrorElement } from 'declarations/app'
import { Validation } from 'declarations/types'
import _ from 'lodash'
import { useAppDispatch, useAppSelector } from 'store'

const useGlobalValidation = <ValidationData extends any>(
  validateFunction: (
    newValidation: Validation,
    namespace: string,
    validationData: ValidationData
  ) => boolean,
  namespace: string
): (validationData: ValidationData) => boolean => {
  const dispatch = useAppDispatch()
  const validation = useAppSelector(state => state.validation.status)

  const performValidation = (validationData: ValidationData): boolean => {
    let newValidation: Validation = _.cloneDeep(validation) as Validation

    // clean up the namespace before performing the validation
    newValidation = _.omitBy(newValidation, (value, key) => key.startsWith(namespace)) as Validation

    const hasErrors: boolean = validateFunction(
      newValidation,
      namespace,
      validationData
    )
    newValidation[namespace] = { feilmelding: hasErrors ? 'error' : 'ok' } as ErrorElement
    dispatch(setValidation(newValidation))
    return !hasErrors
  }

  return performValidation
}

export default useGlobalValidation
