import _ from 'lodash'
import { useState } from 'react'

const useAddRemove = <Item extends any>(
  getKeyFunction: (i: Item) => string
): [
  (item: Item | null) => void,
  (item: Item | null) => void,
  (item: Item | null) => boolean,
] => {
  const [_confirmDelete, _setConfirmDelete] = useState<Array<string>>([])

  const addCandidateForDeletion = (item: Item | null) => {
    if (item !== null) {
      _setConfirmDelete(_confirmDelete.concat(getKeyFunction(item)))
    }
  }

  const removeCandidateForDeletion = (item: Item | null) => {
    if (item !== null) {
      _setConfirmDelete(_.filter(_confirmDelete, it => it !== getKeyFunction(item)))
    }
  }

  const isCandidateForDeletion =  (item: Item | null): boolean => !!item && _confirmDelete.indexOf(getKeyFunction(item)) >= 0

  return [
    addCandidateForDeletion,
    removeCandidateForDeletion,
    isCandidateForDeletion
  ]
}

export default useAddRemove
