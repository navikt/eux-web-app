import { ActionWithPayload } from 'js-fetch-api'
import _ from 'lodash'
import * as types from '../constants/actionTypes'
import { Arbeidsforhold, FagSaker, OpprettetSak } from '../declarations/types'

export interface SakState {
  arbeidsforhold: Arbeidsforhold | undefined;
  fagsaker: FagSaker | undefined | null;
  institusjoner: any;
  person: any;
  opprettetSak: OpprettetSak | undefined;
  personRelatert: any;

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
  arbeidsforholdList: Array<any> | undefined
}

export const initialSakState: SakState = {
  arbeidsforholdList: undefined,
  fagsaker: undefined,
  institusjoner: undefined,
  person: undefined,
  opprettetSak: undefined,
  personRelatert: undefined,

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

const sakReducer = (state: SakState = initialSakState, action: ActionWithPayload) => {
  switch (action.type) {
    case types.SAK_ARBEIDSFORHOLDLIST_GET_SUCCESS:
      return {
        ...state,
        arbeidsforholdList: action.payload
      }

    case types.SAK_FAGSAKER_GET_REQUEST:
      return {
        ...state,
        fagsaker: undefined
      }

    case types.SAK_FAGSAKER_GET_SUCCESS:
      return {
        ...state,
        fagsaker: action.payload
      }

    case types.SAK_FAGSAKER_GET_FAILURE:
      return {
        ...state,
        fagsaker: null
      }

    case types.SAK_FAGSAKER_RESET:
      return {
        ...state,
        fagsaker: undefined
      }

    case types.SAK_INSTITUSJONER_GET_SUCCESS:
      return {
        ...state,
        institusjoner: action.payload
      }

    case types.SAK_LANDKODER_GET_SUCCESS:
      return {
        ...state,
        landkoder: action.payload
      }

    case types.SAK_PERSON_GET_FAILURE:
      return {
        ...state,
        person: null
      }

    case types.SAK_PERSON_GET_SUCCESS:
      return {
        ...state,
        person: action.payload
      }

    case types.SAK_PERSON_RELATERT_GET_FAILURE:
      return {
        ...state,
        personRelatert: null
      }

    case types.SAK_PERSON_RELATERT_GET_SUCCESS:
      return {
        ...state,
        personRelatert: action.payload
      }

    case types.SAK_PERSON_RESET:
      return {
        ...state,
        person: undefined
      }

    case types.SAK_PERSON_RELATERT_RESET:
      return {
        ...state,
        personRelatert: undefined
      }

    case types.SAK_SEND_SUCCESS:
      return {
        ...state,
        opprettetSak: action.payload
      }

    case types.APP_CLEAN_DATA:
      // reset all but stuff that comes from eessi-kodeverk
      return {
        ...state,
        arbeidsforhold: undefined,
        fagsaker: undefined,
        institusjoner: undefined,
        person: undefined,
        opprettetSak: undefined,
        personRelatert: undefined
      }

    case types.SAK_PERSON_RESET:
      return initialFormState

    case types.SAK_PROPERTY_SET:
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

export default sakReducer
