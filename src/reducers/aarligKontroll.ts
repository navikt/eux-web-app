import { ActionWithPayload } from '@navikt/fetch'
import * as types from 'constants/actionTypes'
import { Sed } from 'declarations/types'
import { AnyAction } from 'redux'

export interface AarligKontrollState {
  f001s: Array<Sed> | null | undefined
}

export const initialAarligKontrollState: AarligKontrollState = {
  f001s: undefined
}

const aarligKontrollReducer = (
  state: AarligKontrollState = initialAarligKontrollState,
  action: AnyAction
): AarligKontrollState => {
  switch (action.type) {
    case types.APP_RESET:
    case types.AARLIG_KONTROLL_F001_SEARCH_RESET:
    case types.AARLIG_KONTROLL_F001_SEARCH_REQUEST:
      return initialAarligKontrollState

    case types.AARLIG_KONTROLL_F001_SEARCH_SUCCESS:
      return {
        ...state,
        f001s: (action as ActionWithPayload).payload
      }

    case types.AARLIG_KONTROLL_F001_SEARCH_FAILURE:
      return {
        ...state,
        f001s: null
      }

    default:
      return state
  }
}

export default aarligKontrollReducer
