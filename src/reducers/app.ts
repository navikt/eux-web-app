import * as types from 'constants/actionTypes'
import { FeatureToggles, Params } from 'declarations/app'
import {
  BucTyper,
  CountryCodes,
  CountryCodeLists,
  Enheter,
  Kodemaps,
  Kodeverk,
  Saksbehandler,
  ServerInfo,
  Tema, Enhet
} from 'declarations/types'
import _, {cloneDeep} from 'lodash'
import { IS_DEVELOPMENT } from 'constants/environment'
import { AnyAction } from 'redux'
import {setSelectedEnhet} from "../actions/app";

export interface AppState {
  buctyper: BucTyper | undefined
  enheter: Enheter | null | undefined
  selectedEnhet: Enhet | null | undefined
  cdmVersjon: string | undefined
  countryCodes: CountryCodes | null | undefined
  countryCodeMap: {key?: string} | null | undefined

  saksbehandler: Saksbehandler | undefined
  serverinfo: ServerInfo | undefined
  expirationTime: number | undefined

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

  loginRedirect: boolean | undefined
}

export const initialAppState: AppState = {
  saksbehandler: undefined,
  serverinfo: undefined,
  enheter: undefined,
  selectedEnhet: undefined,
  cdmVersjon: undefined,
  countryCodes: undefined,
  countryCodeMap: undefined,
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
  loginRedirect: undefined,

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

    case types.APP_ENHETER_FAILURE:
      return {
        ...state,
        enheter: null
      }

    case types.APP_ENHETER_SUCCESS:{
      const favouriteEnhet = (action.payload as Enheter).find((e: Enhet) => e.erFavoritt)
      return {
        ...state,
        enheter: action.payload,
        selectedEnhet: favouriteEnhet,
      }
    }

    case types.APP_FAVORITTENHET_REQUEST:
      const enheterCopy = cloneDeep(state.enheter)
      const updatedEnheter = enheterCopy?.map((enhet:Enhet) => {
        if(enhet.enhetId === state.selectedEnhet?.enhetId){
          return {
            ...enhet,
            erFavoritt: !!action.context.enhet
          }
        } else {
          return {
            ...enhet,
            erFavoritt: false
          }
        }
      })

      return {
        ...state,
        enheter: updatedEnheter,
        selectedEnhet: {
          ...state.selectedEnhet,
          enhetId: state.selectedEnhet!.enhetId,
          navn: state.selectedEnhet!.navn,
          erFavoritt: !!action.context.enhet
        }
      }

    case types.APP_FAVORITTENHET_SUCCESS:
      return state

    case types.APP_SELECTED_ENHET_SET:
      return {
        ...state,
        selectedEnhet: action.payload
      }

    case types.APP_CDMVERSJON_SUCCESS: {
      return {
        ...state,
        cdmVersjon: action.payload
      }
    }

    case types.APP_COUNTRYCODES_SUCCESS: {
      let countryCodeMap: {key?: string} = {}
      const countryCodes: CountryCodes = action.payload
      Object.keys(countryCodes).forEach(versionKey => {
        Object.keys(countryCodes[versionKey as keyof CountryCodes]).forEach(landKey => {
          countryCodes[versionKey as keyof CountryCodes][landKey as keyof CountryCodeLists].forEach(land => {
            countryCodeMap[land.landkode as keyof {key: string}] = land.landnavn;
          });
        });
      });

      return {
        ...state,
        countryCodes,
        countryCodeMap
      }
    }

    case types.APP_COUNTRYCODES_FAILURE:
      return {
        ...state,
        countryCodes: null,
        countryCodeMap: null
      }


    case types.APP_LOGMEAGAIN_SUCCESS:
      window.location.href = action.context.redirectUrl
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

    case types.APP_PRELOAD:
      return {
        ...state,
        ...action.payload
      }

    case types.APP_SAKSBEHANDLER_SUCCESS: {
      const payload = _.cloneDeep(action.payload)
      const brukernavn = payload.brukernavn
      const navn = payload.navn
      delete payload.brukernavn
      delete payload.navn

      const newFeatureToggles = _.cloneDeep(state.featureToggles)
      if (!_.isEmpty(action.payload)) {
        Object.keys(action.payload).forEach((k: string) => {
          newFeatureToggles[k] = state.params[k] === "false" ? false : action.payload[k]
        })
      }

      return {
        ...state,
        saksbehandler: {
          brukernavn,
          navn,
          featureToggles: newFeatureToggles
        },
        featureToggles: newFeatureToggles
      }
    }

    case types.APP_SERVERINFO_SUCCESS:
      return {
        ...state,
        serverinfo: action.payload
      }

    case types.APP_SESSION_SET:
      return {
        ...state,
        expirationTime: new Date(new Date().setMinutes(new Date().getMinutes() + action.payload.minutes)).getTime()
      }

    case types.APP_UTGAARDATO_SUCCESS: {
      const now = action.payload.naa ? new Date(action.payload.naa) : new Date()
      const expirationTime = action.payload.utgaarDato
        ? new Date(action.payload.utgaarDato)
        : new Date(new Date().setMinutes(now.getMinutes() + 60))
      return {
        ...state,
        expirationTime: expirationTime.getTime()
      }
    }

    case types.SERVER_UNAUTHORIZED_ERROR: {
      return {
        ...state,
        loginRedirect: true
      }
    }

    case types.APP_LOGINREDIRECT_RESET:
    case types.APP_RESET: {
      return {
        ...state,
        loginRedirect: false
      }
    }

    default:
      return state
  }
}

export default appReducer
