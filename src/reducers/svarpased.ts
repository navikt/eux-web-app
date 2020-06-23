import { ActionWithPayload } from "eessi-pensjon-ui/dist/declarations/types";
import { Action } from "redux";
import * as types from "constants/actionTypes";

export interface SvarpasedState {
  saksnummer: Array<any> | undefined;
  fnummerDnummer: any;
  sed: any;
}

export const initialSvarpasedState: SvarpasedState = {
  saksnummer: undefined,
  fnummerDnummer: undefined,
  sed: undefined,
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

    case types.SVARPASED_FNUMMERDNUMMER_GET_SUCCESS:
      return {
        ...state,
        fnummerDnummer: (action as ActionWithPayload).payload,
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

    case types.SVARPASED_FNUMMERDNUMMER_GET_FAILURE:
      return {
        ...state,
        fnummerDnummer: null,
      };

    case types.SVARPASED_SED_GET_FAILURE:
      return {
        ...state,
        sed: null,
      };

    default:
      return state;
  }
};

export default svarpasedReducer;
