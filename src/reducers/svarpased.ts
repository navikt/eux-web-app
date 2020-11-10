import { Arbeidsforhold, Inntekter, Sed } from '../declarations/types'
import { ActionWithPayload } from 'js-fetch-api'
import { Action } from 'redux'
import * as types from '../constants/actionTypes'
import _ from 'lodash'

export interface SvarpasedState {
  arbeidsforhold: Arbeidsforhold;
  familierelasjoner: Array<any>;
  person: any;
  personRelatert: any;
  seds: Array<Sed> | undefined;
  sed: Sed | undefined;
  svarPasedData: any;
  valgteArbeidsforhold: Arbeidsforhold;
  inntekter: Inntekter | undefined;
  selectedInntekter: Inntekter | undefined;
}

export const initialSvarpasedState: SvarpasedState = {
  arbeidsforhold: [],
  seds: undefined,
  sed: undefined,
  person: undefined,
  personRelatert: undefined,
  familierelasjoner: [],
  svarPasedData: undefined,
  valgteArbeidsforhold: [],
  inntekter: undefined,
  selectedInntekter: undefined
}

const svarpasedReducer = (
  state: SvarpasedState = initialSvarpasedState,
  action: Action | ActionWithPayload
) => {
  switch (action.type) {
    case types.SVARPASED_ARBEIDSFORHOLD_GET_SUCCESS:
      return {
        ...state,
        arbeidsforhold: (action as ActionWithPayload).payload
      }

    case types.SVARPASED_ARBEIDSFORHOLD_ADD:
      return {
        ...state,
        valgteArbeidsforhold: state.valgteArbeidsforhold.concat(
          (action as ActionWithPayload).payload
        )
      }

    case types.SVARPASED_ARBEIDSFORHOLD_REMOVE:
      return {
        ...state,
        valgteArbeidsforhold: _.filter(
          state.valgteArbeidsforhold,
          (i) => i !== (action as ActionWithPayload).payload
        )
      }

    case types.SVARPASED_SEDS_GET_SUCCESS:
      return {
        ...state,
        seds: (action as ActionWithPayload).payload
      }

    case types.SVARPASED_SEDS_GET_FAILURE:
      return {
        ...state,
        seds: null
      }

    case types.SVARPASED_PERSON_GET_FAILURE:
      return {
        ...state,
        person: null
      }

    case types.SVARPASED_PERSON_GET_SUCCESS:
      return {
        ...state,
        person: (action as ActionWithPayload).payload
      }

    case types.SVARPASED_PERSON_RELATERT_GET_FAILURE:
      return {
        ...state,
        personRelatert: null
      }

    case types.SVARPASED_PERSON_RELATERT_GET_SUCCESS:
      return {
        ...state,
        personRelatert: (action as ActionWithPayload).payload
      }

    case types.SVARPASED_SENDSVARPASEDDATA_POST_SUCCESS:
      return {
        ...state,
        svarPasedData: (action as ActionWithPayload).payload
      }

    case types.SVARPASED_SENDSVARPASEDDATA_POST_FAILURE:
      return {
        ...state,
        svarPasedData: null
      }

    case types.SVARPASED_SET_SED:
      return {
        ...state,
        sed: (action as ActionWithPayload).payload
      }
    case types.SVARPASED_FAMILIERELASJONER_ADD:
      return {
        ...state,
        familierelasjoner: state.familierelasjoner.concat(
          (action as ActionWithPayload).payload
        )
      }

    case types.SVARPASED_FAMILIERELASJONER_REMOVE:
      return {
        ...state,
        familierelasjoner: _.filter(
          state.familierelasjoner,
          (i) => i.fnr !== (action as ActionWithPayload).payload.fnr
        )
      }

    case types.SVARPASED_INNTEKT_GET_SUCCESS:
      return {
        ...state,
        inntekter: (action as ActionWithPayload).payload
      }

    case types.SVARPASED_SELECTED_INNTEKT_SUCCESS:
      return {
        ...state,
        selectedInntekter: (action as ActionWithPayload).payload
      }

    case types.APP_CLEAN_DATA:

      // keep seds, they are for the sed dropdown options
      return {
        ...initialSvarpasedState,
        seds: state.seds
      }

    case types.SAK_PERSON_RESET:
      return {
        ...state,
        person: undefined
      }

    default:
      return state
  }
}

export default svarpasedReducer
