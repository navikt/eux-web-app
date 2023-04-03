import {JournalfoeringFagSak, JournalfoeringFagSaker, JournalfoeringLogg, Person} from "../declarations/types";
import {AnyAction} from "redux";
import * as types from "../constants/actionTypes";
import {ActionWithPayload} from "@navikt/fetch";

export interface JournalfoeringState {
  person: Person | null | undefined
  fagsaker: JournalfoeringFagSaker | undefined | null
  fagsak: JournalfoeringFagSak | undefined | null
  journalfoeringLogg: JournalfoeringLogg | undefined | null
}

export const initialJournalfoeringState: JournalfoeringState = {
  person: undefined,
  fagsaker: undefined,
  fagsak: undefined,
  journalfoeringLogg: undefined
}

const journalfoeringReducer = (state: JournalfoeringState = initialJournalfoeringState, action: AnyAction): JournalfoeringState => {
  switch (action.type) {
    case types.APP_RESET:
    case types.JOURNALFOERING_RESET:
      return initialJournalfoeringState

    case types.JOURNALFOERING_PERSON_SEARCH_RESET:
    case types.JOURNALFOERING_PERSON_SEARCH_REQUEST:
      return {
        ...state,
        person: undefined
      }

    case types.JOURNALFOERING_PERSON_SEARCH_SUCCESS:
      return {
        ...state,
        person: (action as ActionWithPayload).payload
      }

    case types.JOURNALFOERING_PERSON_SEARCH_FAILURE:
      return {
        ...state,
        person: null
      }


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

    case types.JOURNALFOERING_JOURNALFOER_SAK_REQUEST:
      return {
        ...state,
        journalfoeringLogg: undefined
      }

    case types.JOURNALFOERING_JOURNALFOER_SAK_SUCCESS:
      return {
        ...state,
        journalfoeringLogg: (action as ActionWithPayload).payload
      }

    case types.JOURNALFOERING_JOURNALFOER_SAK_FAILURE:
      return {
        ...state,
        journalfoeringLogg: null
      }


    default:
      return state
  }
}

export default journalfoeringReducer
