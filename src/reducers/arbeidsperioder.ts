import * as types from 'constants/actionTypes'
import { ArbeidsperioderFraAA } from 'declarations/types.d'
import { ActionWithPayload } from '@navikt/fetch'
import _ from 'lodash'

export interface ArbeidsperioderState {
  arbeidsperioder: ArbeidsperioderFraAA | null | undefined
}

export const initialArbeidsperioderState: ArbeidsperioderState = {
  arbeidsperioder: undefined
}

const arbeidsperioderReducer = (state: ArbeidsperioderState = initialArbeidsperioderState, action: ActionWithPayload = { type: '', payload: undefined }): ArbeidsperioderState => {
  switch (action.type) {
    case types.APP_CLEAN:
      return initialArbeidsperioderState

    case types.ARBEIDSPERIODER_GET_REQUEST:
      return {
        ...state,
        arbeidsperioder: undefined
      }

    case types.ARBEIDSPERIODER_GET_FAILURE:
      return {
        ...state,
        arbeidsperioder: null
      }

    case types.ARBEIDSPERIODER_GET_SUCCESS:
      return {
        ...state,
        arbeidsperioder: (action as ActionWithPayload).payload
      }

    case types.ARBEIDSPERIODER_UPDATE: {
      const newArbeidsperioder: ArbeidsperioderFraAA | null | undefined = _.cloneDeep(state.arbeidsperioder)
      if (_.isNil(newArbeidsperioder)) {
        return state
      }
      return {
        ...state,
        arbeidsperioder: {
          ...state.arbeidsperioder!,
          arbeidsperioder: (action as ActionWithPayload).payload
        }
      }
    }

    default:
      return state
  }
}
export default arbeidsperioderReducer
