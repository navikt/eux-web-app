import * as types from 'constants/actionTypes'
import { ArbeidsperioderFraAA } from 'declarations/types.d'
import { ActionWithPayload } from '@navikt/fetch'
import { AnyAction } from 'redux'

export type ArbeidsperioderState = ArbeidsperioderFraAA | null | undefined

export const initialArbeidsperioderState: ArbeidsperioderState = undefined

const arbeidsperioderReducer = (state: ArbeidsperioderState = initialArbeidsperioderState, action: AnyAction): ArbeidsperioderState => {
  switch (action.type) {
    case types.APP_RESET:
    case types.ARBEIDSPERIODER_RESET:
      return initialArbeidsperioderState

    case types.ARBEIDSPERIODER_REQUEST:
      return undefined

    case types.ARBEIDSPERIODER_FAILURE:
      return null

    case types.ARBEIDSPERIODER_UPDATE:
    case types.ARBEIDSPERIODER_SUCCESS:
      return (action as ActionWithPayload).payload

    default:
      return state
  }
}
export default arbeidsperioderReducer
