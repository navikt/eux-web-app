import * as types from 'constants/actionTypes'
import { ReplySed } from 'declarations/sed'
import { LocalStorageEntry } from 'declarations/types'
import { ActionWithPayload } from 'js-fetch-api'
import _ from 'lodash'
import { Action } from 'redux'

export interface LocalStorageState {
  entries: Array<LocalStorageEntry<ReplySed>> | null | undefined
  // currentEntry !== undefined serves only the purpose of telling SEDEditor that the
  // current replySed came from a localstorage load, and therefore decides if the saving
  // button will be labeled as Update or Save
  currentEntry: LocalStorageEntry<ReplySed> | undefined
}

export const initialLocalStorageState: LocalStorageState = {
  entries: undefined,
  currentEntry: undefined
}

const localStorageReducer = (
  state: LocalStorageState = initialLocalStorageState,
  action: Action = { type: '' }
): LocalStorageState => {
  switch (action.type) {
    case types.LOCALSTORAGE_ENTRIES_LOAD: {
      const items: string | null = window.localStorage.getItem((action as ActionWithPayload).payload.key)
      let entries: Array<LocalStorageEntry<ReplySed>> | null | undefined
      if (_.isString(items)) {
        entries = JSON.parse(items)
      } else {
        entries = null
      }
      return {
        ...state,
        entries: entries
      }
    }

    case types.LOCALSTORAGE_ENTRY_REMOVE: {
      const newEntries = _.cloneDeep(state.entries)
      const index: number = _.findIndex(state.entries, (entry) =>
        entry.id === ((action as ActionWithPayload).payload).entry.id
      )
      if (index >= 0) {
        if (!_.isNil(newEntries)) {
          newEntries.splice(index, 1)
          window.localStorage.setItem(
            (action as ActionWithPayload).payload.key,
            JSON.stringify(newEntries, null, 2))
        }
      }
      return {
        ...state,
        entries: newEntries
      }
    }

    case types.LOCALSTORAGE_REMOVE_ALL : {
      window.localStorage.setItem((action as ActionWithPayload).payload.key, "[]")
      return initialLocalStorageState
    }

    case types.LOCALSTORAGE_ENTRY_SAVE: {
      let newEntries = _.cloneDeep(state.entries)
      const newEntry: LocalStorageEntry<ReplySed> = (action as ActionWithPayload).payload.entry

      if (_.isNil(newEntries)) {
        newEntries = []
      }

      const existsIndex: number = _.findIndex(newEntries, _e => _e.id === newEntry.id)
      if (existsIndex >= 0) {
        newEntries[existsIndex] = (action as ActionWithPayload).payload.entry
      } else {
        newEntries = newEntries.concat(newEntry)
      }

      window.localStorage.setItem(
        (action as ActionWithPayload).payload.key,
        JSON.stringify(newEntries, null, 2))

      return {
        ...state,
        entries: (action as ActionWithPayload).payload.value
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
