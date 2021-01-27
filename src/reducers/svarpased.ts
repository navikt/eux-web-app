import { Arbeidsforhold, FamilieRelasjon, Inntekter, Person, ReplySed, Seds, Validation } from 'declarations/types'
import { ActionWithPayload } from 'js-fetch-api'
import { Action } from 'redux'
import * as types from 'constants/actionTypes'
import _ from 'lodash'

export interface SvarpasedState {
  arbeidsforholdList: Arbeidsforhold
  familierelasjoner: Array<any>
  inntekter: Inntekter | undefined
  parentSed: string | undefined
  person: Person | undefined
  personPlusRelations: Array<Person | FamilieRelasjon> | undefined
  personRelatert: any
  previousParentSed: string | undefined
  previousReplySed: ReplySed | undefined
  replySed: ReplySed | undefined
  saksnummerOrFnr: string | undefined
  selectedInntekter: Inntekter | undefined
  seds: Seds | undefined
  svarPasedData: any
  valgteArbeidsforhold: Arbeidsforhold,
  validation: Validation
}

export const initialSvarpasedState: SvarpasedState = {
  arbeidsforholdList: [],
  familierelasjoner: [],
  inntekter: undefined,
  parentSed: undefined,
  person: undefined,
  personPlusRelations: [],
  personRelatert: undefined,
  previousParentSed: undefined,
  previousReplySed: undefined,
  replySed: undefined,
  seds: undefined,
  saksnummerOrFnr: undefined,
  selectedInntekter: undefined,
  svarPasedData: undefined,
  valgteArbeidsforhold: [],
  validation: {}
}

const svarpasedReducer = (
  state: SvarpasedState = initialSvarpasedState,
  action: Action | ActionWithPayload = { type: '', payload: undefined }
) => {
  switch (action.type) {
    case types.SVARPASED_ARBEIDSFORHOLDLIST_GET_SUCCESS:
      return {
        ...state,
        arbeidsforholdList: (action as ActionWithPayload).payload
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

    case types.SVARPASED_REPLYSED_QUERY_SUCCESS:
      return {
        ...state,
        previousReplySed: state.replySed,
        replySed: (action as ActionWithPayload).payload
      }

    case types.SVARPASED_REPLYSED_QUERY_FAILURE:
      return {
        ...state,
        previousReplySed: state.replySed,
        replySed: null
      }

    case types.SVARPASED_PERSON_GET_FAILURE:
      return {
        ...state,
        person: null,
        personPlusRelations: []
      }

    case types.SVARPASED_PERSON_GET_SUCCESS:

      const person: Person = (action as ActionWithPayload).payload
      let personPlusRelations: Array<Person | FamilieRelasjon> = []
      person.personopplysninger = {
        fornavn: person.fornavn,
        etternavn: person.etternavn,
        kjoenn: person.kjoenn,
        fodselsdato: person.fdato,
        norskpersonnummer: person.fnr
      }

      if (person?.relasjoner) {
        personPlusRelations = personPlusRelations.concat(
          person?.relasjoner.map(r => ({
            fnr: r.fnr,
            fdato: r.fdato,
            fornavn: r.fornavn,
            etternavn: r.etternavn,
            kjoenn: r.kjoenn,
            personopplysninger: {
              fornavn: r.fornavn,
              etternavn: r.etternavn,
              kjoenn: r.kjoenn,
              fodselsdato: r.fdato,
              norskpersonnummer: person.fnr
            },
            adresser: [{
              land: r.land
            }],
            familierelasjon: {
              type: r.rolle
            },
            nasjonaliteter: [{
              nasjonalitet: r.statsborgerskap
            }]
          } as Person))
        )
      }
      if (person) {
        personPlusRelations = personPlusRelations.concat(person).reverse()
      }

      return {
        ...state,
        person: person,
        personPlusRelations: personPlusRelations
      }

    case types.SVARPASED_PERSONPLUSRELATIONS_SET:
      return {
        ...state,
        personPlusRelations: (action as ActionWithPayload).payload
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

    case types.SVARPASED_SAKSNUMMERORFNR_QUERY_SUCCESS:
      return {
        ...state,
        seds: (action as ActionWithPayload).payload,
        saksnummerOrFnr: (action as ActionWithPayload).context.saksnummerOrFnr
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

    case types.SVARPASED_PARENTSED_SET:
      return {
        ...state,
        previousParentSed: state.parentSed,
        parentSed: (action as ActionWithPayload).payload
      }

    case types.SVARPASED_REPLYSED_RESET:
      return {
        ...state,
        previousReplySed: state.replySed,
        replySed: undefined
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
        seds: state.seds,
        previousParentSed: state.previousParentSed,
        parentSed: state.parentSed,
        previousReplySed: state.previousReplySed,
        replySed: state.replySed
      }

    case types.SVARPASED_PERSON_RESET:
      return {
        ...state,
        person: null,
        personPlusRelations: []
      }

    case types.SVARPASED_PERSON_RELATERT_RESET:
      return {
        ...state,
        personRelatert: undefined
      }

    case types.SVARPASED_VALIDATION_ALL_SET:
      return {
        ...state,
        validation: (action as ActionWithPayload).payload
      }

    case types.SVARPASED_VALIDATION_SINGLE_SET:
      const newValidation = _.cloneDeep(state.validation)
      newValidation[(action as ActionWithPayload).payload.key] = (action as ActionWithPayload).payload.value
      return {
        ...state,
        validation: newValidation
      }

    default:
      return state
  }
}

export default svarpasedReducer
