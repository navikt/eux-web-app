import * as types from 'constants/actionTypes'
import { VedleggSendResponse } from 'declarations/types'
import { ActionWithPayload } from 'js-fetch-api'

export interface VedleggState {
  vedlegg: VedleggSendResponse | undefined;
  rinasaksnummer: any;
  rinadokumentID: any;
  journalpostID: any;
  dokumentID: any;
  dokument: any;
}

export const initialVedleggState: VedleggState = {
  vedlegg: undefined,
  rinasaksnummer: undefined,
  rinadokumentID: undefined,
  journalpostID: undefined,
  dokumentID: undefined,
  dokument: undefined
}

const vedleggReducer = (state: VedleggState = initialVedleggState, action: ActionWithPayload) => {
  switch (action.type) {
    case types.VEDLEGG_POST_SUCCESS:
      return {
        ...state,
        vedlegg: action.payload
      }

    case types.VEDLEGG_DOKUMENT_GET_REQUEST:
      return {
        ...state,
        dokument: undefined
      }

    case types.VEDLEGG_DOKUMENT_GET_FAILURE:
      return {
        ...state,
        dokument: null
      }

    case types.VEDLEGG_DOKUMENT_GET_SUCCESS:
      return {
        ...state,
        dokument: action.payload
      }

    case types.VEDLEGG_VALUE_SET:
      return {
        ...state,
        [action.payload.key]: action.payload.value
      }
    case types.APP_CLEAN_DATA:
      return initialVedleggState

    default:
      return state
  }
}

export default vedleggReducer
