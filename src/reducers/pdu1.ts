import { ActionWithPayload } from 'js-fetch-api'
import { Action } from 'redux'

export interface Pdu1State {
}

export const initialPdu1State: Pdu1State = {
}

const pdu1Reducer = (state: Pdu1State = initialPdu1State, action: Action | ActionWithPayload = { type: '' }): Pdu1State => {
  switch (action.type) {
    default:
      return state
  }
}

export default pdu1Reducer
