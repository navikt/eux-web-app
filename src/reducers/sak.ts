import * as types from 'constants/actionTypes'
import { Arbeidsforhold, BucTyper, FagSaker, Kodemaps, Kodeverk, OpprettetSak, Tema } from 'declarations/types'
import { ActionWithPayload } from 'eessi-pensjon-ui/dist/declarations/types'

export interface SakState {
  arbeidsforhold: Arbeidsforhold | undefined;
  fagsaker: FagSaker | undefined | null;
  institusjoner: any;
  person: any;
  opprettetSak: OpprettetSak | undefined;
  personRelatert: any;

  // comes from eessi-kodeverk
  buctyper: BucTyper | undefined;
  familierelasjoner: Array<Kodeverk> | undefined;
  kjoenn: Array<Kodeverk> | undefined;
  landkoder: Array<Kodeverk> | undefined;
  sektor: Array<Kodeverk> | undefined;
  sedtyper: Array<Kodeverk> | undefined;
  tema: Tema | undefined;
  kodemaps: Kodemaps | undefined;
}

export const initialSakState: SakState = {
  arbeidsforhold: undefined,
  fagsaker: undefined,
  institusjoner: undefined,
  landkoder: undefined,
  person: undefined,
  opprettetSak: undefined,
  personRelatert: undefined,

  buctyper: undefined,
  familierelasjoner: undefined,
  kjoenn: undefined,
  sektor: undefined,
  sedtyper: undefined,
  tema: undefined,
  kodemaps: undefined
}

const sakReducer = (state: SakState = initialSakState, action: ActionWithPayload) => {
  switch (action.type) {
    case types.SAK_ARBEIDSFORHOLD_GET_SUCCESS:
      return {
        ...state,
        arbeidsforhold: action.payload
      }

    case types.SAK_FAGSAKER_GET_REQUEST:
      return {
        ...state,
        fagsaker: undefined
      }

    case types.SAK_FAGSAKER_GET_SUCCESS:
      return {
        ...state,
        fagsaker: action.payload
      }

    case types.SAK_FAGSAKER_GET_FAILURE:
      return {
        ...state,
        fagsaker: null
      }

    case types.SAK_INSTITUSJONER_GET_SUCCESS:
      return {
        ...state,
        institusjoner: action.payload
      }

    case types.SAK_LANDKODER_GET_SUCCESS:
      return {
        ...state,
        landkoder: action.payload
      }

    case types.SAK_PERSON_GET_FAILURE:
      return {
        ...state,
        person: null
      }

    case types.SAK_PERSON_GET_SUCCESS:
      return {
        ...state,
        person: action.payload
      }

    case types.SAK_PERSON_RELATERT_GET_FAILURE:
      return {
        ...state,
        personRelatert: null
      }

    case types.SAK_PERSON_RELATERT_GET_SUCCESS:
      return {
        ...state,
        personRelatert: action.payload
      }

    case types.SAK_PERSON_RESET:
      return {
        ...state,
        person: undefined
      }

    case types.SAK_PERSON_RELATERT_RESET:
      return {
        ...state,
        personRelatert: undefined
      }

    case types.SAK_SEND_POST_SUCCESS:
      return {
        ...state,
        opprettetSak: action.payload
      }

    case types.SAK_PRELOAD:
      return {
        ...state,
        ...action.payload
      }

    case types.APP_CLEAN_DATA:
      return initialSakState

    default:

      return state
  }
}

export default sakReducer
