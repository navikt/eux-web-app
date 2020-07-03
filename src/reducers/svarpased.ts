import { ActionWithPayload } from "eessi-pensjon-ui/dist/declarations/types";
import { Action } from "redux";
import * as types from "constants/actionTypes";
import _ from "lodash";

export interface SvarpasedState {
  saksnummer: Array<any> | undefined;
  sed: any;
  person: any;
  personRelatert: any;
  familierelasjoner: Array<any>;
}

export const initialSvarpasedState: SvarpasedState = {
  saksnummer: undefined,
  sed: undefined,
  person: undefined,
  personRelatert: undefined,
  familierelasjoner: [],
};

const svarpasedReducer = (
  state: SvarpasedState = initialSvarpasedState,
  action: Action | ActionWithPayload
) => {
  switch (action.type) {
    case types.SVARPASED_SAKSNUMMER_GET_SUCCESS:
      return {
        ...state,
        saksnummer: (action as ActionWithPayload).payload,
      };


    case types.SVARPASED_SED_GET_SUCCESS:
      return {
        ...state,
        sed: (action as ActionWithPayload).payload,
      };

    case types.SVARPASED_SAKSNUMMER_GET_FAILURE:
      return {
        ...state,
        saksnummer: null,
      };

    case types.SVARPASED_PERSON_GET_FAILURE:
      return {
        ...state,
        person: null,
      };

    case types.SVARPASED_PERSON_GET_SUCCESS:
      return {
        ...state,
        person: (action as ActionWithPayload).payload,
      };

    case types.SVARPASED_SED_GET_FAILURE:
      return {
        ...state,
        sed: null,
      };
    case types.SVARPASED_FAMILIERELASJONER_ADD:
      return {
        ...state,
        familierelasjoner: state.familierelasjoner.concat(
          (action as ActionWithPayload).payload
        ),
      };

    case types.SVARPASED_FAMILIERELASJONER_REMOVE:
      return {
        ...state,
        familierelasjoner: _.filter(
          state.familierelasjoner,
          (i) => i.fnr !== (action as ActionWithPayload).payload.fnr
        ),
      };

    default:
      return state;
  }
};

export default svarpasedReducer;
