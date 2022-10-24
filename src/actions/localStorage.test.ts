import * as localStorageActions from 'actions/localStorage'
import * as types from 'constants/actionTypes'
import { ReplySed } from 'declarations/sed'
import { LocalStorageEntry } from 'declarations/types'
import getReplySed from 'mocks/svarsed/replySed'
import { LocalStorageNamespaces } from 'reducers/localStorage'

describe('actions/localStorage', () => {
  const namespace: LocalStorageNamespaces = 'svarsed'

  const entry: LocalStorageEntry<ReplySed> = {
    id: 'id',
    name: 'name',
    date: 'date',
    content: getReplySed('H002') as ReplySed
  }

  it('loadEntries()', () => {
    expect(localStorageActions.loadEntries(namespace))
      .toMatchObject({
        type: types.LOCALSTORAGE_ENTRIES_LOAD,
        payload: { namespace }
      })
  })

  it('resetCurrentEntry()', () => {
    expect(localStorageActions.resetCurrentEntry(namespace))
      .toMatchObject({
        type: types.LOCALSTORAGE_CURRENTENTRY_RESET
      })
  })

  it('setCurrentEntry()', () => {
    expect(localStorageActions.setCurrentEntry(namespace, entry))
      .toMatchObject({
        type: types.LOCALSTORAGE_CURRENTENTRY_SET,
        payload: { namespace, entry }
      })
  })

  it('removeEntry()', () => {
    expect(localStorageActions.removeEntry(namespace, entry))
      .toMatchObject({
        type: types.LOCALSTORAGE_ENTRY_REMOVE,
        payload: { namespace, entry }
      })
  })

  it('saveEntry()', () => {
    expect(localStorageActions.saveEntry(namespace, entry))
      .toMatchObject({
        type: types.LOCALSTORAGE_ENTRY_SAVE,
        payload: { namespace, entry }
      })
  })

  it('removeAllEntries()', () => {
    expect(localStorageActions.removeAllEntries(namespace))
      .toMatchObject({
        type: types.LOCALSTORAGE_RESET,
        payload: { namespace }
      })
  })
})
