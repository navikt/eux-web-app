import * as types from 'constants/actionTypes'
import { ActionWithPayload } from 'eessi-pensjon-ui/dist/declarations/types'

export interface FormState {
  sedtype: any;
  buctype: any;
  sektor: any;
  landkode: any;
  institusjon: any;
  saksId: any;
  tema: any;
  tilleggsopplysninger: {
    familierelasjoner: any
    arbeidsforhold: any;
  }
}

export const initialFormState: FormState = {
  sedtype: undefined,
  buctype: undefined,
  sektor: undefined,
  landkode: undefined,
  institusjon: undefined,
  saksId: undefined,
  tema: undefined,
  tilleggsopplysninger: {
    familierelasjoner: undefined,
    arbeidsforhold: undefined
  }
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
    default:
      return state
  }
}

export default formReducer
