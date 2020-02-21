import * as types from 'constants/actionTypes'
import { ActionWithPayload } from 'eessi-pensjon-ui/dist/declarations/types'

export interface FormState {
  fnrErGyldig: any;
  fnrErSjekket: any;
  sedtype: any;
  buctype: any;
  fnr: any;
  sektor: any;
  tilleggsopplysninger: {
    familierelasjoner: any
    arbeidsforhold: any;
  }
}

export const initialFormState: FormState = {
  fnrErGyldig: undefined,
  fnrErSjekket: undefined,
  sedtype: undefined,
  buctype: undefined,
  fnr: undefined,
  sektor: undefined,
  tilleggsopplysninger: {
    familierelasjoner: undefined,
    arbeidsforhold: undefined
  }
}

const formReducer = (state: FormState = initialFormState, action: ActionWithPayload) => {
  switch (action.type) {

    case types.APP_CLEAN_DATA:
      return initialFormState;

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
