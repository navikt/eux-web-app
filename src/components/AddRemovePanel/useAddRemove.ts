import _ from 'lodash'
import { useState } from 'react'

const useAddRemove = (
  initialValue = []
): [
  (key: string) => void,
  (key: string) => void,
  (key: string) => boolean,
] => {

  const [_confirmDelete, _setConfirmDelete] = useState<Array<string>>(initialValue)

  const addCandidateForDeletion = (key: string) => {
    _setConfirmDelete(_confirmDelete.concat(key))
  }

  const removeCandidateForDeletion = (key: string) => {
    _setConfirmDelete(_.filter(_confirmDelete, it => it !== key))
  }

  const hasKey = (key: string): boolean => _confirmDelete.indexOf(key) >= 0

  return [
    addCandidateForDeletion,
    removeCandidateForDeletion,
    hasKey
  ]
}

export default useAddRemove
