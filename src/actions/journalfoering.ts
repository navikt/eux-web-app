import {ActionWithPayload, call} from "@navikt/fetch";
import {FagSaker, JournalfoeringFagSak} from "../declarations/types";
import * as urls from "../constants/urls";
import * as types from "../constants/actionTypes";
import {Action, ActionCreator} from "redux";
import {mockJournalfoeringFagsaker} from "../mocks/journalfoeringFagsakList";

const sprintf = require('sprintf-js').sprintf

export const jounalfoeringReset: ActionCreator<Action> = (): Action => ({
  type: types.JOURNALFOERING_RESET
})

export const getJournalfoeringFagsaker = (
  fnr: string, tema: string
): ActionWithPayload<FagSaker> => {
  return call({
    url: sprintf(urls.API_GET_FAGSAKER_URL, { fnr, tema }),
    expectedPayload: mockJournalfoeringFagsaker(),
    type: {
      request: types.JOURNALFOERING_FAGSAKER_REQUEST,
      success: types.JOURNALFOERING_FAGSAKER_SUCCESS,
      failure: types.JOURNALFOERING_FAGSAKER_FAILURE
    }
  })
}

export const resetJournalfoeringFagsaker: ActionCreator<Action> = (): Action => ({
  type: types.JOURNALFOERING_FAGSAKER_RESET
})

export const setJournalfoeringFagsak: ActionCreator<Action> = (
  fagsak: JournalfoeringFagSak
): ActionWithPayload<any> => ({
  type: types.JOURNALFOERING_FAGSAK_SET,
  payload: fagsak
})
