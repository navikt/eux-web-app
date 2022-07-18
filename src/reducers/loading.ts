import * as types from 'constants/actionTypes'
import _ from 'lodash'
import { AnyAction } from 'redux'

export interface LoadingState {
  [k: string]: boolean;
}

export const initialLoadingState: LoadingState = {
  addingMottakere: false,
  completingPdu1: false,
  creatingSvarSed: false,
  creatingPdu1: false,
  deletingSak: false,
  fetchingPdu1: false,
  gettingAdresser: false,
  gettingArbeidsperioder: false,
  gettingDokument: false,
  gettingFagsaker: false,
  gettingInntekter: false,
  gettingInstitusjoner: false,
  gettingJoarkList: false,
  gettingJoarkFile: false,
  gettingLandkoder: false,
  gettingPdu1: false,
  gettingPreviewSed: false,
  gettingPreviewFile: false,
  gettingPreviewStoredPdu1: false,
  gettingPreviewDraftPdu1: false,
  gettingSaksbehandler: false,
  gettingSavedItems: false,
  gettingServerinfo: false,
  gettingSedStatus: false,
  queryingSaks: false,
  savingPdu1: false,
  savingSed: false,
  searchingPerson: false,
  searchingRelatertPerson: false,
  sendingVedlegg: false,
  sendingSak: false,
  sendingSed: false,
  updatingSvarSed: false

}

