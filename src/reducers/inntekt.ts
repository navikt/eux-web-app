import * as types from 'constants/actionTypes'
import { IInntekter } from 'declarations/types.d'
import { ActionWithPayload } from '@navikt/fetch'
import { AnyAction } from 'redux'

export interface InntektState {
  inntekter: IInntekter | null | undefined
  fra: string | undefined
  til: string | undefined
}

export const initialInntektState: InntektState = {
  inntekter: undefined,
  fra: undefined,
  til: undefined
}

const inntektReducer = (state: InntektState = initialInntektState, action: AnyAction): InntektState => {
  switch (action.type) {
    case types.APP_RESET:
      return initialInntektState

    case types.INNTEKT_REQUEST:
      return {
        ...state,
        inntekter: undefined
      }

    case types.INNTEKT_SUCCESS:
      return {
        ...state,
        inntekter: (action as ActionWithPayload).payload
      }

    case types.INNTEKT_FAILURE:
      return {
        ...state,
        inntekter: null
      }

    default:
      return state
  }
}
export default inntektReducer
