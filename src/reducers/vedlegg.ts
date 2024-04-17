import * as types from 'constants/actionTypes'
import { Dokument, VedleggSendResponse } from 'declarations/types'
import { AnyAction } from 'redux'
import {JoarkBrowserItems} from "../declarations/attachments";

export interface VedleggState {
  vedleggResponse: VedleggSendResponse | undefined;
  rinasaksnummer: string | undefined
  rinadokumentID: string | undefined
  dokument: Array<Dokument> | null | undefined
  attachments: JoarkBrowserItems
}

export const initialVedleggState: VedleggState = {
  vedleggResponse: undefined,
  rinasaksnummer: undefined,
  rinadokumentID: undefined,
  dokument: undefined,
  attachments: []
}

const vedleggReducer = (state: VedleggState = initialVedleggState, action: AnyAction): VedleggState => {
  switch (action.type) {
    case types.VEDLEGG_POST_SUCCESS:
      return {
        ...state,
        vedleggResponse: action.payload
      }

    case types.VEDLEGG_DOKUMENT_REQUEST:
      return {
        ...state,
        dokument: undefined
      }

    case types.VEDLEGG_DOKUMENT_FAILURE:
      return {
        ...state,
        dokument: null
      }

    case types.VEDLEGG_DOKUMENT_SUCCESS:
      return {
        ...state,
        dokument: action.payload
      }

    case types.VEDLEGG_PROPERTY_SET:
      return {
        ...state,
        [action.payload.key]: action.payload.value
      }
    case types.APP_RESET:
      return initialVedleggState

    default:
      return state
  }
}

export default vedleggReducer
