import { Close, Edit, Email, Send, Star } from '@navikt/ds-icons'
import { Button, Detail, Label, Loader } from '@navikt/ds-react'
import { FlexBaseDiv, HorizontalSeparatorDiv, PileCenterDiv, VerticalSeparatorDiv } from '@navikt/hoykontrast'
import { saveEntry } from 'actions/localStorage'
import SaveSEDModal from 'applications/SvarSed/SaveSEDModal/SaveSEDModal'
import Modal from 'components/Modal/Modal'
import { State } from 'declarations/reducers'
import { ReplySed } from 'declarations/sed.d'
import { LocalStorageEntry } from 'declarations/types'
import _ from 'lodash'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAppDispatch, useAppSelector } from 'store'

export interface SEDDetailsSelector {
  currentEntry: LocalStorageEntry<ReplySed> | undefined
  savingSed: boolean
  replySed: ReplySed | null | undefined
}

const mapState = (state: State): SEDDetailsSelector => ({
  currentEntry: state.localStorage.svarsed.currentEntry,
  savingSed: state.loading.savingSed,
  replySed: state.svarsed.replySed
})

const SEDDetails: React.FC = () => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()

  const { currentEntry, savingSed, replySed }: SEDDetailsSelector = useAppSelector(mapState)
  const [_viewSaveSedModal, setViewSaveSedModal] = useState<boolean>(false)

  if (!replySed) {
    return <div />
  }

  const onSaveSedClick = () => {
    if (_.isNil(currentEntry)) {
      setViewSaveSedModal(true)
    } else {
      const newCurrentEntry: LocalStorageEntry<ReplySed> = _.cloneDeep(currentEntry)
      newCurrentEntry.content = _.cloneDeep(replySed!)
      dispatch(saveEntry('svarsed', newCurrentEntry))
    }
  }

  return (
    <>
      <Modal
        open={_viewSaveSedModal}
        onModalClose={() => setViewSaveSedModal(false)}
        modal={{
          closeButton: false,
          modalContent: (
            <SaveSEDModal
              replySed={replySed!}
              onSaved={() => setViewSaveSedModal(false)}
              onCancelled={() => setViewSaveSedModal(false)}
            />
          )
        }}
      />
      <Button
        variant='secondary'
        data-amplitude={_.isNil(currentEntry) ? 'svarsed.editor.savedraft' : 'svarsed.editor.updatedraft'}
        onClick={onSaveSedClick}
        disabled={savingSed}
      >
        {_.isNil(currentEntry)
          ? t('el:button-save-draft-x', { x: t('label:sed') })
          : t('el:button-update-draft-x', { x: t('label:sed') })}
        {savingSed && <Loader />}
      </Button>
      <VerticalSeparatorDiv />
      <FlexBaseDiv>
        <PileCenterDiv style={{ alignItems: 'center' }} title={t('')}>
          {replySed?.sed?.status === 'received' && <Email width='20' height='20' />}
          {replySed?.sed?.status === 'sent' && <Send width='20' height='20' />}
          {(_.isNil(replySed?.sed) || replySed?.sed?.status === 'new') && <Star width='20' height='20' />}
          {replySed?.sed?.status === 'active' && <Edit width='20' height='20' />}
          {replySed?.sed?.status === 'cancelled' && <Close width='20' height='20' />}
          <VerticalSeparatorDiv size='0.35' />
          <Detail>
            {t('app:status-received-' + (replySed?.sed?.status?.toLowerCase() ?? 'new'))}
          </Detail>
        </PileCenterDiv>
        <HorizontalSeparatorDiv />
        <Label>
          {replySed?.sedType} - {t('buc:' + replySed?.sedType)}
        </Label>
      </FlexBaseDiv>
    </>
  )
}

export default SEDDetails
