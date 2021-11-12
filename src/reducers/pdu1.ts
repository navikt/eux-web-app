import * as types from 'constants/actionTypes'
import { ReplySed } from 'declarations/sed'
import { FagSaker } from 'declarations/types'
import { ActionWithPayload } from 'js-fetch-api'
import { Action } from 'redux'

export interface Pdu1State {
  fagsaker: FagSaker | null | undefined
  replySed: ReplySed | null | undefined
}

export const initialPdu1State: Pdu1State = {
  fagsaker: undefined,
  replySed: undefined
}

const pdu1Reducer = (state: Pdu1State = initialPdu1State, action: Action | ActionWithPayload = { type: '' }): Pdu1State => {
  switch (action.type) {
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
        replySed: undefined
      }

    case types.PDU1_CREATE_SUCCESS:
      return {
        ...state,
        replySed: (action as ActionWithPayload).payload
      }

    case types.PDU1_CREATE_FAILURE:
      return {
        ...state,
        replySed: null
      }

    default:
      return state
  }
}

export default pdu1Reducer
