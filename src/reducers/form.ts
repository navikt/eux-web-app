import * as types from '../constants/actionTypes'
import _ from 'lodash'
import { ActionWithPayload } from 'js-fetch-api'
import { Action } from 'redux'

export interface FormState {
  fnr: any
  unit: any
  sedtype: any
  buctype: any
  sektor: any
  landkode: any
  institusjon: any
  saksId: any
  tema: any
  familierelasjoner: Array<any>
  arbeidsforhold: Array<any>
}

export const initialFormState: FormState = {
  fnr: undefined,
  unit: undefined,
  sedtype: undefined,
  buctype: undefined,
  sektor: undefined,
  landkode: undefined,
  institusjon: undefined,
  saksId: undefined,
  tema: undefined,
  familierelasjoner: [],
  arbeidsforhold: []
}

const formReducer = (state: FormState = initialFormState, action: Action | ActionWithPayload) => {
  switch (action.type) {
    case types.APP_CLEAN_DATA:
    case types.SAK_PERSON_RESET:
      return initialFormState

    case types.FORM_VALUE_SET:
      return {
        ...state,
        [(action as ActionWithPayload).payload.key]: (action as ActionWithPayload).payload.value
      }

    case types.FORM_ARBEIDSFORHOLD_ADD:
      return {
        ...state,
        arbeidsforhold: state.arbeidsforhold.concat((action as ActionWithPayload).payload)
      }

    case types.FORM_ARBEIDSFORHOLD_REMOVE:
      return {
        ...state,
        arbeidsforhold: _.filter(state.arbeidsforhold, i => i !== (action as ActionWithPayload).payload)
      }

    case types.FORM_FAMILIERELASJONER_ADD:
      return {
        ...state,
        familierelasjoner: state.familierelasjoner.concat((action as ActionWithPayload).payload)
      }

    case types.FORM_FAMILIERELASJONER_REMOVE:
      return {
        ...state,
        familierelasjoner: _.filter(state.familierelasjoner, i => i.fnr !== (action as ActionWithPayload).payload.fnr)
      }
    default:
      return state
  }
}

export default formReducer
