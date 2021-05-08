import * as types from 'constants/actionTypes'
import { ActionWithPayload } from 'js-fetch-api'

export interface ValidationState {
  resetValidation: ((key?: string | undefined) => void)
  view: boolean
  status: any
}

export const initialValidationState: ValidationState = {
  resetValidation: () => {},
  view: false,
  status: {}
}

const validationReducer = (state: ValidationState = initialValidationState, action: ActionWithPayload = { type: '', payload: undefined }) => {
  switch (action.type) {

    case types.APP_CLEAN_DATA:
      return initialValidationState

    case types.VALIDATION_ALL_SET:
      return {
        ...state,
        status: (action as ActionWithPayload).payload
      }

    case types.VALIDATION_RESETFUNCTION_SET:
      return {
        ...state,
        resetValidation: (action as ActionWithPayload).payload
      }

    case types.VALIDATION_SET: {
      const { key, value } = (action as ActionWithPayload).payload
      if (!key) {
        return {
          ...state,
          status: {}
        }
      }
      return {
        ...state,
        status: {
          ...state.status,
          [key]: value
        }
      }
    }

    case types.VALIDATION_VIEW:
      return {
        ...state,
        view: true
      }

    default:
      return state
  }
}

export default validationReducer
