import {
  JournalfoeringFagSak,
  JournalfoeringFagSaker,
  JournalfoeringLogg,
  Person,
  Sak
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
  H001: H001Sed | undefined | null
  H001Id: string | undefined | null
  sendH001Response: any | undefined | null
}

export const initialJournalfoeringState: JournalfoeringState = {
  person: undefined,
  fagsaker: undefined,
  fagsak: undefined,
  journalfoeringLogg: undefined,
  H001: undefined,
  H001Id: undefined,
  sendH001Response: undefined
}

const createH001= <T>(sak: Sak, informasjonTekst: string): T => {
  const personInfo = {
    fornavn: sak.fornavn,
    etternavn: sak.etternavn,
    kjoenn: sak.kjoenn as Kjoenn,
    foedselsdato: sak.foedselsdato,
  }

  return {
    sedType: "H001",
    sedVersjon: '4.2',
    bruker: { personInfo },
    anmodning: {
      dokumentasjon: {
        informasjon: informasjonTekst
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
      const informasjonTekst = (action as ActionWithPayload).payload.informasjonTekst
      console.log(informasjonTekst)
      const H001Sed: H001Sed = createH001<H001Sed>(sak, informasjonTekst)
      console.log(H001Sed)
      return {
        ...state,
        H001: H001Sed
      }

    case types.JOURNALFOERING_H001_CREATE_REQUEST:
      return {
        ...state,
        H001Id: undefined
      }

    case types.JOURNALFOERING_H001_CREATE_SUCCESS:
      return {
        ...state,
        H001Id: (action as ActionWithPayload).payload.sedId
      }

    case types.JOURNALFOERING_H001_CREATE_FAILURE:
      return {
        ...state,
        H001Id: null
      }

    case types.JOURNALFOERING_H001_SEND_REQUEST:
      return {
        ...state,
        sendH001Response: undefined
      }

    case types.JOURNALFOERING_H001_SEND_SUCCESS:
      return {
        ...state,
        sendH001Response: (action as ActionWithPayload).payload
      }

    case types.JOURNALFOERING_H001_SEND_FAILURE:
      return {
        ...state,
        sendH001Response: null
      }

    default:
      return state
  }
}

export default journalfoeringReducer
