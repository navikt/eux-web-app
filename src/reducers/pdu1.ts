import * as types from 'constants/actionTypes'
import { PDU1 } from 'declarations/pd'
import {Fagsak, Fagsaker, PDU1SearchResults} from 'declarations/types'
import { ActionWithPayload } from '@navikt/fetch'
import _ from 'lodash'
import { AnyAction } from 'redux'

export interface Pdu1State {
  fagsaker: Fagsaker | null | undefined
  createdFagsak: string | null | undefined
  pdu1: PDU1 | null | undefined
  pdu1results: PDU1SearchResults | null | undefined
  previewDraftPdu1: Blob | null | undefined
  previewStoredPdu1: Blob | null | undefined
  jornalførePdu1Response: any
  pdu1Changed: boolean
  pdu1Initialized: boolean
  statsborgerskapModalShown: boolean
}

export const initialPdu1State: Pdu1State = {
  fagsaker: undefined,
  createdFagsak: undefined,
  pdu1: undefined,
  pdu1results: undefined,
  previewDraftPdu1: undefined,
  previewStoredPdu1: undefined,
  jornalførePdu1Response: undefined,
  pdu1Changed: false,
  pdu1Initialized: false,
  statsborgerskapModalShown: false
}

const pdu1Reducer = (state: Pdu1State = initialPdu1State, action: AnyAction): Pdu1State => {
  switch (action.type) {
    case types.APP_RESET:
    case types.PDU1_RESET:
      return initialPdu1State

    case types.PDU1_FAGSAKER_REQUEST:
    case types.PDU1_FAGSAKER_RESET:
      return {
        ...state,
        fagsaker: undefined,
        createdFagsak: undefined
      }

    case types.PDU1_FAGSAKER_SUCCESS:
      return {
        ...state,
        fagsaker: (action as ActionWithPayload).payload
      }

    case types.PDU1_FAGSAKER_FAILURE:
      return {
        ...state,
        fagsaker: null
      }

    case types.PDU1_CREATE_FAGSAK_REQUEST:
      return {
        ...state,
        createdFagsak: undefined
      }

    case types.PDU1_CREATE_FAGSAK_SUCCESS:
      const fagsak:Fagsak = (action as ActionWithPayload).payload
      let fSaker = _.cloneDeep(state.fagsaker)
      fSaker?.unshift(fagsak)
      return {
        ...state,
        fagsaker: fSaker,
        createdFagsak: fagsak.id
      }

    case types.PDU1_CREATE_FAGSAK_FAILURE:
      return {
        ...state,
        createdFagsak: null
      }


    case types.PDU1_ASJSON_REQUEST:
      return {
        ...state,
        pdu1Changed: false,
        pdu1Initialized: false,
        pdu1: undefined
      }

    case types.PDU1_ASJSON_SUCCESS: {
      const pdu1: PDU1 = (action as ActionWithPayload).payload
      pdu1.saksreferanse = (action as ActionWithPayload).payload.saksreferanse
      pdu1.fagsakId = (action as ActionWithPayload).payload.fagsakId
      pdu1.__fagsak = (action as ActionWithPayload).context.fagsak
      pdu1.__dokumentId = (action as ActionWithPayload).context.dokumentId
      pdu1.__journalpostId = (action as ActionWithPayload).context.journalpostId
      return {
        ...state,
        pdu1,
        pdu1Initialized: true
      }
    }

    case types.PDU1_ASJSON_FAILURE:
      return {
        ...state,
        pdu1Changed: false,
        pdu1Initialized: false,
        pdu1: null
      }

    case types.PDU1_ASPDF_RESET:
    case types.PDU1_ASPDF_REQUEST:
      return {
        ...state,
        previewStoredPdu1: undefined
      }

    case types.PDU1_ASPDF_SUCCESS:
      return {
        ...state,
        previewStoredPdu1: (action as ActionWithPayload).payload
      }

    case types.PDU1_ASPDF_FAILURE:
      return {
        ...state,
        previewStoredPdu1: null
      }

    case types.PDU1_JOURNALFØRE_RESET:
    case types.PDU1_JOURNALFØRE_REQUEST:
      return {
        ...state,
        jornalførePdu1Response: undefined
      }

    case types.PDU1_JOURNALFØRE_SUCCESS:
      return {
        ...state,
        jornalførePdu1Response: (action as ActionWithPayload).payload
      }

    case types.PDU1_JOURNALFØRE_FAILURE:
      return {
        ...state,
        jornalførePdu1Response: null
      }

    case types.PDU1_LOAD:
      return {
        ...state,
        pdu1Changed: false,
        pdu1: (action as ActionWithPayload).payload
      }

    case types.PDU1_SET:
      return {
        ...state,
        pdu1Changed: true,
        pdu1: (action as ActionWithPayload).payload
      }

    case types.PDU1_PREVIEW_RESET:
    case types.PDU1_PREVIEW_REQUEST:
      return {
        ...state,
        previewDraftPdu1: undefined
      }

    case types.PDU1_PREVIEW_SUCCESS:
      return {
        ...state,
        previewDraftPdu1: (action as ActionWithPayload).payload
      }

    case types.PDU1_PREVIEW_FAILURE:
      return {
        ...state,
        previewDraftPdu1: null
      }

    case types.PDU1_SEARCH_REQUEST:
    case types.PDU1_SEARCH_RESET:
      return {
        ...state,
        pdu1results: undefined
      }

    case types.PDU1_SEARCH_SUCCESS:
      return {
        ...state,
        pdu1results: (action as ActionWithPayload).payload
      }

    case types.PDU1_SEARCH_FAILURE:
      return {
        ...state,
        pdu1results: null
      }

    case types.PDU1_TEMPLATE_REQUEST:
      return {
        ...state,
        pdu1Changed: false,
        pdu1Initialized: false,
        pdu1: undefined,
        statsborgerskapModalShown: false
      }

    case types.PDU1_TEMPLATE_SUCCESS: {
      const pdu1: PDU1 = (action as ActionWithPayload).payload
      pdu1.saksreferanse = (action as ActionWithPayload).context.saksreferanse
      pdu1.fagsakId = (action as ActionWithPayload).context.fagsakId
      pdu1.__fagsak = (action as ActionWithPayload).context.fagsakId
      pdu1.__fnr = (action as ActionWithPayload).context.fnr
      return {
        ...state,
        pdu1,
        pdu1Initialized: true
      }
    }

    case types.PDU1_TEMPLATE_FAILURE:
      return {
        ...state,
        pdu1Changed: false,
        pdu1Initialized: false,
        pdu1: null
      }

    case types.PDU1_UPDATE: {
      let newPdu1: PDU1 | null | undefined = _.cloneDeep(state.pdu1)
      if (!newPdu1) {
        newPdu1 = {} as PDU1
      }
      _.set(newPdu1,
        (action as ActionWithPayload).payload.needle,
        (action as ActionWithPayload).payload.value
      )

      return {
        ...state,
        pdu1Changed: true,
        pdu1: newPdu1
      }
    }

    case types.PDU1_STATSBORGERSKAP_MODAL_SHOWN_SET: {
      return {
        ...state,
        statsborgerskapModalShown: true
      }
    }

    default:
      return state
  }
}

export default pdu1Reducer
