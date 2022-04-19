import { ActionWithPayload } from '@navikt/fetch'
import _ from 'lodash'
import * as types from 'constants/actionTypes'
import {
  ArbeidsperiodeFraAA,
  FagSaker,
  OldFamilieRelasjon,
  Institusjon,
  OpprettetSak,
  Person
} from 'declarations/types'
import { AnyAction } from 'redux'

export interface SakState {
  arbeidsperioder: Array<ArbeidsperiodeFraAA>
  buctype: any
  familierelasjoner: Array<OldFamilieRelasjon>
  fagsaker: FagSaker | undefined | null
  fnr: string | undefined
  institusjon: string | undefined
  institusjonList: Array<Institusjon> | undefined
  landkode: string | undefined
  opprettetSak: OpprettetSak | undefined
  person: Person | null | undefined
  personRelatert: OldFamilieRelasjon | null | undefined
  saksId: any
  sektor: any
  sedtype: any
  tema: any
  unit: any
}

export const initialSakState: SakState = {
  arbeidsperioder: [],
  buctype: undefined,
  fagsaker: undefined,
  familierelasjoner: [],
  fnr: undefined,
  institusjonList: undefined,
  institusjon: undefined,
  landkode: undefined,
  opprettetSak: undefined,
  person: undefined,
  personRelatert: undefined,
  saksId: undefined,
  sedtype: undefined,
  sektor: undefined,
  tema: undefined,
  unit: undefined
}

const sakReducer = (state: SakState = initialSakState, action: AnyAction): SakState => {
  switch (action.type) {
    case types.APP_CLEAN:
    case types.SAK_CLEAN_DATA:
      return initialSakState

    case types.SAK_FAGSAKER_RESET:
    case types.SAK_FAGSAKER_GET_REQUEST:
      return {
        ...state,
        fagsaker: undefined
      }

    case types.SAK_FAGSAKER_GET_SUCCESS:
      return {
        ...state,
        fagsaker: (action as ActionWithPayload).payload
      }

    case types.SAK_FAGSAKER_GET_FAILURE:
      return {
        ...state,
        fagsaker: null
      }

    case types.SAK_INSTITUSJONER_GET_SUCCESS:
      return {
        ...state,
        institusjonList: (action as ActionWithPayload).payload
      }

    case types.SAK_LANDKODER_GET_SUCCESS:
      return {
        ...state,
        landkode: (action as ActionWithPayload).payload
      }

    case types.PERSON_SEARCH_FAILURE:
      return {
        ...state,
        person: null
      }

    case types.PERSON_SEARCH_SUCCESS:
      return {
        ...state,
        person: (action as ActionWithPayload).payload
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

    case types.PERSON_SEARCH_RESET:
      return {
        ...state,
        person: undefined
      }

    case types.PERSON_RELATERT_SEARCH_RESET:
      return {
        ...state,
        personRelatert: undefined
      }

    case types.SAK_SEND_RESET:
      return {
        ...state,
        opprettetSak: undefined
      }

    case types.SAK_SEND_SUCCESS:
      return {
        ...state,
        opprettetSak: (action as ActionWithPayload).payload
      }

    case types.SAK_PROPERTY_SET:
      return {
        ...state,
        [(action as ActionWithPayload).payload.key]: (action as ActionWithPayload).payload.value
      }

    case types.SAK_ARBEIDSPERIODER_ADD:
      return {
        ...state,
        arbeidsperioder: (state.arbeidsperioder || []).concat((action as ActionWithPayload).payload)
      }

    case types.SAK_ARBEIDSPERIODER_REMOVE:
      return {
        ...state,
        arbeidsperioder: _.reject(state.arbeidsperioder, i => _.isEqual(i, (action as ActionWithPayload).payload))
      }

    case types.SAK_FAMILIERELASJONER_ADD:
      return {
        ...state,
        familierelasjoner: (state.familierelasjoner || []).concat((action as ActionWithPayload).payload)
      }

    case types.SAK_FAMILIERELASJONER_REMOVE:
      return {
        ...state,
        familierelasjoner: _.reject(state.familierelasjoner, i => i.fnr === (action as ActionWithPayload).payload.fnr)
      }

    default:

      return state
  }
}

export default sakReducer
