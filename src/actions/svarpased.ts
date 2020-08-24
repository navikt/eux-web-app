import * as types from "constants/actionTypes";
import * as urls from "constants/urls";
import { realCall, ActionWithPayload, ThunkResult } from "js-fetch-api";
import { Action, ActionCreator } from "redux";
import {
  Arbeidsforholdet,
  FamilieRelasjon,
  Inntekter,
} from "declarations/types";
import { SvarpasedState } from "reducers/svarpased";

const sprintf = require("sprintf-js").sprintf;

export const getSaksnummer: ActionCreator<ThunkResult<ActionWithPayload>> = (
  saksnummer: string
): ThunkResult<ActionWithPayload> => {
  return realCall({
    url: sprintf(urls.API_SVARPASED_SAKSNUMMER_URL, { saksnummer: saksnummer }),
    type: {
      request: types.SVARPASED_SAKSNUMMER_GET_REQUEST,
      success: types.SVARPASED_SAKSNUMMER_GET_SUCCESS,
      failure: types.SVARPASED_SAKSNUMMER_GET_FAILURE,
    },
  });
};

export const getSed: ActionCreator<ThunkResult<ActionWithPayload>> = (
  sed: string
): ThunkResult<ActionWithPayload> => {
  return realCall({
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

export const getPerson: ActionCreator<ThunkResult<ActionWithPayload>> = (
  fnr: string
): ThunkResult<ActionWithPayload> => {
  return realCall({
    url: sprintf(urls.API_SVARPASED_PERSON_URL, { fnr: fnr }),
    cascadeFailureError: true,
    type: {
      request: types.SVARPASED_PERSON_GET_REQUEST,
      success: types.SVARPASED_PERSON_GET_SUCCESS,
      failure: types.SVARPASED_PERSON_GET_FAILURE,
    },
  });
};

export const getPersonRelated: ActionCreator<ThunkResult<ActionWithPayload>> = (
  fnr: string
): ThunkResult<ActionWithPayload> => {
  return realCall({
    url: sprintf(urls.API_SVARPASED_PERSON_URL, { fnr: fnr }),
    cascadeFailureError: true,
    context: {
      fnr: fnr,
    },
    type: {
      request: types.SVARPASED_PERSON_RELATERT_GET_REQUEST,
      success: types.SVARPASED_PERSON_RELATERT_GET_SUCCESS,
      failure: types.SVARPASED_PERSON_RELATERT_GET_FAILURE,
    },
  });
};

export const addFamilierelasjoner: ActionCreator<ActionWithPayload> = (
  payload: FamilieRelasjon
): ActionWithPayload => ({
  type: types.SVARPASED_FAMILIERELASJONER_ADD,
  payload: payload,
});

export const removeFamilierelasjoner: ActionCreator<ActionWithPayload> = (
  payload: FamilieRelasjon
): ActionWithPayload => ({
  type: types.SVARPASED_FAMILIERELASJONER_REMOVE,
  payload: payload,
});

export const resetPersonRelatert: ActionCreator<Action> = (): Action => ({
  type: types.SVARPASED_PERSON_RELATERT_RESET,
});

export const sendSvarPaSedData: ActionCreator<ThunkResult<
  ActionWithPayload
>> = (payload: SvarpasedState): ThunkResult<ActionWithPayload> => {
  return realCall({
    method: "POST",
    url: sprintf(urls.API_SVARPASED_SENDSVARPASEDDATA_POST_URL, {
      payload: payload,
    }),
    type: {
      request: types.SVARPASED_SENDSVARPASEDDATA_POST_REQUEST,
      success: types.SVARPASED_SENDSVARPASEDDATA_POST_SUCCESS,
      failure: types.SVARPASED_SENDSVARPASEDDATA_POST_FAILURE,
    },
  });
};

export const getArbeidsforhold: ActionCreator<ThunkResult<
  ActionWithPayload
>> = (fnr: string): ThunkResult<ActionWithPayload> => {
  return realCall({
    url: sprintf(urls.API_SAK_ARBEIDSFORHOLD_URL, { fnr: fnr }),
    type: {
      request: types.SVARPASED_ARBEIDSFORHOLD_GET_REQUEST,
      success: types.SVARPASED_ARBEIDSFORHOLD_GET_SUCCESS,
      failure: types.SVARPASED_ARBEIDSFORHOLD_GET_FAILURE,
    },
  });
};

export const addArbeidsforhold: ActionCreator<ActionWithPayload> = (
  payload: Arbeidsforholdet
): ActionWithPayload => ({
  type: types.SVARPASED_ARBEIDSFORHOLD_ADD,
  payload: payload,
});

export const removeArbeidsforhold: ActionCreator<ActionWithPayload> = (
  payload: Arbeidsforholdet
): ActionWithPayload => ({
  type: types.SVARPASED_ARBEIDSFORHOLD_REMOVE,
  payload: payload,
});

export const fetchInntekt: ActionCreator<ThunkResult<ActionWithPayload>> = (
  data: any
): ThunkResult<ActionWithPayload> => {
  return realCall({
    url: sprintf(urls.API_SAK_INNTEKT_URL, {
      fnr: data.fnr,
      fraDato: data.fraDato,
      tilDato: data.tilDato,
      tema: data.tema,
    }),
    method: "GET",
    type: {
      request: types.SVARPASED_INNTEKT_GET_REQUEST,
      success: types.SVARPASED_INNTEKT_GET_SUCCESS,
      failure: types.SVARPASED_INNTEKT_GET_FAILURE,
    },
  });
};

export const sendSeletedInntekt: ActionCreator<ActionWithPayload> = (
  payload: Inntekter
): ActionWithPayload => ({
  type: types.SVARPASED_SELECTED_INNTEKT_SUCCESS,
  payload: payload,
});

/*
export const sendSeletedInntekt: ActionCreator<ThunkResult<
  ActionWithPayload
>> = (payload: Inntekt): ThunkResult<ActionWithPayload> => {
  return realCall({
    method: "POST",
    type: {
      request: types.SVARPASED_SELECTED_INNTEKT_REQUEST,
      success: types.SVARPASED_SELECTED_INNTEKT_SUCCESS,
      failure: types.SVARPASED_SELECTED_INNTEKT_FAILURE,
    },
    payload: payload,
  });
};
*/
/*
export const createSak: ActionCreator<ThunkResult<ActionWithPayload>> = (data: any): ThunkResult<ActionWithPayload> => {

  return realCall({
    url: urls.API_SAK_SEND_POST_URL,
    method: 'POST',
    payload: payload,
    type: {
      request: types.SAK_SEND_POST_REQUEST,
      success: types.SAK_SEND_POST_SUCCESS,
      failure: types.SAK_SEND_POST_FAILURE
    }
  })
}
*/
/*
export const getSaksnummer: ActionCreator<ThunkResult<ActionWithPayload>> = (
  saksnummer: string
): ThunkResult<ActionWithPayload> => {
  return realCall({
    url: sprintf(urls.API_SVARPASED_SAKSNUMMER_URL, { saksnummer: saksnummer }),
    type: {
      request: types.SVARPASED_SAKSNUMMER_GET_REQUEST,
      success: types.SVARPASED_SAKSNUMMER_GET_SUCCESS,
      failure: types.SVARPASED_SAKSNUMMER_GET_FAILURE,
    },
  });
};*/
