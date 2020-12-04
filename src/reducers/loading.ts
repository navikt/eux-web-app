import * as types from 'constants/actionTypes'
import _ from 'lodash'
import { Action } from 'redux'

export interface LoadingState {
  [k: string]: boolean;
}

export const initialLoadingState: LoadingState = {
  gettingArbeidsforhold: false,
  gettingDokument: false,
  gettingFagsaker: false,
  gettingInstitusjoner: false,
  gettingLandkoder: false,
  gettingPerson: false,
  gettingSaksbehandler: false,
  gettingServerinfo: false,
  sendingVedlegg: false,
  sendingSak: false,
  sendingSvarPaSed: false,
  queryingSvarSed: false,
  queryingSaksnummerOrFnr: false
}

const loadingReducer = (
  state: LoadingState = initialLoadingState,
  action: Action = { type: '' }
) => {
  if (_.endsWith(action.type, '/ERROR')) {
    return initialLoadingState
  }

  switch (action.type) {
    // SAK
    case types.SAK_ARBEIDSFORHOLDLIST_GET_REQUEST:
      return {
        ...state,
        gettingArbeidsforhold: true
      }

    case types.SAK_ARBEIDSFORHOLDLIST_GET_SUCCESS:
    case types.SAK_ARBEIDSFORHOLDLIST_GET_FAILURE:
      return {
        ...state,
        gettingArbeidsforhold: false
      }

    case types.VEDLEGG_DOKUMENT_GET_REQUEST:
      return {
        ...state,
        gettingDokument: true
      }

    case types.VEDLEGG_DOKUMENT_GET_SUCCESS:
    case types.VEDLEGG_DOKUMENT_GET_FAILURE:
      return {
        ...state,
        gettingDokument: false
      }

    case types.SAK_FAGSAKER_GET_REQUEST:
      return {
        ...state,
        gettingFagsaker: true
      }

    case types.SAK_FAGSAKER_GET_SUCCESS:
    case types.SAK_FAGSAKER_GET_FAILURE:
      return {
        ...state,
        gettingFagsaker: false
      }

    case types.SAK_INSTITUSJONER_GET_REQUEST:
      return {
        ...state,
        gettingInstitusjoner: true
      }

    case types.SAK_INSTITUSJONER_GET_SUCCESS:
    case types.SAK_INSTITUSJONER_GET_FAILURE:
      return {
        ...state,
        gettingInstitusjoner: false
      }

    case types.SAK_LANDKODER_GET_REQUEST:
      return {
        ...state,
        gettingLandkoder: true
      }

    case types.SAK_LANDKODER_GET_SUCCESS:
    case types.SAK_LANDKODER_GET_FAILURE:
      return {
        ...state,
        gettingLandkoder: false
      }

    case types.SAK_PERSON_GET_REQUEST:
      return {
        ...state,
        gettingPerson: true
      }

    case types.SAK_PERSON_GET_SUCCESS:
    case types.SAK_PERSON_GET_FAILURE:
      return {
        ...state,
        gettingPerson: false
      }

    case types.SVARPASED_SAKSNUMMERORFNR_QUERY_REQUEST:
      return {
        ...state,
        queryingSaksnummerOrFnr: true
      }

    case types.SVARPASED_SAKSNUMMERORFNR_QUERY_SUCCESS:
    case types.SVARPASED_SAKSNUMMERORFNR_QUERY_FAILURE:
      return {
        ...state,
        queryingSaksnummerOrFnr: false
      }

    case types.SAK_SEND_REQUEST:
      return {
        ...state,
        sendingSak: true
      }

    case types.SAK_SEND_SUCCESS:
    case types.SAK_SEND_FAILURE:
      return {
        ...state,
        sendingSak: false
      }

    case types.SVARPASED_OVERSIKT_GET_REQUEST:
      return {
        ...state,
        queryingSvarPaSedOversikt: true
      }

    case types.SVARPASED_OVERSIKT_GET_SUCCESS:
    case types.SVARPASED_OVERSIKT_GET_FAILURE:
      return {
        ...state,
        queryingSvarPaSedOversikt: false
    }

    case types.SVARPASED_SEDS_GET_REQUEST:
      return {
        ...state,
        gettingSeds: true
      }

    case types.SVARPASED_SEDS_GET_SUCCESS:
    case types.SVARPASED_SEDS_GET_FAILURE:
      return {
        ...state,
        gettingSeds: false
      }

    case types.SVARPASED_SVARSED_QUERY_REQUEST:
      return {
        ...state,
        queryingSvarSed: true
      }

    case types.SVARPASED_SVARSED_QUERY_SUCCESS:
    case types.SVARPASED_SVARSED_QUERY_FAILURE:
      return {
        ...state,
        queryingSvarSed: false
      }

    case types.SVARPASED_SENDSVARPASEDDATA_POST_REQUEST:
      return {
        ...state,
        sendingSvarPaSed: true
      }

    case types.SVARPASED_SENDSVARPASEDDATA_POST_SUCCESS:
    case types.SVARPASED_SENDSVARPASEDDATA_POST_FAILURE:
      return {
        ...state,
        sendingSvarPaSed: false
      }

    case types.VEDLEGG_POST_REQUEST:
      return {
        ...state,
        sendingVedlegg: true
      }

    case types.VEDLEGG_POST_SUCCESS:
    case types.VEDLEGG_POST_FAILURE:
      return {
        ...state,
        sendingVedlegg: false
      }

    case types.APP_SAKSBEHANDLER_GET_REQUEST:
      return {
        ...state,
        gettingSaksbehandler: true
      }

    case types.APP_SAKSBEHANDLER_GET_SUCCESS:
    case types.APP_SAKSBEHANDLER_GET_FAILURE:
      return {
        ...state,
        gettingSaksbehandler: false
      }

    case types.APP_SERVERINFO_GET_REQUEST:
      return {
        ...state,
        gettingServerinfo: true
      }

    case types.APP_SERVERINFO_GET_SUCCESS:
    case types.APP_SERVERINFO_GET_FAILURE:
      return {
        ...state,
        gettingServerinfo: false
      }

    case types.APP_CLEAN_DATA:
      return initialLoadingState

    default:
      return state
  }
}

export default loadingReducer
