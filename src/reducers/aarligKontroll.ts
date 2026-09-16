import { ActionWithPayload } from '@navikt/fetch'
import * as types from 'constants/actionTypes'
import { FilteredF001Sak } from 'declarations/types'
import { AnyAction } from 'redux'

export interface AarligKontrollState {
  filteredF001Saks: Array<FilteredF001Sak> | null | undefined
}

export const initialAarligKontrollState: AarligKontrollState = {
  filteredF001Saks: undefined
}

const aarligKontrollReducer = (
  state: AarligKontrollState = initialAarligKontrollState,
  action: AnyAction
): AarligKontrollState => {
  switch (action.type) {
    case types.APP_RESET:
    case types.AARLIG_KONTROLL_FILTERED_F001_SAK_RESET:
    case types.AARLIG_KONTROLL_FILTERED_F001_SAK_REQUEST:
      return initialAarligKontrollState

    case types.AARLIG_KONTROLL_FILTERED_F001_SAK_SUCCESS:
      return {
        ...state,
        filteredF001Saks: (action as ActionWithPayload).payload
      }

    case types.AARLIG_KONTROLL_FILTERED_F001_SAK_FAILURE:
      return {
        ...state,
        filteredF001Saks: null
      }

    default:
      return state
  }
}

export default aarligKontrollReducer
