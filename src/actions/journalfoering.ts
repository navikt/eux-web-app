import {ActionWithPayload, call} from "@navikt/fetch";
import {CreateSedResponse, Fagsak, Fagsaker, Sak} from "../declarations/types";
import * as urls from "../constants/urls";
import * as types from "../constants/actionTypes";
import {Action, ActionCreator} from "redux";
import {mockJournalfoeringFagsaker} from "../mocks/journalfoeringFagsakList";
import mockPerson from "../mocks/person";
import {H001Sed} from "../declarations/sed";
import mockSendSak from "../mocks/sak/sendSak";
import mockFagsakGenerell from 'mocks/fagsak_generell'
import {FagsakPayload} from "../declarations/pd";
import mockFagsakDagpenger from "../mocks/fagsak";

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
): ActionWithPayload<Fagsaker> => {
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

export const createJournalfoeringFagsak = (
  fnr: string, tema: string
): ActionWithPayload<Fagsaker> => {
  return call({
    method: 'POST',
    url: sprintf(urls.API_CREATE_FAGSAK_GENERELL_URL, { fnr }),
    body: {
      tema
    },
    expectedPayload: mockFagsakGenerell,
    type: {
      request: types.JOURNALFOERING_CREATE_FAGSAK_GENERELL_REQUEST,
      success: types.JOURNALFOERING_CREATE_FAGSAK_GENERELL_SUCCESS,
      failure: types.JOURNALFOERING_CREATE_FAGSAK_GENERELL_FAILURE
    }
  })
}

export const createJournalfoeringFagsakDagpenger = (
  fnr: string, payload: FagsakPayload
): ActionWithPayload<Fagsaker> => {
  return call({
    method: 'POST',
    url: sprintf(urls.API_PDU1_CREATE_FAGSAK_URL, { fnr }),
    expectedPayload: mockFagsakDagpenger,
    body: payload,
    type: {
      request: types.JOURNALFOERING_CREATE_FAGSAK_DAGPENGER_REQUEST,
      success: types.JOURNALFOERING_CREATE_FAGSAK_DAGPENGER_SUCCESS,
      failure: types.JOURNALFOERING_CREATE_FAGSAK_DAGPENGER_FAILURE
    }
  })
}

export const resetJournalfoeringFagsaker: ActionCreator<Action> = (): Action => ({
  type: types.JOURNALFOERING_FAGSAKER_RESET
})

export const setJournalfoeringFagsak: ActionCreator<Action> = (
  fagsak: Fagsak
): ActionWithPayload<any> => ({
  type: types.JOURNALFOERING_FAGSAK_SET,
  payload: fagsak
})

export const journalfoer = (
  sakId: string, fagsak: Fagsak
): ActionWithPayload => {
  return call({
    method: 'POST',
    url: sprintf(urls.API_RINA_JOURNALFOER_URL, { rinaSakId: sakId }),
    body: fagsak,
    expectedPayload: {
      journalfoert: ["H001 - Melding/Anmoding om informasjon", "X009 - Påminnelse"],
      ikkeJournalfoert: ["H001 - Melding/Anmoding om informasjon", "X009 - Påminnelse"],
      varJournalfoertFeil: ["H001 - Melding/Anmoding om informasjon", "X009 - Påminnelse"],
      tilknyttedeOppgaver: [
        {
          "status": "OPPGAVE_FERDIGSTILT",
          "beskrivelse": "Oppgave 1 ble ferdigstilt"
        },
        {
          "status": "OPPGAVE_FERDIGSTILT",
          "beskrivelse": "Oppgave 2 ble ferdigstilt"
        },
        {
          "status": "FERDIGSTILLING_FEILET",
          "beskrivelse": "Ferdigstilling av oppgave 3 feilet pga. manglende respons fra oppgave-systemet"
        }
      ]
    },
    cascadeFailureError: true,
    type: {
      request: types.JOURNALFOERING_JOURNALFOER_SAK_REQUEST,
      success: types.JOURNALFOERING_JOURNALFOER_SAK_SUCCESS,
      failure: types.JOURNALFOERING_JOURNALFOER_SAK_FAILURE
    }
  })
}

export const createH001 = (sak: Sak, informasjonTekst: string, ytterligereInfo?: string): ActionWithPayload<any> => ({
  type: types.JOURNALFOERING_H001_CREATE,
  payload: { sak, informasjonTekst, ytterligereInfo }
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
    cascadeFailureError: true,
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
    sektor: "HZ",
    sedtype: "H001",
    institusjonsID: data.institusjonsID,
    fnr: "",
  } as any

  return call({
    url: urls.API_SAK_SEND_URL,
    cascadeFailureError: true,
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

export const addRelatedRinaSak = (rinaSakId: string, relatertRinaSakId: string): ActionWithPayload<any> => {
  return call({
    method: 'POST',
    url: sprintf(urls.API_ADD_RELATED_RINASAK_URL, { rinaSakId, relatertRinaSakId }),
    cascadeFailureError: true,
    expectedPayload: {
      success: 'true'
    },
    type: {
      request: types.JOURNALFOERING_ADD_RELATED_RINASAK_REQUEST,
      success: types.JOURNALFOERING_ADD_RELATED_RINASAK_SUCCESS,
      failure: types.JOURNALFOERING_ADD_RELATED_RINASAK_FAILURE
    }
  })
}

export const feilregistrerJournalposter = (rinaSakId: string): ActionWithPayload<any> => {
  return call({
    method: 'POST',
    url: sprintf(urls.API_FEILREGISTRER_JOURNALPOSTER_URL, { rinaSakId }),
    cascadeFailureError: true,
    expectedPayload: {
      bleFeilregistrert: ["H001 - Melding/Anmoding om informasjon", "X009 - Påminnelse"],
      bleIkkeFeilregistrert: ["H001 - Melding/Anmoding om informasjon", "X009 - Påminnelse"]
    },
    type: {
      request: types.JOURNALFOERING_FEILREGISTRER_JOURNALPOSTER_REQUEST,
      success: types.JOURNALFOERING_FEILREGISTRER_JOURNALPOSTER_SUCCESS,
      failure: types.JOURNALFOERING_FEILREGISTRER_JOURNALPOSTER_FAILURE
    }
  })
}
