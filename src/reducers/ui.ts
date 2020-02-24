import * as types from 'constants/actionTypes'
import { ActionWithPayload } from 'eessi-pensjon-ui/dist/declarations/types'
import { Action } from 'redux'

export interface UiState {
  highContrast: false,
}

export const initialUiState: UiState = {
  highContrast: false
}

const uiReducer = (state: UiState = initialUiState, action: Action | ActionWithPayload) => {
  switch (action.type) {
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
