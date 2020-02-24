import * as types from 'constants/actionTypes'
import { Arbeidsforhold, OpprettetSak } from 'declarations/types'
import { ActionWithPayload } from 'eessi-pensjon-ui/dist/declarations/types'

export interface SakState {
  arbeidsforhold: Arbeidsforhold | undefined;
  dokumenter: any;
  fagsaker: any;
  institusjoner: any;
  landkoder: any;
  personer: any;
  opprettetSak: OpprettetSak | undefined;

  buctyper: any;
  familierelasjoner: any;
  kjoenn: any;
  sektor: any;
  sedtyper: any;
  tema: any;
  kodemaps: any;
}

export const initialSakState: SakState = {
  arbeidsforhold: undefined,
  dokumenter: undefined,
  fagsaker: undefined,
  institusjoner: undefined,
  landkoder: undefined,
  personer: undefined,
  opprettetSak: undefined,

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

    case types.SAK_DOKUMENTER_GET_SUCCESS:
      return {
        ...state,
        dokumenter: action.payload
      }

    case types.SAK_FAGSAKER_GET_SUCCESS:
      return {
        ...state,
        fagsaker: action.payload
      }

    case types.SAK_INSTITUSJONER_GET_SUCCESS:
      return {
        ...state,
        institusjoner: action.payload
      }

    case types.SAK_KODEVERK_GET_SUCCESS:
      return {
        ...state,
        ...action.payload
      }

    case types.SAK_LANDKODER_GET_SUCCESS:
      return {
        ...state,
        landkoder: action.payload
      }

    case types.SAK_PERSONER_GET_FAILURE:
      return {
        ...state,
        personer: null
      }

    case types.SAK_PERSONER_GET_SUCCESS:
      return {
        ...state,
        personer: action.payload
      }

    case types.SAK_PERSONER_RESET:
      return {
        ...state,
        personer: undefined
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
