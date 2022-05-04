import { Validation } from 'declarations/types'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

const useLocalValidation = <ValidationData extends any>(
  initialValue: any,
  validateFunction: (
    newValidation: Validation,
    validationData: ValidationData
  ) => boolean
): [
    Validation,
    (key?: string | undefined) => void,
    (validationData: ValidationData) => boolean,
    (v: Validation) => void
  ] => {
  const [_validation, setValidation] = useState<Validation>(initialValue)

  const resetValidation = (key: string | undefined = undefined): void => {
    if (!key) {
      setValidation({})
    } else {
      const newValidation = {
        ..._validation,
        [key!]: undefined
      }

      setValidation(newValidation)
    }
  }

  const performValidation = (validationData: ValidationData): boolean => {
    const newValidation: Validation = {}
    const hasErrors: boolean = validateFunction(
      newValidation,
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

export default useLocalValidation
