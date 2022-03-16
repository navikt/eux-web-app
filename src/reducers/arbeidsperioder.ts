import * as types from 'constants/actionTypes'
import { ArbeidsperioderFraAA } from 'declarations/types.d'
import { ActionWithPayload } from '@navikt/fetch'

export type ArbeidsperioderState = ArbeidsperioderFraAA | null

export const initialArbeidsperioderState: ArbeidsperioderState = null

const arbeidsperioderReducer = (state: ArbeidsperioderState = initialArbeidsperioderState, action: ActionWithPayload = { type: '', payload: undefined }): ArbeidsperioderState => {
  switch (action.type) {
    case types.APP_CLEAN:
      return initialArbeidsperioderState

    case types.ARBEIDSPERIODER_GET_REQUEST:
    case types.ARBEIDSPERIODER_GET_FAILURE:
      return null

    case types.ARBEIDSPERIODER_UPDATE:
    case types.ARBEIDSPERIODER_GET_SUCCESS:
      return (action as ActionWithPayload).payload

    default:
      return state
  }
}
export default arbeidsperioderReducer
