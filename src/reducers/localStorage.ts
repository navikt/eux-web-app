import * as types from 'constants/actionTypes'
import { ReplySed } from 'declarations/sed'
import { LocalStorageEntry } from 'declarations/types'
import { ActionWithPayload } from 'js-fetch-api'
import _ from 'lodash'
import { Action } from 'redux'

export interface LocalStorageState {
  savedEntries: Array<LocalStorageEntry<ReplySed>> | null | undefined
  // savedEntry !== undefined serves only the purpose of telling SEDEditor that the
  // current replySed came from a localstorage load. Do not use this replySed for
  // anything else!
  currentEntry: LocalStorageEntry<ReplySed> | undefined
}

export const initialLocalStorageState: LocalStorageState = {
  savedEntries: undefined,
  currentEntry: undefined
}

const localStorageReducer = (
  state: LocalStorageState = initialLocalStorageState,
  action: Action = { type: '' }
) => {
  switch (action.type) {
    case types.LOCALSTORAGE_SAVEDENTRIES_LOAD: {
      const items: string | null = window.localStorage.getItem((action as ActionWithPayload).payload.key)
      let savedEntries: Array<LocalStorageEntry<ReplySed>> | null | undefined
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

    case types.LOCALSTORAGE_SAVEDENTRY_REMOVE: {
      const newSavedEntries = _.cloneDeep(state.savedEntries)
      const index: number = _.findIndex(state.savedEntries, (entry) =>
        entry.id === ((action as ActionWithPayload).payload).entry.content.id
      )
      if (index >= 0) {
        if (!_.isNil(newSavedEntries)) {
          newSavedEntries.splice(index, 1)
          window.localStorage.setItem(
            (action as ActionWithPayload).payload.key,
            JSON.stringify(newSavedEntries, null, 2))
        }
      }
      return {
        ...state,
        savedEntries: newSavedEntries
      }
    }

    case types.LOCALSTORAGE_SAVEDENTRY_SAVE: {
      let newSavedEntries = _.cloneDeep(state.savedEntries)
      const newEntry: LocalStorageEntry<ReplySed> = (action as ActionWithPayload).payload.entry

      if (_.isNil(newSavedEntries)) {
        newSavedEntries = []
      }

      const existsIndex: number = _.findIndex(newSavedEntries, _e => _e.id === newEntry.id)
      if (existsIndex >= 0) {
        newSavedEntries[existsIndex] = (action as ActionWithPayload).payload.entry
      } else {
        newSavedEntries = newSavedEntries.concat(newEntry)
      }

      window.localStorage.setItem(
        (action as ActionWithPayload).payload.key,
        JSON.stringify(newSavedEntries, null, 2))

      return {
        ...state,
        savedEntries: (action as ActionWithPayload).payload.value
      }
    }

    case types.LOCALSTORAGE_CURRENTENTRY_SET: {
      return {
        ...state,
        currentEntry: (action as ActionWithPayload).payload
      }
    }

    case types.SVARPASED_MODE_SET:
      return {
        ...state,
        currentEntry: (action as ActionWithPayload).payload === 'selection'
          ? undefined
          : state.currentEntry
      }

    default:
      return state
  }
}

export default localStorageReducer
