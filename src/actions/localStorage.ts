import * as types from 'constants/actionTypes'
import { ReplySed } from 'declarations/sed'
import { LocalStorageEntry } from 'declarations/types'
import { ActionWithPayload } from 'js-fetch-api'

export const loadEntries = (namespace: string, key: string): ActionWithPayload => ({
  type: types.LOCALSTORAGE_ENTRIES_LOAD,
  payload: {
    namespace: namespace,
    key: key
  }
})

export const resetCurrentEntry = (namespace: string): ActionWithPayload => ({
  type: types.LOCALSTORAGE_CURRENTENTRY_RESET,
  payload: {
    namespace: namespace
  }
})

export const setCurrentEntry = (namespace: string, entry: LocalStorageEntry<ReplySed>) : ActionWithPayload<{namespace: string, entry: LocalStorageEntry<ReplySed>}> => ({
  type: types.LOCALSTORAGE_CURRENTENTRY_SET,
  payload: {
    namespace: namespace,
    entry: entry
  }
})

export const removeEntry = (namespace: string, key: string, entry: LocalStorageEntry<ReplySed>) => ({
  type: types.LOCALSTORAGE_ENTRY_REMOVE,
  payload: {
    namespace: namespace,
    key: key,
    entry: entry
  }
})

export const saveEntry = (namespace: string, key: string, entry: LocalStorageEntry<ReplySed>): ActionWithPayload<any> => ({
  type: types.LOCALSTORAGE_ENTRY_SAVE,
  payload: {
    namespace: namespace,
    key: key,
    entry: entry
  }
})

export const removeAll = (namespace: string, key: string) => ({
  type: types.LOCALSTORAGE_REMOVE_ALL,
  payload: {
    namespace: namespace,
    key: key
  }
})
