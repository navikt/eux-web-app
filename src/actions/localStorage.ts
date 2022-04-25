import * as types from 'constants/actionTypes'
import { PDU1 } from 'declarations/pd'
import { ReplySed } from 'declarations/sed'
import { LocalStorageEntry } from 'declarations/types'
import { ActionWithPayload } from '@navikt/fetch'
import { LocalStorageNamespaces } from 'reducers/localStorage'

export const loadEntries = (namespace: LocalStorageNamespaces): ActionWithPayload => ({
  type: types.LOCALSTORAGE_ENTRIES_LOAD,
  payload: {
    namespace
  }
})

export const resetCurrentEntry = (namespace: LocalStorageNamespaces): ActionWithPayload => ({
  type: types.LOCALSTORAGE_CURRENTENTRY_RESET,
  payload: {
    namespace
  }
})

export const setCurrentEntry = (namespace: LocalStorageNamespaces, entry: LocalStorageEntry<ReplySed | PDU1>) : ActionWithPayload<{namespace: string, entry: LocalStorageEntry<ReplySed | PDU1>}> => ({
  type: types.LOCALSTORAGE_CURRENTENTRY_SET,
  payload: {
    namespace,
    entry
  }
})

export const removeEntry = (namespace: LocalStorageNamespaces, entry: LocalStorageEntry<ReplySed | PDU1>) => ({
  type: types.LOCALSTORAGE_ENTRY_REMOVE,
  payload: {
    namespace,
    entry
  }
})

export const saveEntry = (namespace: LocalStorageNamespaces, entry: LocalStorageEntry<ReplySed | PDU1>): ActionWithPayload<any> => ({
  type: types.LOCALSTORAGE_ENTRY_SAVE,
  payload: {
    namespace,
    entry
  }
})

export const removeAllEntries = (namespace: LocalStorageNamespaces) => ({
  type: types.LOCALSTORAGE_ALL_REMOVE,
  payload: {
    namespace
  }
})
