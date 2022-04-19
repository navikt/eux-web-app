import * as types from 'constants/actionTypes'
import { Adresse } from 'declarations/sed'
import { ActionWithPayload } from '@navikt/fetch'
import { AnyAction } from 'redux'

export interface AdresseState {
  adresse: Array<Adresse> | null | undefined
}
export const initialAdresseState: AdresseState = {
  adresse: undefined
}

const adresseReducer = (
  state: AdresseState = initialAdresseState,
  action: AnyAction
): AdresseState => {
  switch (action.type) {
    case types.APP_CLEAN:
      return initialAdresseState

    case types.ADRESSE_SEARCH_REQUEST:
    case types.ADRESSE_SEARCH_RESET:
      return {
        adresse: undefined
      }

    case types.ADRESSE_SEARCH_SUCCESS:
      return {
        adresse: (action as ActionWithPayload).payload
      }

    case types.ADRESSE_SEARCH_FAILURE:
      return {
        adresse: null
      }

    default:
      return state
  }
}
export default adresseReducer
