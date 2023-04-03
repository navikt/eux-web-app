import {ActionWithPayload, call} from "@navikt/fetch";
import {FagSaker, JournalfoeringFagSak} from "../declarations/types";
import * as urls from "../constants/urls";
import * as types from "../constants/actionTypes";
import {Action, ActionCreator} from "redux";
import {mockJournalfoeringFagsaker} from "../mocks/journalfoeringFagsakList";
import mockPerson from "../mocks/person";

const sprintf = require('sprintf-js').sprintf

export const journalfoeringReset: ActionCreator<Action> = (): Action => ({
  type: types.JOURNALFOERING_RESET
})

export const resetJournalfoeringPerson: ActionCreator<Action> = () => ({
  type: types.JOURNALFOERING_PERSON_SEARCH_RESET
})


export const searchJournalfoeringPerson = (
  fnr: string
): ActionWithPayload => {
  return call({
    url: sprintf(urls.API_PERSONER_URL, { fnr }),
    expectedPayload: mockPerson,
    cascadeFailureError: true,
    type: {
      request: types.JOURNALFOERING_PERSON_SEARCH_REQUEST,
      success: types.JOURNALFOERING_PERSON_SEARCH_SUCCESS,
      failure: types.JOURNALFOERING_PERSON_SEARCH_FAILURE
    }
  })
}

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

export const journalfoer = (
  sakId: string, fagsak: JournalfoeringFagSak
): ActionWithPayload => {
  return call({
    method: 'POST',
    url: sprintf(urls.API_RINA_JOURNALFOER_URL, { rinaSakId: sakId }),
    body: fagsak,
    expectedPayload: {
      journalfoert: ["1234567", "9876543"],
      ikkeJournalfoert: ["1234567", "9876543"],
      varJournalfoertFeil: ["1234567", "9876543"]
    },
    cascadeFailureError: true,
    type: {
      request: types.JOURNALFOERING_JOURNALFOER_SAK_REQUEST,
      success: types.JOURNALFOERING_JOURNALFOER_SAK_SUCCESS,
      failure: types.JOURNALFOERING_JOURNALFOER_SAK_FAILURE
    }
  })
}
