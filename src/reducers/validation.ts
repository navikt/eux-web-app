import * as types from 'constants/actionTypes'
import { ActionWithPayload } from '@navikt/fetch'
import { AnyAction } from 'redux'
import { filterAllWithNamespace } from 'utils/validation'

export interface ValidationState {
  status: any
}

export const initialValidationState: ValidationState = {
  status: {}
}

const validationReducer = (state: ValidationState = initialValidationState, action: AnyAction): ValidationState => {
  switch (action.type) {
    case types.APP_CLEAN:
      return initialValidationState

    case types.VALIDATION_RESET: {
      const { key } = (action as ActionWithPayload).payload
      if (!key) {
        return {
          ...state,
          status: {}
        }
      }

      return {
        ...state,
        status: filterAllWithNamespace(state.status, key)
      }
    }

    case types.VALIDATION_SET:
      return {
        ...state,
        status: (action as ActionWithPayload).payload
      }

    default:
      return state
  }
}

export default validationReducer
