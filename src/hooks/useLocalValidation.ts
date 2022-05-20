import { Validation } from 'declarations/types'
import _ from 'lodash'
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

  const resetValidation = (key: Array<string> | string | undefined = undefined): void => {
    if (key === undefined) {
      setValidation({})
    } else {
      setValidation(_.omit(_validation, key))
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
