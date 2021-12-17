import * as types from 'constants/actionTypes'
import { PDU1 } from 'declarations/pd'
import { FagSaker } from 'declarations/types'
import { ActionWithPayload } from 'js-fetch-api'
import _ from 'lodash'
import { Action } from 'redux'

export interface Pdu1State {
  fagsaker: FagSaker | null | undefined
  PDU1: PDU1 | null | undefined
  previewPdu1: any
  jornalførePdu1Response: any
}

export const initialPdu1State: Pdu1State = {
  fagsaker: undefined,
  PDU1: undefined,
  previewPdu1: undefined,
  jornalførePdu1Response: undefined
}

const pdu1Reducer = (state: Pdu1State = initialPdu1State, action: Action | ActionWithPayload = { type: '' }): Pdu1State => {
  switch (action.type) {
    case types.APP_CLEAN_DATA:
      return initialPdu1State

    case types.PDU1_FAGSAKER_GET_REQUEST:
      return {
        ...state,
        fagsaker: undefined
      }

    case types.PDU1_FAGSAKER_GET_SUCCESS:
      return {
        ...state,
        fagsaker: (action as ActionWithPayload).payload
      }

    case types.PDU1_FAGSAKER_GET_FAILURE:
      return {
        ...state,
        fagsaker: null
      }

    case types.PDU1_GET_REQUEST:
      return {
        ...state,
        PDU1: undefined
      }

    case types.PDU1_GET_SUCCESS:
      return {
        ...state,
        PDU1: (action as ActionWithPayload).payload
      }

    case types.PDU1_GET_FAILURE:
      return {
        ...state,
        PDU1: null
      }

    case types.PDU1_PREVIEW_RESET:
    case types.PDU1_PREVIEW_REQUEST:
      return {
        ...state,
        previewPdu1: undefined
      }

    case types.PDU1_PREVIEW_SUCCESS:
      return {
        ...state,
        previewPdu1: (action as ActionWithPayload).payload
      }

    case types.PDU1_PREVIEW_FAILURE:
      return {
        ...state,
        previewPdu1: null
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

    case types.PDU1_SET:
      return {
        ...state,
        PDU1: (action as ActionWithPayload).payload
      }

    case types.PDU1_UPDATE: {
      let newPdu1: PDU1 | null | undefined = _.cloneDeep(state.PDU1)
      if (!newPdu1) {
        newPdu1 = {} as PDU1
      }
      _.set(newPdu1,
        (action as ActionWithPayload).payload.needle,
        (action as ActionWithPayload).payload.value
      )

      return {
        ...state,
        PDU1: newPdu1
      }
    }

    default:
      return state
  }
}

export default pdu1Reducer
