import * as types from 'constants/actionTypes'
import { Person } from 'declarations/types.d'
import { ActionWithPayload } from 'js-fetch-api'

export interface PersonState {
  person: Person | undefined
  personRelatert: Person | undefined
}

export const initialPersonState: PersonState = {
  person: undefined,
  personRelatert: undefined
}

const personReducer = (state: PersonState = initialPersonState, action: ActionWithPayload = { type: '', payload: undefined }) => {
  switch (action.type) {

    case types.APP_CLEAN_DATA:
      return initialPersonState

    case types.PERSON_SEARCH_REQUEST:
      return {
        ...state,
        person: undefined
      }

    case types.PERSON_SEARCH_SUCCESS:
      return {
        ...state,
        person: (action as ActionWithPayload).payload
      }

    case types.PERSON_RELATERT_GET_FAILURE:
      return {
        ...state,
        personRelatert: null
      }

    case types.PERSON_RELATERT_GET_SUCCESS:
      return {
        ...state,
        personRelatert: (action as ActionWithPayload).payload
      }

    case types.PERSON_SEARCH_FAILURE:
      return {
        ...state,
        person: null
      }
    default:
      return state

  }
}
export default personReducer
