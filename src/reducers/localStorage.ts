import * as types from 'constants/actionTypes'
import { ReplySed } from 'declarations/sed'
import { LocalStorageEntry } from 'declarations/types'
import { ActionWithPayload } from 'js-fetch-api'
import _ from 'lodash'
import { Action } from 'redux'

export interface LocalStorageState {
  savedEntries: Array<LocalStorageEntry<ReplySed>> | null | undefined
}

export const initialLocalStorageState: LocalStorageState = {
  savedEntries: undefined
}

const localStorageReducer = (
  state: LocalStorageState = initialLocalStorageState,
  action: Action = { type: '' }
) => {
  switch (action.type) {
    case types.LOCALSTORAGE_SAVEDENTRIES_LOAD: {
      const items: string | null = window.localStorage.getItem((action as ActionWithPayload).payload.key)
      let savedEntries: Array<LocalStorageEntry<any>> | null | undefined
      if (_.isString(items)) {
        savedEntries = JSON.parse(items)
      } else {
        savedEntries = null
      }
      return {
        ...state,
        savedEntries: savedEntries
      }
    }

    case types.LOCALSTORAGE_SAVEDENTRIES_SAVE: {
      window.localStorage.setItem(
        (action as ActionWithPayload).payload.key,
        JSON.stringify((action as ActionWithPayload).payload.value, null, 2))

      return {
        ...state,
        savedEntries: (action as ActionWithPayload).payload.value
      }
    }

    default:
      return state
  }
}

export default localStorageReducer
