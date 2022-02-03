import * as types from 'constants/actionTypes'
import { VedleggSendResponse } from 'declarations/types'
import { ActionWithPayload } from '@navikt/fetch'

export interface VedleggState {
  vedleggResponse: VedleggSendResponse | undefined;
  rinasaksnummer: any;
  rinadokumentID: any;
  journalpostID: any;
  dokumentID: any;
  dokument: any;
}

export const initialVedleggState: VedleggState = {
  vedleggResponse: undefined,
  rinasaksnummer: undefined,
  rinadokumentID: undefined,
  journalpostID: undefined,
  dokumentID: undefined,
  dokument: undefined
}

const vedleggReducer = (state: VedleggState = initialVedleggState, action: ActionWithPayload = { type: '', payload: undefined }): VedleggState => {
  switch (action.type) {
    case types.VEDLEGG_POST_SUCCESS:
      return {
        ...state,
        vedleggResponse: action.payload
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

    case types.VEDLEGG_PROPERTY_SET:
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
