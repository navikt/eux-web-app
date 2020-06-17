import { ActionWithPayload } from 'eessi-pensjon-ui/dist/declarations/types'
import { Action } from 'redux'
import * as types from 'constants/actionTypes'

export interface SvarpasedState {
  saksnummer: any
}

export const initialSvarpasedState: SvarpasedState = {
  saksnummer: undefined
}

const svarpasedReducer = (state: SvarpasedState = initialSvarpasedState, action: Action | ActionWithPayload) => {
  switch (action.type) {

    case types.SVARPASED_SAKSNUMMER_GET_SUCCESS:

      return {
        ...state,
        saksnummer: (action as ActionWithPayload).payload
      }

    case types.SVARPASED_SAKSNUMMER_GET_FAILURE:

      return {
        ...state,
        saksnummer: null
      }

    default:

      return state
  }
}

export default svarpasedReducer
