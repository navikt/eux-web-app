import * as types from 'constants/actionTypes'
import _ from 'lodash'
import { Action } from 'redux'

export interface LoadingState {
  [k: string]: boolean;
}

export const initialLoadingState: LoadingState = {
  completingPdu1: false,
  creatingPdu1: false,
  creatingSvarSed: false,
  fetchingPdu1: false,
  gettingAdresse: false,
  gettingArbeidsperioder: false,
  gettingDokument: false,
  gettingFagsaker: false,
  gettingInntekter: false,
  gettingInstitusjoner: false,
  gettingJoarkList: false,
  gettingJoarkFile: false,
  gettingLandkoder: false,
  gettingPreviewFile: false,
  gettingPreviewPdu1: false,
  gettingSaksbehandler: false,
  gettingSavedItems: false,
  gettingServerinfo: false,
  gettingSedStatus: false,
  queryingReplySed: false,
  queryingSaksnummerOrFnr: false,
  searchingPerson: false,
  searchingRelatertPerson: false,
  sendingVedlegg: false,
  sendingSak: false,
  sendingSed: false

}

const loadingReducer = (
  state: LoadingState = initialLoadingState,
  action: Action = { type: '' }
): LoadingState => {
  if (_.endsWith(action.type, '/ERROR')) {
    return initialLoadingState
  }

  switch (action.type) {
    case types.ADRESSE_SEARCH_REQUEST:
      return {
        ...state,
        gettingAdresse: true
      }

    case types.ADRESSE_SEARCH_FAILURE:
    case types.ADRESSE_SEARCH_SUCCESS:
      return {
        ...state,
        gettingAdresse: false
      }

    case types.ARBEIDSPERIODER_GET_REQUEST:
      return {
        ...state,
        gettingArbeidsperioder: true
      }

    case types.ARBEIDSPERIODER_GET_SUCCESS:
    case types.ARBEIDSPERIODER_GET_FAILURE:
      return {
        ...state,
        gettingArbeidsperioder: false
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

    case types.SVARSED_FAGSAKER_GET_REQUEST:
    case types.SAK_FAGSAKER_GET_REQUEST:
    case types.PDU1_FAGSAKER_GET_REQUEST:
      return {
        ...state,
        gettingFagsaker: true
      }

    case types.SVARSED_FAGSAKER_GET_SUCCESS:
    case types.SVARSED_FAGSAKER_GET_FAILURE:
    case types.PDU1_FAGSAKER_GET_SUCCESS:
    case types.PDU1_FAGSAKER_GET_FAILURE:
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

    case types.INNTEKT_GET_REQUEST:
      return {
        ...state,
        gettingInntekter: true
      }

    case types.INNTEKT_GET_SUCCESS:
    case types.INNTEKT_GET_FAILURE:
      return {
        ...state,
        gettingInntekter: false
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

    case types.SVARSED_PREVIEW_REQUEST:
      return {
        ...state,
        gettingPreviewFile: true
      }

    case types.SVARSED_PREVIEW_SUCCESS:
    case types.SVARSED_PREVIEW_FAILURE:
      return {
        ...state,
        gettingPreviewFile: false
      }

    case types.PDU1_JOURNALFØRE_REQUEST:
      return {
        ...state,
        completingPdu1: true
      }

    case types.PDU1_JOURNALFØRE_FAILURE:
    case types.PDU1_JOURNALFØRE_SUCCESS:
      return {
        ...state,
        completingPdu1: false
      }

    case types.PDU1_GET_REQUEST:
      return {
        ...state,
        creatingPdu1: true
      }

    case types.PDU1_GET_FAILURE:
    case types.PDU1_GET_SUCCESS:
      return {
        ...state,
        creatingPdu1: false
      }

    case types.PDU1_PREVIEW_REQUEST:
      return {
        ...state,
        gettingPreviewPdu1: true
      }

    case types.PDU1_PREVIEW_SUCCESS:
    case types.PDU1_PREVIEW_FAILURE:
      return {
        ...state,
        gettingPreviewPdu1: false
      }

    case types.PDU1_FETCH_REQUEST:
      return {
        ...state,
        fetchingPdu1: true
      }

    case types.PDU1_FETCH_FAILURE:
    case types.PDU1_FETCH_SUCCESS:
      return {
        ...state,
        fetchingPdu1: false
      }


    case types.PERSON_SEARCH_REQUEST:
      return {
        ...state,
        searchingPerson: true
      }

    case types.PERSON_SEARCH_SUCCESS:
    case types.PERSON_SEARCH_FAILURE:
      return {
        ...state,
        searchingPerson: false
      }

    case types.PERSON_RELATERT_SEARCH_REQUEST:
      return {
        ...state,
        searchingRelatertPerson: true
      }

    case types.PERSON_RELATERT_SEARCH_SUCCESS:
    case types.PERSON_RELATERT_SEARCH_FAILURE:
      return {
        ...state,
        searchingRelatertPerson: false
      }

    case types.SVARSED_SAKSNUMMERORFNR_QUERY_REQUEST:
      return {
        ...state,
        queryingSaksnummerOrFnr: true
      }

    case types.SVARSED_SAKSNUMMERORFNR_QUERY_SUCCESS:
    case types.SVARSED_SAKSNUMMERORFNR_QUERY_FAILURE:
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

    case types.SVARSED_SED_SEND_REQUEST:
      return {
        ...state,
        sendingSed: true
      }

    case types.SVARSED_SED_SEND_SUCCESS:
    case types.SVARSED_SED_SEND_FAILURE:
      return {
        ...state,
        sendingSed: false
      }

    case types.SVARSED_REPLYSED_QUERY_REQUEST:
      return {
        ...state,
        queryingReplySed: true
      }

    case types.SVARSED_REPLYSED_QUERY_SUCCESS:
    case types.SVARSED_REPLYSED_QUERY_FAILURE:
      return {
        ...state,
        queryingReplySed: false
      }

    case types.SVARSED_SED_CREATE_REQUEST:
      return {
        ...state,
        creatingSvarSed: true
      }

    case types.SVARSED_SED_CREATE_SUCCESS:
    case types.SVARSED_SED_CREATE_FAILURE:
      return {
        ...state,
        creatingSvarSed: false
      }

    case types.SVARSED_SED_STATUS_REQUEST:
      return {
        ...state,
        gettingSedStatus: true
      }

    case types.SVARSED_SED_STATUS_SUCCESS:
    case types.SVARSED_SED_STATUS_FAILURE:
      return {
        ...state,
        gettingSedStatus: false
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

    case types.ATTACHMENT_LIST_REQUEST:
      return {
        ...state,
        gettingJoarkList: true
      }

    case types.ATTACHMENT_LIST_SUCCESS:
    case types.ATTACHMENT_LIST_FAILURE:
      return {
        ...state,
        gettingJoarkList: false
      }

    case types.ATTACHMENT_PREVIEW_REQUEST:
      return {
        ...state,
        gettingJoarkFile: true
      }

    case types.ATTACHMENT_PREVIEW_SUCCESS:
    case types.ATTACHMENT_PREVIEW_FAILURE:
      return {
        ...state,
        gettingJoarkFile: false
      }

    default:
      return state
  }
}

export default loadingReducer
