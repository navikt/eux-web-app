import { Validation } from 'declarations/types'
import { TFunction } from 'i18next'
import _ from 'lodash'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

const useValidation = <ValidationData extends any>(
  initialValue: Validation = {},
  validateFunction: (
    newValidation: Validation,
    t: TFunction,
    validationData: ValidationData
  ) => void
): [
    Validation,
    (key: string | undefined) => void,
    (validationData: ValidationData) => boolean
  ] => {

  const { t } = useTranslation()
  const [_validation, setValidation] = useState<Validation>(initialValue)

  const resetValidation = (key: string | undefined): void => {
    if (!key) {
      setValidation({})
    }
    setValidation({
      ..._validation,
      [key!]: undefined
    })
  }

  const hasNoValidationErrors = (validation: Validation): boolean => _.find(validation, (it) => (it !== undefined)) === undefined

  const performValidation = (validationData: ValidationData): boolean => {
    const newValidation: Validation = {}
    validateFunction(
      newValidation,
      t,
      validationData
    )
    setValidation(newValidation)
    return hasNoValidationErrors(newValidation)
  }

  return [
    _validation,
    resetValidation,
    performValidation
  ]
}

export default useValidation
