import * as types from '../constants/actionTypes'
import { ModalContent } from '../declarations/components'
import { ActionWithPayload } from 'js-fetch-api'
import { Action } from 'redux'

export interface UiState {
  highContrast: false,
  modal: ModalContent | undefined
}

export const initialUiState: UiState = {
  highContrast: false,
  modal: undefined
}

const uiReducer = (state: UiState = initialUiState, action: Action | ActionWithPayload) => {
  switch (action.type) {
    case types.UI_MODAL_SET:
      return {
        ...state,
        modal: (action as ActionWithPayload).payload
      }

    case types.UI_HIGHCONTRAST_TOGGLE :

      return {
        ...state,
        highContrast: !state.highContrast
      }

    default:

      return state
  }
}

export default uiReducer
