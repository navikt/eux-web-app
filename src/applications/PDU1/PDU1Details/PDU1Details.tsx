import { Button, Loader } from '@navikt/ds-react'
import { VerticalSeparatorDiv } from '@navikt/hoykontrast'
import { saveEntry } from 'actions/localStorage'
import SavePDU1Modal from 'applications/PDU1/SavePDU1Modal/SavePDU1Modal'
import Modal from 'components/Modal/Modal'
import { PDU1 } from 'declarations/pd'
import { State } from 'declarations/reducers'
import { LocalStorageEntry } from 'declarations/types'
import _ from 'lodash'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAppDispatch, useAppSelector } from 'store'

export interface PDU1DetailsProps {
}

export interface PDU1DetailsSelector {
  currentEntry: LocalStorageEntry<PDU1> | undefined
  savingPdu1: boolean
  pdu1: PDU1 | null | undefined
}

const mapState = (state: State): PDU1DetailsSelector => ({
  currentEntry: state.localStorage.pdu1.currentEntry,
  savingPdu1: state.loading.savingPdu1,
  pdu1: state.pdu1.pdu1
})

const PDU1Details: React.FC<PDU1DetailsProps> = ({
}: PDU1DetailsProps) => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const { currentEntry, savingPdu1, pdu1 }: PDU1DetailsSelector = useAppSelector(mapState)
  const [_viewSavePdu1Modal, setViewSavePdu1Modal] = useState<boolean>(false)

  if (!pdu1) {
    return <div />
  }

  const onSavePdu1Click = () => {
    if (_.isNil(currentEntry)) {
      setViewSavePdu1Modal(true)
    } else {
      const newCurrentEntry: LocalStorageEntry<PDU1> = _.cloneDeep(currentEntry)
      newCurrentEntry.content = _.cloneDeep(pdu1!)
      dispatch(saveEntry('svarsed', newCurrentEntry))
    }
  }

  return (
    <>
      <Modal
        open={_viewSavePdu1Modal}
        onModalClose={() => setViewSavePdu1Modal(false)}
        modal={{
          closeButton: false,
          modalContent: (
            <SavePDU1Modal
              pdu1={pdu1!}
              onSaved={() => setViewSavePdu1Modal(false)}
              onCancelled={() => setViewSavePdu1Modal(false)}
            />
          )
        }}
      />
      <Button
        variant='secondary'
        data-amplitude={_.isNil(currentEntry) ? 'svarsed.editor.savedraft' : 'svarsed.editor.updatedraft'}
        onClick={onSavePdu1Click}
        disabled={savingPdu1}
      >
        {_.isNil(currentEntry)
          ? t('el:button-save-draft-x', { x: t('label:sed') })
          : t('el:button-update-draft-x', { x: t('label:sed') })}
        {savingPdu1 && <Loader />}
      </Button>
      <VerticalSeparatorDiv />
    </>
  )
}

export default PDU1Details
