import * as types from 'constants/actionTypes'
import { Arbeidsperioder } from 'declarations/types.d'
import { ActionWithPayload } from 'js-fetch-api'
import _ from 'lodash'

export interface ArbeidsgiverState {
  arbeidsperioder: Arbeidsperioder | null | undefined
}

export const initialArbeidsgiverState: ArbeidsgiverState = {
  arbeidsperioder: undefined
}

const arbeidsgiverReducer = (state: ArbeidsgiverState = initialArbeidsgiverState, action: ActionWithPayload = { type: '', payload: undefined }): ArbeidsgiverState => {
  switch (action.type) {
    case types.APP_CLEAN_DATA:
      return initialArbeidsgiverState

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
      const newArbeidsperioder: Arbeidsperioder | null | undefined = _.cloneDeep(state.arbeidsperioder)
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
export default arbeidsgiverReducer
