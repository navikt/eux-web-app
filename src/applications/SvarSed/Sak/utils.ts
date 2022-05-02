import { ReplySed } from 'declarations/sed'
import { LocalStorageEntry, Sed } from 'declarations/types'
import _ from 'lodash'

export const hasSentStatus = (svarsedId: string, sedStatus: {[k in string]: string | null}): boolean => {
  if (!Object.prototype.hasOwnProperty.call(sedStatus, svarsedId)) {
    return false
  }
  return sedStatus[svarsedId] === 'sent'
}

export const findSavedEntry = (
  svarsedId: string,
  entries: Array<LocalStorageEntry<ReplySed>> | null | undefined
): LocalStorageEntry<ReplySed> | undefined => (
  _.find(entries, (e: LocalStorageEntry<ReplySed>) => e.id === svarsedId)
)

export const hasDraft = (
  connectedSed: Sed,
  entries: Array<LocalStorageEntry<ReplySed>> | null | undefined
): boolean => (
  findSavedEntry(connectedSed.svarsedId, entries) !== undefined
)

export const canEditSed = (sedType: string) => ['F002', 'H001', 'H002', 'U002', 'U004', 'U017'].indexOf(sedType) >= 0

export const canUpdateSed = (sedType: string) => ['F002', 'H001', 'H002', 'U001', 'U002', 'U004', 'U017'].indexOf(sedType) >= 0

export const isSedEditable = (
  connectedSed: Sed,
  entries: Array<LocalStorageEntry<ReplySed>> | null | undefined,
  sedStatus: {[k in string]: string | null}
) => (
  !!connectedSed.lenkeHvisForrigeSedMaaJournalfoeres ||
  (hasDraft(connectedSed, entries) && !hasSentStatus(connectedSed.svarsedId, sedStatus)) ||
  (connectedSed.status === 'new' && canEditSed(connectedSed.sedType)) ||
  (connectedSed.svarsedType && !connectedSed.lenkeHvisForrigeSedMaaJournalfoeres)
)
