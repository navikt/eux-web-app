import * as types from 'constants/actionTypes'
import { ModalContent } from 'declarations/components'
import { ActionWithPayload } from '@navikt/fetch'
import { AnyAction } from 'redux'

export interface UiState {
  modal: ModalContent | undefined
  textAreaDirty: boolean
  textFieldDirty: boolean
}

export const initialUiState: UiState = {
  modal: undefined,
  textAreaDirty: false,
  textFieldDirty: false
}

const uiReducer = (state: UiState = initialUiState, action: AnyAction): UiState => {
  switch (action.type) {
    case types.UI_MODAL_SET:
      return {
        ...state,
        modal: (action as ActionWithPayload).payload
      }

    case types.UI_SET_TEXTAREA_DIRTY:
      return {
        ...state,
        textAreaDirty: (action as ActionWithPayload).payload.isDirty
      }

    case types.UI_SET_TEXTFIELD_DIRTY:
      return {
        ...state,
        textFieldDirty: (action as ActionWithPayload).payload.isDirty
      }

    default:
      return state
  }
}

export default uiReducer
