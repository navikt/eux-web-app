import * as types from 'constants/actionTypes'
import _ from 'lodash'
import { ActionWithPayload } from 'eessi-pensjon-ui/dist/declarations/types'

export interface FormState {
  fnr: any;
  sedtype: any;
  buctype: any;
  sektor: any;
  landkode: any;
  institusjon: any;
  saksId: any;
  tema: any;
  familierelasjoner: Array<any>;
  arbeidsforhold: Array<any>;
}

export const initialFormState: FormState = {
  fnr: undefined,
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

const formReducer = (state: FormState = initialFormState, action: ActionWithPayload) => {
  switch (action.type) {
    case types.APP_CLEAN_DATA:
      return initialFormState

    case types.FORM_VALUE_SET:
      return {
        ...state,
        [action.payload.key]: action.payload.value
      }

    case types.FORM_ARBEIDSFORHOLD_ADD:
      return {
        ...state,
        arbeidsforhold: state.arbeidsforhold.concat(action.payload)
      }

    case types.FORM_ARBEIDSFORHOLD_REMOVE:
      return {
        ...state,
        arbeidsforhold: _.filter(state.arbeidsforhold, i => i !== action.payload)
      }

    case types.FORM_FAMILIERELASJONER_ADD:
      return {
        ...state,
        familierelasjoner: state.familierelasjoner.concat(action.payload)
      }

    case types.FORM_FAMILIERELASJONER_REMOVE:
      return {
        ...state,
        familierelasjoner: _.filter(state.familierelasjoner, i => i !== action.payload)
      }
    default:
      return state
  }
}

export default formReducer
