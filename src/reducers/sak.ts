import { ActionWithPayload } from '@navikt/fetch'
import * as types from 'constants/actionTypes'
import { FillOutInfoPayload } from 'declarations/sed'
import {ArbeidsperiodeFraAA, Fagsak, Fagsaker, Institusjon, NavRinasak, OpprettetSak, PersonInfoPDL, PersonInfoUtland} from 'declarations/types'
import _ from 'lodash'
import { AnyAction } from 'redux'

interface InstitusjonRequest {
  requestId: string
  consumerIds: Array<string>
  loading: boolean
  institusjoner: Array<Institusjon> | undefined
}

export interface SakState {
  arbeidsperioder: Array<ArbeidsperiodeFraAA>
  buctype: any
  familierelasjonerPDL: Array<PersonInfoPDL>
  familierelasjonerUtland: Array<PersonInfoUtland>
  fagsaker: Fagsaker | undefined | null
  fnr: string | undefined
  institusjon: string | undefined
  institusjonList: Array<Institusjon> | undefined
  institusjonRequests: Record<string, InstitusjonRequest | undefined>
  landkoder: Array<string> | undefined
  landkode: string | undefined
  opprettetSak: OpprettetSak | undefined
  filloutinfo: any | null | undefined
  saksId: any
  sektor: any
  sedtype: any
  tema: any
  unit: any
  fagsakTema: NavRinasak | null | undefined
}

export const initialSakState: SakState = {
  arbeidsperioder: [],
  buctype: undefined,
  fagsaker: undefined,
  familierelasjonerPDL: [],
  familierelasjonerUtland: [],
  fnr: undefined,
  institusjonList: undefined,
  institusjonRequests: {},
  institusjon: undefined,
  landkoder: undefined,
  landkode: undefined,
  opprettetSak: undefined,
  filloutinfo: undefined,
  saksId: undefined,
  sedtype: undefined,
  sektor: undefined,
  tema: undefined,
  unit: undefined,
  fagsakTema: undefined
}

