import {
  Fagsak,
  Fagsaker,
  FeilregistrerJournalposterLogg,
  JournalfoeringLogg,
  Person,
  Sak
} from "../declarations/types";
import {AnyAction} from "redux";
import * as types from "../constants/actionTypes";
import {ActionWithPayload} from "@navikt/fetch";
import {H001Sed, Kjoenn} from "../declarations/sed";
import _ from "lodash";


export interface JournalfoeringState {
  person: Person | null | undefined
  fagsaker: Fagsaker | undefined | null
  fagsak: Fagsak | undefined | null
  journalfoeringLogg: JournalfoeringLogg | undefined | null
  feilregistrerJournalposterLogg: FeilregistrerJournalposterLogg | undefined | null
  H001: H001Sed | undefined | null
  H001Id: string | undefined | null
  sendH001Response: any | undefined | null
  createdHBUC01: any | undefined | null
  addedRelatertRinaSak: any | undefined | null
}

export const initialJournalfoeringState: JournalfoeringState = {
  person: undefined,
  fagsaker: undefined,
  fagsak: undefined,
  journalfoeringLogg: undefined,
  feilregistrerJournalposterLogg: undefined,
  H001: undefined,
  H001Id: undefined,
  sendH001Response: undefined,
  createdHBUC01: undefined,
  addedRelatertRinaSak: undefined
}

const createH001= <T>(sak: Sak, informasjonTekst: string, ytterligereInfo?: string): T => {
  const personInfo = {
    fornavn: sak.fornavn ? sak.fornavn : "XX",
    etternavn: sak.etternavn ? sak.etternavn : "XX",
    kjoenn: sak.kjoenn ? sak.kjoenn as Kjoenn : "U",
    foedselsdato: sak.foedselsdato ? sak.foedselsdato : "1900-01-01",
  }

  let h001Sed = {
    sedType: "H001",
    sedVersjon: '4.2',
    bruker: { personInfo },
    anmodning: {
      dokumentasjon: {
        informasjon: informasjonTekst
      }
    }
  } as unknown as T

  if(ytterligereInfo){
    return {
      ...h001Sed,
      ytterligereInfoType: "melding_om_mer_informasjon",
      ytterligereInfo: ytterligereInfo
    }
  } else {
    return h001Sed
  }

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

    case types.JOURNALFOERING_CREATE_FAGSAK_GENERELL_REQUEST:
    case types.JOURNALFOERING_CREATE_FAGSAK_DAGPENGER_REQUEST:
      return {
        ...state,
        fagsak: undefined
      }

    case types.JOURNALFOERING_CREATE_FAGSAK_GENERELL_SUCCESS:
      return {
        ...state,
        fagsaker: [(action as ActionWithPayload).payload],
        fagsak: (action as ActionWithPayload).payload
      }

    case types.JOURNALFOERING_CREATE_FAGSAK_DAGPENGER_SUCCESS:
      const fagsak:Fagsak = (action as ActionWithPayload).payload
      let fSaker = _.cloneDeep(state.fagsaker)
      fSaker?.unshift(fagsak)

      return {
        ...state,
        fagsaker: fSaker,
        fagsak: fagsak
      }

    case types.JOURNALFOERING_CREATE_FAGSAK_GENERELL_FAILURE:
    case types.JOURNALFOERING_CREATE_FAGSAK_DAGPENGER_FAILURE:
      return {
        ...state,
        fagsaker: null,
        fagsak: null
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
      const ytterligereInfo = (action as ActionWithPayload).payload.ytterligereInfo
      const H001Sed: H001Sed = createH001<H001Sed>(sak, informasjonTekst, ytterligereInfo)
      return {
        ...state,
        H001: H001Sed
      }

    case types.JOURNALFOERING_H001_CREATE_REQUEST:
    case types.JOURNALFOERING_H001_UPDATE_REQUEST:
      return {
        ...state,
        H001Id: undefined
      }

    case types.JOURNALFOERING_H001_CREATE_SUCCESS:
    case types.JOURNALFOERING_H001_UPDATE_SUCCESS:
      return {
        ...state,
        H001Id: (action as ActionWithPayload).payload.sedId
      }

    case types.JOURNALFOERING_H001_CREATE_FAILURE:
    case types.JOURNALFOERING_H001_UPDATE_FAILURE:
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

    case types.JOURNALFOERING_H_BUC_01_CREATE_REQUEST:
      return {
        ...state,
        createdHBUC01: undefined
      }

    case types.JOURNALFOERING_H_BUC_01_CREATE_SUCCESS:
      return {
        ...state,
        createdHBUC01: (action as ActionWithPayload).payload
      }

    case types.JOURNALFOERING_H_BUC_01_CREATE_FAILURE:
      return {
        ...state,
        createdHBUC01: null
      }

    case types.JOURNALFOERING_ADD_RELATED_RINASAK_REQUEST:
      return {
        ...state,
        addedRelatertRinaSak: undefined
      }

    case types.JOURNALFOERING_ADD_RELATED_RINASAK_SUCCESS:
      return {
        ...state,
        addedRelatertRinaSak: true
      }

    case types.JOURNALFOERING_ADD_RELATED_RINASAK_FAILURE:
      return {
        ...state,
        addedRelatertRinaSak: null
      }

    case types.JOURNALFOERING_FEILREGISTRER_JOURNALPOSTER_REQUEST:
      return {
        ...state,
        feilregistrerJournalposterLogg: undefined
      }

    case types.JOURNALFOERING_FEILREGISTRER_JOURNALPOSTER_SUCCESS:
      return {
        ...state,
        feilregistrerJournalposterLogg: (action as ActionWithPayload).payload
      }

    case types.JOURNALFOERING_FEILREGISTRER_JOURNALPOSTER_FAILURE:
      return {
        ...state,
        feilregistrerJournalposterLogg: null
      }

    default:
      return state
  }
}

export default journalfoeringReducer
