import { JoarkBrowser } from 'applications/Vedlegg/JoarkBrowser/JoarkBrowser'
import SEDAttachmentModal from 'applications/Vedlegg/SEDAttachmentModal/SEDAttachmentModal'
import {
  JoarkBrowserItem,
  JoarkBrowserItems
} from 'declarations/attachments'
import _ from 'lodash'
import { buttonLogger } from 'metrics/loggers'
import { Button } from '@navikt/ds-react'
import { VerticalSeparatorDiv } from 'nav-hoykontrast'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

export interface AttachmentsProps {
  fnr: string | undefined
  onAttachmentsChanged: (items: JoarkBrowserItems) => void
}

const Attachments: React.FC<AttachmentsProps> = ({
  fnr,
  onAttachmentsChanged
}: AttachmentsProps): JSX.Element => {
  const { t } = useTranslation()
  const [_attachmentsTableVisible, setAttachmentsTableVisible] = useState<boolean>(false)
  const [_items, setItems] = useState<JoarkBrowserItems>([])

  const sedAttachmentSorter = (a: JoarkBrowserItem, b: JoarkBrowserItem): number => {
    if (b.type === 'joark' && a.type === 'sed') return -1
    if (b.type === 'sed' && a.type === 'joark') return 1
    return b.key.localeCompare(a.key)
  }

  const onJoarkAttachmentsChanged = (jbi: JoarkBrowserItems): void => {
    const sedOriginalAttachments: JoarkBrowserItems = _.filter(_items, (att) => att.type !== 'joark')
    const newAttachments = sedOriginalAttachments.concat(jbi).sort(sedAttachmentSorter)
    setItems(newAttachments)
    onAttachmentsChanged(newAttachments)
  }

  const onRowViewDelete = (newItems: JoarkBrowserItems): void => {
    setItems(newItems)
    onAttachmentsChanged(newItems)
  }

  return (
    <>
      <VerticalSeparatorDiv size='2' />
      <label className='navds-text-field__label navds-label'>
        {t('label:vedlegg')}
      </label>
      <VerticalSeparatorDiv />
      <Button
        variant='secondary'
        data-amplitude='svarsed.editor.attachments'
        disabled={_.isNil(fnr)}
        onClick={(e: any) => {
          buttonLogger(e)
          setAttachmentsTableVisible(!_attachmentsTableVisible)
        }}
      >
        {t('label:vis-vedlegg-tabell')}
      </Button>
      <VerticalSeparatorDiv />
      <SEDAttachmentModal
        open={_attachmentsTableVisible}
        fnr={fnr!}
        onModalClose={() => setAttachmentsTableVisible(false)}
        onFinishedSelection={onJoarkAttachmentsChanged}
        sedAttachments={_items}
        tableId='vedlegg-modal'
      />
      {!_.isEmpty(_items) && (
        <>
          <VerticalSeparatorDiv />
          <JoarkBrowser
            existingItems={_items}
            fnr={fnr}
            mode='view'
            onRowViewDelete={onRowViewDelete}
            tableId='vedlegg-view'
          />
        </>
      )}
    </>
  )
}

export default Attachments
