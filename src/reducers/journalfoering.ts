import {
  JournalfoeringFagSak,
  JournalfoeringFagSaker,
  JournalfoeringLogg,
  Person,
  Sak,
  Sed
} from "../declarations/types";
import {AnyAction} from "redux";
import * as types from "../constants/actionTypes";
import {ActionWithPayload} from "@navikt/fetch";
import {H001Sed, Kjoenn} from "../declarations/sed";

export interface JournalfoeringState {
  person: Person | null | undefined
  fagsaker: JournalfoeringFagSaker | undefined | null
  fagsak: JournalfoeringFagSak | undefined | null
  journalfoeringLogg: JournalfoeringLogg | undefined | null
  h001: H001Sed | undefined | null
}

export const initialJournalfoeringState: JournalfoeringState = {
  person: undefined,
  fagsaker: undefined,
  fagsak: undefined,
  journalfoeringLogg: undefined,
  h001: undefined
}

const createH001= <T>(sak: Sak, text: string): T => {
  const personInfo = {
    fornavn: sak.fornavn,
    etternavn: sak.etternavn,
    kjoenn: sak.kjoenn as Kjoenn,
    foedselsdato: sak.foedselsdato,
    statsborgerskap: [{ land: 'NO' }],
    pin: [{
      land: 'NO',
      identifikator: sak.fnr
    }]
  }

  return {
    sedType: "H001",
    sedVersjon: '4.2',
    sak,
    sed: {
      sedType: "H001",
      status: 'new'
    } as Sed,
    bruker: { personInfo },
    anmodning: {
      dokumentasjon: {
        informasjon: text
      }
    }
  } as unknown as T
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

    case types.JOURNALFOERING_H001_CREATE:
      const sak = (action as ActionWithPayload).payload.sak
      const text = (action as ActionWithPayload).payload.text
      const h001: H001Sed = createH001<H001Sed>(sak, text)
      return {
        ...state,
        h001
      }

    default:
      return state
  }
}

export default journalfoeringReducer
