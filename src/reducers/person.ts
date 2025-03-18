import * as types from 'constants/actionTypes'
import {PersonInfoPDL, PersonMedFamilie} from 'declarations/types.d'
import { ActionWithPayload } from '@navikt/fetch'
import { AnyAction } from 'redux'

export interface PersonState {
  person: PersonInfoPDL | null | undefined
  personMedFamilie: PersonMedFamilie | null | undefined
  personRelatert: PersonInfoPDL | null | undefined
}

export const initialPersonState: PersonState = {
  person: undefined,
  personMedFamilie: undefined,
  personRelatert: undefined

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
      return {
        ...state,
        person: (action as ActionWithPayload).payload
      }

    case types.PERSON_SEARCH_FAILURE:
      return {
        ...state,
        person: null
      }

    case types.PERSON_RELATERT_SEARCH_REQUEST:
    case types.PERSON_RELATERT_RESET:
      return {
        ...state,
        personRelatert: undefined
      }

    case types.PERSON_RELATERT_SEARCH_FAILURE:
      return {
        ...state,
        personRelatert: null
      }

    case types.PERSON_RELATERT_SEARCH_SUCCESS:
      return {
        ...state,
        personRelatert: (action as ActionWithPayload).payload
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
