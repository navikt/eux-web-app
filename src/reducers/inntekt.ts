import * as types from 'constants/actionTypes'
import { IInntekter } from 'declarations/types.d'
import { ActionWithPayload } from 'js-fetch-api'

export interface InntektState {
  inntekter: IInntekter | undefined
  fra: string | undefined
  til: string | undefined
}

export const initialInntektState: InntektState = {
  inntekter: undefined,
  fra: undefined,
  til: undefined
}

const inntektReducer = (state: InntektState = initialInntektState, action: ActionWithPayload = { type: '', payload: undefined }) => {
  switch (action.type) {
    case types.APP_CLEAN_DATA:
      return initialInntektState

    case types.INNTEKT_GET_REQUEST:
      return {
        ...state,
        inntekter: undefined
      }

    case types.INNTEKT_GET_SUCCESS:
      return {
        ...state,
        inntekter: (action as ActionWithPayload).payload
      }

    case types.INNTEKT_GET_FAILURE:
      return {
        ...state,
        inntekter: null
      }

    default:
      return state
  }
}
export default inntektReducer