const loadingReducer = (
  state: LoadingState = initialLoadingState,
  action: AnyAction
): LoadingState => {
  if (_.endsWith(action.type, '/ERROR')) {
    return initialLoadingState
  }

  switch (action.type) {
    case types.ADRESSE_SEARCH_REQUEST:
      return {
        ...state,
        gettingAdresser: true
      }

    case types.ADRESSE_SEARCH_FAILURE:
    case types.ADRESSE_SEARCH_SUCCESS:
      return {
        ...state,
        gettingAdresser: false
      }

    case types.ARBEIDSPERIODER_REQUEST:
      return {
        ...state,
        gettingArbeidsperioder: true
      }

    case types.ARBEIDSPERIODER_SUCCESS:
    case types.ARBEIDSPERIODER_FAILURE:
      return {
        ...state,
        gettingArbeidsperioder: false
      }

    case types.APP_SAKSBEHANDLER_REQUEST:
      return {
        ...state,
        gettingSaksbehandler: true
      }

    case types.APP_SAKSBEHANDLER_SUCCESS:
    case types.APP_SAKSBEHANDLER_FAILURE:
      return {
        ...state,
        gettingSaksbehandler: false
      }

    case types.APP_SERVERINFO_REQUEST:
      return {
        ...state,
        gettingServerinfo: true
      }

    case types.APP_SERVERINFO_SUCCESS:
    case types.APP_SERVERINFO_FAILURE:
      return {
        ...state,
        gettingServerinfo: false
      }

    case types.APP_RESET:
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

    case types.VEDLEGG_DOKUMENT_REQUEST:
      return {
        ...state,
        gettingDokument: true
      }

    case types.VEDLEGG_DOKUMENT_SUCCESS:
    case types.VEDLEGG_DOKUMENT_FAILURE:
      return {
        ...state,
        gettingDokument: false
      }

    case types.SVARSED_FAGSAKER_REQUEST:
    case types.SAK_FAGSAKER_REQUEST:
    case types.PDU1_FAGSAKER_REQUEST:
      return {
        ...state,
        gettingFagsaker: true
      }

    case types.SVARSED_FAGSAKER_SUCCESS:
    case types.SVARSED_FAGSAKER_FAILURE:
    case types.PDU1_FAGSAKER_SUCCESS:
    case types.PDU1_FAGSAKER_FAILURE:
    case types.SAK_FAGSAKER_SUCCESS:
    case types.SAK_FAGSAKER_FAILURE:
      return {
        ...state,
        gettingFagsaker: false
      }

    case types.SVARSED_INSTITUSJONER_REQUEST:
    case types.SAK_INSTITUSJONER_REQUEST:
      return {
        ...state,
        gettingInstitusjoner: true
      }

    case types.SVARSED_INSTITUSJONER_SUCCESS:
    case types.SVARSED_INSTITUSJONER_FAILURE:
    case types.SAK_INSTITUSJONER_SUCCESS:
    case types.SAK_INSTITUSJONER_FAILURE:
      return {
        ...state,
        gettingInstitusjoner: false
      }

    case types.INNTEKT_REQUEST:
      return {
        ...state,
        gettingInntekter: true
      }

    case types.INNTEKT_SUCCESS:
    case types.INNTEKT_FAILURE:
      return {
        ...state,
        gettingInntekter: false
      }

    case types.SAK_LANDKODER_REQUEST:
      return {
        ...state,
        gettingLandkoder: true
      }

    case types.SAK_LANDKODER_SUCCESS:
    case types.SAK_LANDKODER_FAILURE:
      return {
        ...state,
        gettingLandkoder: false
      }

    case types.SVARSED_MOTTAKERE_ADD_REQUEST:
      return {
        ...state,
        addingMottakere: true
      }

    case types.SVARSED_MOTTAKERE_ADD_SUCCESS:
    case types.SVARSED_MOTTAKERE_ADD_FAILURE:
      return {
        ...state,
        addingMottakere: false
      }

    case types.SVARSED_PREVIEW_REQUEST:
      return {
        ...state,
        gettingPreviewSed: true
      }

    case types.SVARSED_PREVIEW_SUCCESS:
    case types.SVARSED_PREVIEW_FAILURE:
      return {
        ...state,
        gettingPreviewSed: false
      }

    case types.SVARSED_PREVIEW_FILE_REQUEST:
      return {
        ...state,
        gettingPreviewFile: true
      }

    case types.SVARSED_PREVIEW_FILE_SUCCESS:
    case types.SVARSED_PREVIEW_FILE_FAILURE:
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

    case types.PDU1_ASJSON_REQUEST:
      return {
        ...state,
        gettingPdu1: true
      }

    case types.PDU1_ASPDF_REQUEST:
      return {
        ...state,
        gettingPreviewStoredPdu1: true
      }

    case types.PDU1_ASPDF_SUCCESS:
    case types.PDU1_ASPDF_FAILURE:
      return {
        ...state,
        gettingPreviewStoredPdu1: false
      }

    case types.PDU1_ASJSON_FAILURE:
    case types.PDU1_ASJSON_SUCCESS:
      return {
        ...state,
        gettingPdu1: false
      }

    case types.PDU1_TEMPLATE_REQUEST:
      return {
        ...state,
        creatingPdu1: true
      }

    case types.PDU1_TEMPLATE_FAILURE:
    case types.PDU1_TEMPLATE_SUCCESS:
      return {
        ...state,
        creatingPdu1: false
      }

    case types.PDU1_PREVIEW_REQUEST:
      return {
        ...state,
        gettingPreviewDraftPdu1: true
      }

    case types.PDU1_PREVIEW_SUCCESS:
    case types.PDU1_PREVIEW_FAILURE:
      return {
        ...state,
        gettingPreviewDraftPdu1: false
      }

    case types.PDU1_SEARCH_REQUEST:
      return {
        ...state,
        fetchingPdu1: true
      }

    case types.PDU1_SEARCH_FAILURE:
    case types.PDU1_SEARCH_SUCCESS:
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

    case types.SVARSED_SAK_DELETE_REQUEST:
      return {
        ...state,
        deletingSak: true
      }

    case types.SVARSED_SAK_DELETE_SUCCESS:
    case types.SVARSED_SAK_DELETE_FAILURE:
      return {
        ...state,
        deletingSak: false
      }

    case types.SVARSED_SAKS_REQUEST:
    case types.SVARSED_SAKS_REFRESH_REQUEST:
      return {
        ...state,
        queryingSaks: true
      }

    case types.SVARSED_SAKS_SUCCESS:
    case types.SVARSED_SAKS_REFRESH_SUCCESS:
    case types.SVARSED_SAKS_FAILURE:
    case types.SVARSED_SAKS_REFRESH_FAILURE:
      return {
        ...state,
        queryingSaks: false
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

    case types.SVARSED_SED_UPDATE_REQUEST:
      return {
        ...state,
        updatingSvarSed: true
      }

    case types.SVARSED_SED_UPDATE_SUCCESS:
    case types.SVARSED_SED_UPDATE_FAILURE:
      return {
        ...state,
        updatingSvarSed: false
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

    default:
      return state
  }
}

export default loadingReducer
