import {ActionWithPayload, call} from "@navikt/fetch";
import {CreateSedResponse, FagSaker, JournalfoeringFagSak, Sak} from "../declarations/types";
import * as urls from "../constants/urls";
import * as types from "../constants/actionTypes";
import {Action, ActionCreator} from "redux";
import {mockJournalfoeringFagsaker} from "../mocks/journalfoeringFagsakList";
import mockPerson from "../mocks/person";
import {H001Sed} from "../declarations/sed";
import mockSendSak from "../mocks/sak/sendSak";

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

export const createH001 = (sak: Sak, informasjonTekst: string): ActionWithPayload<any> => ({
  type: types.JOURNALFOERING_H001_CREATE,
  payload: { sak, informasjonTekst }
})

export const createH001SedInRina = (sakId: string, H001: H001Sed | undefined | null): ActionWithPayload => {
  return call({
    method: 'POST',
    url: sprintf(urls.API_SED_CREATE_URL, { rinaSakId: sakId }),
    cascadeFailureError: true,
    expectedPayload: {
      sedId: '123'
    } as CreateSedResponse,
    type: {
      request: types.JOURNALFOERING_H001_CREATE_REQUEST,
      success: types.JOURNALFOERING_H001_CREATE_SUCCESS,
      failure: types.JOURNALFOERING_H001_CREATE_FAILURE
    },
    body: H001
  })
}

export const updateH001SedInRina = (sakId: string, sedId: string, H001: H001Sed | undefined | null): ActionWithPayload => {
  return call({
    method: 'PUT',
    url: sprintf(urls.API_SED_UPDATE_URL, { rinaSakId: sakId, sedId: sedId }),
    cascadeFailureError: true,
    expectedPayload: {
      sedId: '123'
    } as CreateSedResponse,
    type: {
      request: types.JOURNALFOERING_H001_UPDATE_REQUEST,
      success: types.JOURNALFOERING_H001_UPDATE_SUCCESS,
      failure: types.JOURNALFOERING_H001_UPDATE_FAILURE
    },
    body: H001
  })
}

export const sendH001SedInRina = (rinaSakId: string, sedId: string): ActionWithPayload<any> => {
  return call({
    method: 'POST',
    url: sprintf(urls.API_SED_SEND_URL, { rinaSakId, sedId }),
    expectedPayload: {
      success: 'true'
    },
    type: {
      request: types.JOURNALFOERING_H001_SEND_REQUEST,
      success: types.JOURNALFOERING_H001_SEND_SUCCESS,
      failure: types.JOURNALFOERING_H001_SEND_FAILURE
    }
  })
}

export const createHBUC01 = (data: any): ActionWithPayload<any> => {
  const payload = {
    buctype: "H_BUC_01",
    landKode: "NO",
    sedtype: "H001",
    sektor: data.sektor,
    fnr: "",
    institusjonsID: data.institusjonsID
  } as any

  return call({
    url: urls.API_SAK_SEND_URL,
    method: 'POST',
    payload,
    expectedPayload: mockSendSak,
    type: {
      request: types.JOURNALFOERING_H_BUC_01_CREATE_REQUEST,
      success: types.JOURNALFOERING_H_BUC_01_CREATE_SUCCESS,
      failure: types.JOURNALFOERING_H_BUC_01_CREATE_FAILURE
    }
  })
}
