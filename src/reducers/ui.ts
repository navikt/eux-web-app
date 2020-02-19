import * as types from 'constants/actionTypes'
import { ModalContent } from 'eessi-pensjon-ui/dist/declarations/components'
import { ActionWithPayload } from 'eessi-pensjon-ui/dist/declarations/types'
import { Action } from 'redux'

export interface UiState {
  modal: ModalContent | undefined,
  highContrast: false,
}

export const initialUiState: UiState = {
  modal: undefined,
  highContrast: false
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
