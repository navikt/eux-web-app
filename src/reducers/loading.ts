import * as types from 'constants/actionTypes'
import _ from 'lodash'
import { Action } from 'redux'

export interface LoadingState {
  [k: string]: boolean;
}

export const initialLoadingState: LoadingState = {
  gettingArbeidsforhold: false,
  gettingDokumenter: false,
  gettingFagsaker: false,
  gettingInstitusjoner: false,
  gettingKodeverk: false,
  gettingLandkoder: false,
  gettingPersoner: false,
  gettingSaksbehandler: false,
  gettingServerinfo: false,
  sendingVedlegg: false,
  sendingSak: false
}

const loadingReducer = (state: LoadingState = initialLoadingState, action: Action) => {
  if (_.endsWith(action.type, '/ERROR')) {
    return initialLoadingState
  }

  switch (action.type) {
    // SAK
    case types.SAK_ARBEIDSFORHOLD_GET_REQUEST:
      return {
        ...state,
        gettingArbeidsforhold: true
      }

    case types.SAK_ARBEIDSFORHOLD_GET_SUCCESS:
    case types.SAK_ARBEIDSFORHOLD_GET_FAILURE:
      return {
        ...state,
        gettingArbeidsforhold: false
      }

    case types.SAK_DOKUMENTER_GET_REQUEST:
      return {
        ...state,
        gettingDokumenter: true
      }

    case types.SAK_DOKUMENTER_GET_SUCCESS:
    case types.SAK_DOKUMENTER_GET_FAILURE:
      return {
        ...state,
        gettingDokumenter: false
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

    case types.SAK_KODEVERK_GET_REQUEST:
      return {
        ...state,
        gettingKodeverk: true
      }

    case types.SAK_KODEVERK_GET_SUCCESS:
    case types.SAK_KODEVERK_GET_FAILURE:
      return {
        ...state,
        gettingKodeverk: false
      }

    case types.SAK_LANDKODER_GET_REQUEST:
      return {
        ...state,
        gettingKLandkoder: true
      }

    case types.SAK_LANDKODER_GET_SUCCESS:
    case types.SAK_LANDKODER_GET_FAILURE:
      return {
        ...state,
        gettingKLandkoder: false
      }

    case types.SAK_PERSONER_GET_REQUEST:
      return {
        ...state,
        gettingPersoner: true
      }

    case types.SAK_PERSONER_GET_SUCCESS:
    case types.SAK_PERSONER_GET_FAILURE:
      return {
        ...state,
        gettingPersoner: false
      }

    case types.SAK_SEND_POST_REQUEST:
      return {
        ...state,
        sendingSak: true
      }

    case types.SAK_SEND_POST_SUCCESS:
    case types.SAK_SEND_POST_FAILURE:
      return {
        ...state,
        sendingSak: false
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

    case types.SAK_SAKSBEHANDLER_GET_REQUEST:
      return {
        ...state,
        gettingSaksbehandler: true
      }

    case types.SAK_SAKSBEHANDLER_GET_SUCCESS:
    case types.SAK_SAKSBEHANDLER_GET_FAILURE:
      return {
        ...state,
        gettingSaksbehandler: false
      }

    case types.SAK_SERVERINFO_GET_REQUEST:
      return {
        ...state,
        gettingServerinfo: true
      }

    case types.SAK_SERVERINFO_GET_SUCCESS:
    case types.SAK_SERVERINFO_GET_FAILURE:
      return {
        ...state,
        gettingServerinfo: false
      }

    default:
      return state
  }
}

export default loadingReducer