const sakReducer = (state: SakState = initialSakState, action: AnyAction): SakState => {
  switch (action.type) {
    case types.APP_RESET:
    case types.SAK_RESET:
      return initialSakState

    case types.SAK_FAGSAKER_RESET:
    case types.SAK_FAGSAKER_REQUEST:
      return {
        ...state,
        fagsaker: undefined
      }

    case types.SAK_FAGSAKER_SUCCESS:
      return {
        ...state,
        fagsaker: (action as ActionWithPayload).payload.map((f: Fagsak) => {
          return {
            ...f,
            _id: f.nr ? f.nr : "GENERELL_SAK",
          }
        })
      }

    case types.SAK_FAGSAKER_FAILURE:
      return {
        ...state,
        fagsaker: null
      }

    case types.SAK_CREATE_FAGSAK_GENERELL_REQUEST:
    case types.SAK_CREATE_FAGSAK_DAGPENGER_REQUEST:
      return {
        ...state,
        saksId: undefined
      }

    case types.SAK_CREATE_FAGSAK_GENERELL_SUCCESS:
      const fagsakGenerell:Fagsak = (action as ActionWithPayload).payload
      return {
        ...state,
        fagsaker: [{
          ...fagsakGenerell,
          _id: fagsakGenerell.nr ? fagsakGenerell.nr : "GENERELL_SAK",
          system: fagsakGenerell.system ? fagsakGenerell.system : "FS22"
        }],
        saksId: fagsakGenerell.nr ? fagsakGenerell.nr : "GENERELL_SAK",
      }

    case types.SAK_CREATE_FAGSAK_DAGPENGER_SUCCESS:
      const fagsak:Fagsak = (action as ActionWithPayload).payload
      let fSaker = _.cloneDeep(state.fagsaker)
      fSaker?.unshift({
        ...fagsak,
        _id: fagsak.nr ? fagsak.nr : "GENERELL_SAK"
      })

      return {
        ...state,
        fagsaker: fSaker,
        saksId: fagsak.nr ? fagsak.nr : "GENERELL_SAK",
      }

    case types.SAK_CREATE_FAGSAK_GENERELL_FAILURE:
    case types.SAK_CREATE_FAGSAK_DAGPENGER_FAILURE:
      return {
        ...state,
        fagsaker: null,
        saksId: null
      }

    case types.SAK_GET_FAGSAKTEMA_FAILURE:
      return {
        ...state,
        fagsakTema: null
      }

    case types.SAK_GET_FAGSAKTEMA_SUCCESS:{
      return {
        ...state,
        fagsakTema: action.payload
      }
    }

    case types.SAK_FAGSAKTEMA_UPDATE:{
      return {
        ...state,
        fagsakTema: action.payload
      }
    }


    case types.SAK_INSTITUSJONER_REQUEST: {
      const { buctype, landkode, requestId, consumerId } = action.context
      if (!consumerId) {
        return state
      }
      const key = `${buctype}:${landkode}`
      const consumerIds = state.institusjonRequests[key]?.consumerIds ?? []
      return {
        ...state,
        institusjonRequests: {
          ...state.institusjonRequests,
          [key]: {
            requestId,
            consumerIds: consumerIds.includes(consumerId) ? consumerIds : [...consumerIds, consumerId],
            loading: true,
            institusjoner: undefined
          }
        }
      }
    }

    case types.SAK_INSTITUSJONER_SUCCESS:
    case types.SAK_INSTITUSJONER_FAILURE: {
      const { buctype, landkode, requestId, consumerId } = action.context
      const institusjoner = action.type === types.SAK_INSTITUSJONER_SUCCESS ? action.payload : undefined
      if (!consumerId) {
        return { ...state, institusjonList: institusjoner }
      }
      const key = `${buctype}:${landkode}`
      const request = state.institusjonRequests[key]
      if (!request || request.requestId !== requestId) {
        return state
      }
      return {
        ...state,
        institusjonList: institusjoner,
        institusjonRequests: {
          ...state.institusjonRequests,
          [key]: { ...request, loading: false, institusjoner }
        }
      }
    }

    case types.SAK_INSTITUSJONER_RELEASE: {
      const { buctype, landkode, consumerId } = action.context
      const key = `${buctype}:${landkode}`
      const request = state.institusjonRequests[key]
      if (!request?.consumerIds.includes(consumerId)) {
        return state
      }
      const consumerIds = request.consumerIds.filter(id => id !== consumerId)
      const institusjonRequests = { ...state.institusjonRequests }
      if (consumerIds.length) {
        institusjonRequests[key] = { ...request, consumerIds }
      } else {
        delete institusjonRequests[key]
      }
      return { ...state, institusjonRequests }
    }

    case types.SAK_FILLOUTINFO_RESET:
    case types.SAK_FILLOUTINFO_REQUEST:
      return {
        ...state,
        filloutinfo: undefined
      }

    case types.SAK_FILLOUTINFO_FAILURE:
      return {
        ...state,
        filloutinfo: null
      }

    case types.SAK_FILLOUTINFO_SUCCESS: {
      const fillOutInfoPayload: FillOutInfoPayload = (action as ActionWithPayload).payload
      const template = (action as ActionWithPayload).context.template
      const norwegianPin = fillOutInfoPayload.bruker.personInfo.pin?.filter((p) => (p.landkode === 'NOR'))
      return {
        ...state,
        filloutinfo: {
          ...template,
          ...fillOutInfoPayload,
          sak: {
            ...template.sak,
            fornavn: fillOutInfoPayload.bruker.personInfo.fornavn,
            etternavn: fillOutInfoPayload.bruker.personInfo.etternavn,
            foedselsdato: fillOutInfoPayload.bruker.personInfo.foedselsdato,
            kjoenn: fillOutInfoPayload.bruker.personInfo.kjoenn,
            fnr: norwegianPin && norwegianPin.length === 1 ? norwegianPin[0].identifikator : undefined
          }
        }
      }
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

    case types.SAK_FAMILIERELASJONER_ADD: {
      const relasjon: PersonInfoPDL | PersonInfoUtland = (action as ActionWithPayload).payload
      let relasjonPDL: PersonInfoPDL | undefined = undefined
      let relasjonUtland: PersonInfoUtland | undefined = undefined;

      if("fnr" in relasjon){
        relasjonPDL = relasjon
      } else if ("pin" in relasjon) {
        relasjonUtland = relasjon
      }

      return {
        ...state,
        familierelasjonerPDL: relasjonPDL ? (state.familierelasjonerPDL || []).concat(relasjonPDL) : state.familierelasjonerPDL,
        familierelasjonerUtland: relasjonUtland ? (state.familierelasjonerUtland || []).concat(relasjonUtland) : state.familierelasjonerUtland
      }
    }

    case types.SAK_FAMILIERELASJONER_REMOVE: {
      const relasjon: PersonInfoPDL | PersonInfoUtland = (action as ActionWithPayload).payload
      let relasjonPDL: PersonInfoPDL | undefined = undefined
      let relasjonUtland: PersonInfoUtland | undefined = undefined;

      if ("fnr" in relasjon) {
        relasjonPDL = relasjon
      } else if ("pin" in relasjon) {
        relasjonUtland = relasjon
      }

      return {
        ...state,
        familierelasjonerPDL: _.reject(state.familierelasjonerPDL, i => i.fnr === relasjonPDL?.fnr),
        familierelasjonerUtland: _.reject(state.familierelasjonerUtland, i => i.pin === relasjonUtland?.pin)
      }
    }

    default:

      return state
  }
}

export default sakReducer
