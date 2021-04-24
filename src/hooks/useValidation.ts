import { Validation } from 'declarations/types'
import { TFunction } from 'i18next'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

const useValidation = <ValidationData extends any>(
  initialValue: Validation = {},
  validateFunction: (
    newValidation: Validation,
    t: TFunction,
    validationData: ValidationData
  ) => boolean
): [
    Validation,
    (key?: string | undefined) => void,
    (validationData: ValidationData) => boolean,
    (v: Validation) => void
  ] => {
  const { t } = useTranslation()
  const [_validation, setValidation] = useState<Validation>(initialValue)

  const resetValidation = (key: string | undefined = undefined): void => {
    if (!key) {
      setValidation({})
    }
    setValidation({
      ..._validation,
      [key!]: undefined
    })
  }

  const performValidation = (validationData: ValidationData): boolean => {
    const newValidation: Validation = {}
    const hasErrors: boolean = validateFunction(
      newValidation,
      t,
      validationData
    )
    setValidation(newValidation)
    return !hasErrors
  }

  return [
    _validation,
    resetValidation,
    performValidation,
    setValidation
  ]
}

export default useValidation
