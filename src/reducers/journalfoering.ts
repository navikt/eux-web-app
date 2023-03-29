import {JournalfoeringFagSak, JournalfoeringFagSaker} from "../declarations/types";
import {AnyAction} from "redux";
import * as types from "../constants/actionTypes";
import {ActionWithPayload} from "@navikt/fetch";

export interface JournalfoeringState {
  fagsaker: JournalfoeringFagSaker | undefined | null
  fagsak: JournalfoeringFagSak | undefined | null
}

export const initialJournalfoeringState: JournalfoeringState = {
  fagsaker: undefined,
  fagsak: undefined
}

const journalfoeringReducer = (state: JournalfoeringState = initialJournalfoeringState, action: AnyAction): JournalfoeringState => {
  switch (action.type) {
    case types.APP_RESET:
    case types.JOURNALFOERING_RESET:
      return initialJournalfoeringState

    case types.JOURNALFOERING_FAGSAK_RESET:
    case types.JOURNALFOERING_FAGSAKER_RESET:
    case types.JOURNALFOERING_FAGSAKER_REQUEST:
      return {
        ...state,
        fagsaker: undefined,
        fagsak: undefined
      }

    case types.JOURNALFOERING_FAGSAKER_SUCCESS:
      return {
        ...state,
        fagsaker: (action as ActionWithPayload).payload
      }

    case types.JOURNALFOERING_FAGSAKER_FAILURE:
      return {
        ...state,
        fagsaker: null
      }

    case types.JOURNALFOERING_FAGSAK_SET:
      return {
        ...state,
        fagsak: (action as ActionWithPayload).payload
      }


    default:
      return state
  }
}

export default journalfoeringReducer
