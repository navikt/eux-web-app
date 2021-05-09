import * as types from 'constants/actionTypes'
import { Arbeidsperioder } from 'declarations/types.d'
import { ActionWithPayload } from 'js-fetch-api'

export interface ArbeidsgiverState {
  arbeidsperioder: Arbeidsperioder | undefined
}

export const initialArbeidsgiverState: ArbeidsgiverState = {
  arbeidsperioder: undefined
}

const arbeidsgiverReducer = (state: ArbeidsgiverState = initialArbeidsgiverState, action: ActionWithPayload = { type: '', payload: undefined }) => {
  switch (action.type) {
    case types.APP_CLEAN_DATA:
      return initialArbeidsgiverState

    case types.ARBEIDSPERIODER_GET_SUCCESS:
      return {
        ...state,
        arbeidsperioder: (action as ActionWithPayload).payload
      }

    default:
      return state
  }
}
export default arbeidsgiverReducer
