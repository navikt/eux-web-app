import * as types from 'constants/actionTypes'
import { ActionWithPayload } from '@navikt/fetch'

export interface ValidationState {
  view: boolean
  status: any
}

export const initialValidationState: ValidationState = {
  view: false,
  status: {}
}

const validationReducer = (state: ValidationState = initialValidationState, action: ActionWithPayload = { type: '', payload: undefined }): ValidationState => {
  switch (action.type) {
    case types.APP_CLEAN_DATA:
      return initialValidationState

    case types.VALIDATION_ALL_SET:
      return {
        ...state,
        status: (action as ActionWithPayload).payload
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
