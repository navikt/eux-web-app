import * as types from 'constants/actionTypes'
import { ReplyPdu1 } from 'declarations/pd'
import { FagSaker } from 'declarations/types'
import { ActionWithPayload } from 'js-fetch-api'
import _ from 'lodash'
import { Action } from 'redux'

export interface Pdu1State {
  fagsaker: FagSaker | null | undefined
  replyPdu1: ReplyPdu1 | null | undefined
  previewPdu1: any
  completePdu1Response: any
}

export const initialPdu1State: Pdu1State = {
  fagsaker: undefined,
  replyPdu1: undefined,
  previewPdu1: undefined,
  completePdu1Response: undefined
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

    case types.PDU1_CREATE_REQUEST:
      return {
        ...state,
        replyPdu1: undefined
      }

    case types.PDU1_CREATE_SUCCESS:
      return {
        ...state,
        replyPdu1: {
          ...(action as ActionWithPayload).payload,
          fagsaker: (action as ActionWithPayload).context.fagsaker
        }
      }

    case types.PDU1_CREATE_FAILURE:
      return {
        ...state,
        replyPdu1: null
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

    case types.PDU1_COMPLETE_RESET:
    case types.PDU1_COMPLETE_REQUEST:
      return {
        ...state,
        completePdu1Response: undefined
      }

    case types.PDU1_COMPLETE_SUCCESS:
      return {
        ...state,
        completePdu1Response: (action as ActionWithPayload).payload
      }

    case types.PDU1_COMPLETE_FAILURE:
      return {
        ...state,
        completePdu1Response: null
      }

    case types.PDU1_REPLYSED_SET:
      return {
        ...state,
        replyPdu1: (action as ActionWithPayload).payload
      }

    case types.PDU1_REPLYSED_UPDATE: {
      let newReplyPdu1: ReplyPdu1 | null | undefined = _.cloneDeep(state.replyPdu1)
      if (!newReplyPdu1) {
        newReplyPdu1 = {} as ReplyPdu1
      }
      _.set(newReplyPdu1,
        (action as ActionWithPayload).payload.needle,
        (action as ActionWithPayload).payload.value
      )

      return {
        ...state,
        replyPdu1: newReplyPdu1
      }
    }

    default:
      return state
  }
}

export default pdu1Reducer
