import * as types from 'constants/actionTypes'
import { VedleggSendResponse } from 'declarations/types'
import { ActionWithPayload } from 'eessi-pensjon-ui/dist/declarations/types'

export interface VedleggState {
  vedlegg: VedleggSendResponse | undefined;
  rinasaksnummer: any;
  rinadokumentID: any;
  journalpostID: any;
  dokumentID: any;
  dokumenter: any;
}

export const initialVedleggState: VedleggState = {
  vedlegg: undefined,
  rinasaksnummer: undefined,
  rinadokumentID: undefined,
  journalpostID: undefined,
  dokumentID: undefined,
  dokumenter: undefined
}

const vedleggReducer = (state: VedleggState = initialVedleggState, action: ActionWithPayload) => {
  switch (action.type) {
    case types.VEDLEGG_POST_SUCCESS:
      return {
        ...state,
        vedlegg: action.payload
      }

    case types.VEDLEGG_DOKUMENTER_GET_SUCCESS:
      return {
        ...state,
        dokumenter: action.payload
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
