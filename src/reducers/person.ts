import * as types from 'constants/actionTypes'
import {Person, PersonMedFamilie} from 'declarations/types.d'
import { ActionWithPayload } from '@navikt/fetch'
import { AnyAction } from 'redux'

export interface PersonState {
  person: Person | null | undefined
  personMedFamilie: PersonMedFamilie | null | undefined
}

export const initialPersonState: PersonState = {
  person: undefined,
  personMedFamilie: undefined
}

const personReducer = (
  state: PersonState = initialPersonState,
  action: AnyAction
): PersonState => {
  switch (action.type) {
    case types.APP_RESET:
    case types.PERSON_RESET:
      return initialPersonState

    case types.PERSON_SEARCH_REQUEST:
    case types.PERSON_SEARCH_RESET:
      return {
        ...state,
        person: undefined
      }

    case types.PERSON_SEARCH_SUCCESS:
      const personPayload = (action as ActionWithPayload).payload
      return {
        ...state,
        person: {
          ...personPayload,
          statsborgerskapList: personPayload.statsborgerskap
        }
      }

    case types.PERSON_SEARCH_FAILURE:
      return {
        ...state,
        person: null
      }

    case types.PERSON_MED_FAMILIE_SEARCH_REQUEST:
      return {
        ...state,
        personMedFamilie: undefined
      }

    case types.PERSON_MED_FAMILIE_SEARCH_SUCCESS:
      return {
        ...state,
        personMedFamilie: (action as ActionWithPayload).payload
      }

    case types.PERSON_MED_FAMILIE_SEARCH_FAILURE:
      return {
        ...state,
        personMedFamilie: null
      }


    default:
      return state
  }
}
export default personReducer
