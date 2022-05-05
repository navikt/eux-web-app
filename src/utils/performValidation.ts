import { ErrorElement } from 'declarations/app'
import { Validation } from 'declarations/types'
import _ from 'lodash'

const performValidation = <ValidationData extends any>(
  validation: Validation,
  namespace: string,
  validateFunction: (
    validation: Validation,
    namespace: string,
    validationData: ValidationData
  ) => boolean,
  validationData: ValidationData
): [boolean, Validation] => {
  let newValidation: Validation = _.cloneDeep(validation) as Validation

  // clean up the namespace before performing the validation
  newValidation = _.omitBy(newValidation, (value, key) => key.startsWith(namespace)) as Validation

  const hasErrors: boolean = validateFunction(
    newValidation,
    namespace,
    validationData
  )
  newValidation[namespace] = { feilmelding: hasErrors ? 'error' : 'ok' } as ErrorElement

  return [!hasErrors, newValidation]
}

export default performValidation
