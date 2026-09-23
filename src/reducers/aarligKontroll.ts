import { ActionWithPayload } from '@navikt/fetch'
import * as types from 'constants/actionTypes'
import { F001SakSearchContext, FilteredF001Sak, UtkastF001 } from 'declarations/types'
import { AnyAction } from 'redux'

export interface AarligKontrollState {
  filteredF001Saks: Array<FilteredF001Sak> | null | undefined
  /** context of the search that produced `filteredF001Saks`, so a late response for a previous fnr can be ignored */
  filteredF001SaksContext: F001SakSearchContext | undefined
  utkastF001: UtkastF001 | null | undefined
}

export const initialAarligKontrollState: AarligKontrollState = {
  filteredF001Saks: undefined,
  filteredF001SaksContext: undefined,
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
        filteredF001Saks: (action as ActionWithPayload).payload,
        filteredF001SaksContext: (action as ActionWithPayload).context as F001SakSearchContext
      }

    case types.AARLIG_KONTROLL_FILTERED_F001_SAK_FAILURE:
      return {
        ...state,
        filteredF001Saks: null,
        filteredF001SaksContext: (action as ActionWithPayload).context as F001SakSearchContext
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
