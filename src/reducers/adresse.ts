import * as types from 'constants/actionTypes'
import { Adresse } from 'declarations/sed'
import { ActionWithPayload } from '@navikt/fetch'
import { AnyAction } from 'redux'
import _ from 'lodash'

export interface AdresseState {
  adresser: Array<Adresse> | null | undefined
}
export const initialAdresseState: AdresseState = {
  adresser: undefined
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
        adresser: undefined
      }

    case types.ADRESSE_SEARCH_SUCCESS: {
      let newAdresse = (action as ActionWithPayload).payload
      // it can return {} instead of []
      if (_.isEmpty(newAdresse)) {
        newAdresse = []
      }
      return {
        adresser: newAdresse
      }
    }

    case types.ADRESSE_SEARCH_FAILURE:
      return {
        adresser: null
      }

    default:
      return state
  }
}
export default adresseReducer
