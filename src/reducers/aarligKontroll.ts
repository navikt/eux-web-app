import { ActionWithPayload } from '@navikt/fetch'
import * as types from 'constants/actionTypes'
import { FilteredF001Sak, UtkastF001 } from 'declarations/types'
import { AnyAction } from 'redux'

export interface AarligKontrollState {
  filteredF001Saks: Array<FilteredF001Sak> | null | undefined
  utkastF001: UtkastF001 | null | undefined
}

export const initialAarligKontrollState: AarligKontrollState = {
  filteredF001Saks: undefined,
  utkastF001: undefined
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

    case types.AARLIG_KONTROLL_UTKAST_F001_REQUEST:
      return {
        ...state,
        utkastF001: undefined
      }

    case types.AARLIG_KONTROLL_UTKAST_F001_SUCCESS:
      return {
        ...state,
        utkastF001: (action as ActionWithPayload).payload
      }

    case types.AARLIG_KONTROLL_UTKAST_F001_FAILURE:
      return {
        ...state,
        utkastF001: null
      }

    case types.AARLIG_KONTROLL_UTKAST_F001_RESET:
      return {
        ...state,
        utkastF001: undefined
      }

    default:
      return state
  }
}

export default aarligKontrollReducer
