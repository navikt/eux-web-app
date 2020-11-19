import * as types from 'constants/actionTypes'
import { BucTyper, Enheter, Kodemaps, Kodeverk, Saksbehandler, ServerInfo, Tema } from 'declarations/types'
import { ActionWithPayload } from 'js-fetch-api'

export interface AppState {
  buctyper: BucTyper | undefined
  enheter: Enheter | undefined

  saksbehandler: Saksbehandler | undefined
  serverinfo: ServerInfo | undefined
  expirationTime: Date | undefined

  familierelasjoner: Array<Kodeverk> | undefined
  kjoenn: Array<Kodeverk> | undefined
  landkoder: Array<Kodeverk> | undefined
  sektor: Array<Kodeverk> | undefined
  sedtyper: Array<Kodeverk> | undefined
  tema: Tema | undefined
  kodemaps: Kodemaps | undefined
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
  kodemaps: undefined
}

const appReducer = (state: AppState = initialAppState, action: ActionWithPayload) => {
  switch (action.type) {
    case types.APP_SAKSBEHANDLER_GET_SUCCESS:
      try {
        (window as any).frontendlogger.info(action.payload)
      } catch (e) {}
      return {
        ...state,
        saksbehandler: action.payload
      }

    case types.APP_SERVERINFO_GET_SUCCESS:
      return {
        ...state,
        serverinfo: action.payload
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
        : new Date(new Date().setMinutes(now.getMinutes() + 10))
      return {
        ...state,
        expirationTime: expirationTime
      }
    }

    case types.APP_LOGMEAGAIN_SUCCESS:
      window.location.href = action.payload.Location
      return

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
