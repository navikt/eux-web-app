import * as types from 'constants/actionTypes'
import { ReplySed } from 'declarations/sed'
import { LocalStorageEntry } from 'declarations/types'
import { ActionWithPayload } from 'js-fetch-api'

export const loadEntries = (key: string): ActionWithPayload => ({
  type: types.LOCALSTORAGE_ENTRIES_LOAD,
  payload: {
    key: key
  }
})

export const setCurrentEntry = (entry: LocalStorageEntry<ReplySed>) : ActionWithPayload<LocalStorageEntry<ReplySed>> => ({
  type: types.LOCALSTORAGE_CURRENTENTRY_SET,
  payload: entry
})

export const removeEntry = (key: string, entry: LocalStorageEntry<ReplySed>) => ({
  type: types.LOCALSTORAGE_ENTRY_REMOVE,
  payload: {
    key: key,
    entry: entry
  }
})

export const saveEntry = (key: string, entry: LocalStorageEntry<ReplySed>): ActionWithPayload<any> => ({
  type: types.LOCALSTORAGE_ENTRY_SAVE,
  payload: {
    key: key,
    entry: entry
  }
})
