import * as types from 'constants/actionTypes'
import { FeatureToggles, Params } from 'declarations/app'
import { BucTyper, Enheter, Kodemaps, Kodeverk, Saksbehandler, ServerInfo, Tema } from 'declarations/types'
import _ from 'lodash'
import { IS_DEVELOPMENT } from 'constants/environment'
import { AnyAction } from 'redux'

export interface AppState {
  buctyper: BucTyper | undefined
  enheter: Enheter | undefined

  saksbehandler: Saksbehandler | undefined
  serverinfo: ServerInfo | undefined
  expirationTime: Date | undefined

  navn: string | undefined
  brukernavn: string | undefined

  familierelasjoner: Array<Kodeverk> | undefined
  kjoenn: Array<Kodeverk> | undefined
  landkoder: Array<Kodeverk> | undefined
  sektor: Array<Kodeverk> | undefined
  sedtyper: Array<Kodeverk> | undefined
  tema: Tema | undefined
  kodemaps: Kodemaps | undefined

  params: Params
  featureToggles: FeatureToggles
}

export const initialAppState: AppState = {
  saksbehandler: undefined,
  serverinfo: undefined,
  enheter: undefined,
  expirationTime: undefined,

  // comes from eessi-kodeverk
  landkoder: undefined,
  buctyper: undefined,
  familierelasjoner: undefined,
  kjoenn: undefined,
  sektor: undefined,
  sedtyper: undefined,
  tema: undefined,
  kodemaps: undefined,

  brukernavn: undefined,
  navn: undefined,

  params: {},
  featureToggles: {
    featureSvarsedU: false,
    featureSvarsedH001: IS_DEVELOPMENT,
    featurePdu1: IS_DEVELOPMENT
  }
}

const appReducer = (state: AppState = initialAppState, action: AnyAction): AppState => {
  let newParams: Params

  switch (action.type) {
    case types.APP_CLIPBOARD_COPY:
      navigator.clipboard.writeText(action.payload)
      return state

    case types.APP_PARAM_SET:
      newParams = _.cloneDeep(state.params)
      newParams[action.payload.key] = action.payload.value
      return {
        ...state,
        params: newParams
      }

    case types.APP_PARAM_UNSET:
      newParams = _.cloneDeep(state.params)
      delete newParams[action.payload.key]
      return {
        ...state,
        params: newParams
      }

    case types.APP_SAKSBEHANDLER_GET_SUCCESS: {
      const payload = _.cloneDeep(action.payload)
      const brukernavn = payload.brukernavn
      const navn = payload.navn
      delete payload.brukernavn
      delete payload.navn

      return {
        ...state,
        brukernavn,
        navn,
        featureToggles: {
          ...state.featureToggles,
          ...payload
        }
      }
    }

    case types.APP_SERVERINFO_GET_SUCCESS:
      return {
        ...state,
        serverinfo: action.payload
      }

    case types.APP_SESSION_SET:
      return {
        ...state,
        expirationTime: new Date(new Date().setMinutes(new Date().getMinutes() + action.payload.minutes))
      }

    case types.APP_ENHETER_GET_SUCCESS:
      return {
        ...state,
        enheter: action.payload
      }

    case types.APP_UTGAARDATO_GET_SUCCESS: {
      const now = action.payload.naa ? new Date(action.payload.naa) : new Date()
      const expirationTime = action.payload.utgaarDato
        ? new Date(action.payload.utgaarDato)
        : new Date(new Date().setMinutes(now.getMinutes() + 60))
      return {
        ...state,
        expirationTime
      }
    }

    case types.APP_LOGMEAGAIN_SUCCESS:
      window.location.href = action.context.redirectUrl
      return state

    case types.APP_PRELOAD:
      return {
        ...state,
        ...action.payload
      }

    default:
      return state
  }
}

export default appReducer
