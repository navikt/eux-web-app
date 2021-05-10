import { setAllValidation } from 'actions/validation'
import { Validation } from 'declarations/types'
import { TFunction } from 'i18next'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'

const useGlobalValidation = <ValidationData extends any>(
  validateFunction: (
    newValidation: Validation,
    t: TFunction,
    validationData: ValidationData
  ) => boolean
): (validationData: ValidationData) => boolean => {

  const { t } = useTranslation()
  const dispatch = useDispatch()

  const performValidation = (validationData: ValidationData): boolean => {
    const newValidation: Validation = {}
    const hasErrors: boolean = validateFunction(
      newValidation,
      t,
      validationData
    )
    dispatch(setAllValidation(newValidation))
    return !hasErrors
  }

  return performValidation
}

export default useGlobalValidation
