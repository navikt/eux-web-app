import { Validation } from 'declarations/types'
import { useState } from 'react'

const useLocalValidation = <ValidationData extends any>(
  validateFunction: (
    newValidation: Validation,
    namespace: string,
    validationData: ValidationData
  ) => boolean,
  namespace: string,
  initialValue: any = {}
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
      namespace,
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
