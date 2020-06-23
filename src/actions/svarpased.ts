import * as types from "constants/actionTypes";
import * as urls from "constants/urls";
import * as api from "eessi-pensjon-ui/dist/api";
import {
  ActionWithPayload,
  ThunkResult,
} from "eessi-pensjon-ui/dist/declarations/types";
import { ActionCreator } from "redux";
const sprintf = require("sprintf-js").sprintf;

export const getSaksnummer: ActionCreator<ThunkResult<ActionWithPayload>> = (
  saksnummer: string
): ThunkResult<ActionWithPayload> => {
  return api.realCall({
    url: sprintf(urls.API_SVARPASED_SAKSNUMMER_URL, { saksnummer: saksnummer }),
    type: {
      request: types.SVARPASED_SAKSNUMMER_GET_REQUEST,
      success: types.SVARPASED_SAKSNUMMER_GET_SUCCESS,
      failure: types.SVARPASED_SAKSNUMMER_GET_FAILURE,
    },
  });
};

export const getFnummerDnummer: ActionCreator<ThunkResult<
  ActionWithPayload
>> = (fnummerDnummer: string): ThunkResult<ActionWithPayload> => {
  return api.realCall({
    url: sprintf(urls.API_SVARPASED_FNUMMERDNUMMER_URL, {
      fnummerDnummer: fnummerDnummer,
    }),
    type: {
      request: types.SVARPASED_FNUMMERDNUMMER_GET_REQUEST,
      success: types.SVARPASED_FNUMMERDNUMMER_GET_SUCCESS,
      failure: types.SVARPASED_FNUMMERDNUMMER_GET_FAILURE,
    },
  });
};

export const getSed: ActionCreator<ThunkResult<ActionWithPayload>> = (
  sed: string
): ThunkResult<ActionWithPayload> => {
  return api.realCall({
    url: sprintf(urls.API_SVARPASED_SED_URL, {
      sed: sed,
    }),
    type: {
      request: types.SVARPASED_SED_GET_REQUEST,
      success: types.SVARPASED_SED_GET_SUCCESS,
      failure: types.SVARPASED_SED_GET_FAILURE,
    },
  });
};
