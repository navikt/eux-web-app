import { JoarkBrowser } from 'components/JoarkBrowser/JoarkBrowser'
import SEDAttachmentModal from 'components/SEDAttachmentModal/SEDAttachmentModal'
import {
  JoarkBrowserItem,
  JoarkBrowserItems,
} from 'declarations/attachments'
import _ from 'lodash'
import { HighContrastKnapp, VerticalSeparatorDiv } from 'nav-hoykontrast'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

export interface AttachmentsProps {
  highContrast: boolean
  onAttachmentsChanged: (items: JoarkBrowserItems) => void
}

const Attachments: React.FC<AttachmentsProps> = ({
  highContrast,
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
      <VerticalSeparatorDiv data-size='2' />
      <label className='skjemaelement__label'>
        {t('label:attachments')}
      </label>
      <VerticalSeparatorDiv />
      <HighContrastKnapp
        onClick={() => setAttachmentsTableVisible(!_attachmentsTableVisible)}
      >
        {t( 'label:show-attachments-table')}
      </HighContrastKnapp>
      <VerticalSeparatorDiv />
      {_attachmentsTableVisible && (
        <SEDAttachmentModal
          highContrast={highContrast}
          onModalClose={() => setAttachmentsTableVisible(false)}
          onFinishedSelection={onJoarkAttachmentsChanged}
          sedAttachments={_items}
          tableId='newsed-modal'
        />
      )}

      {!_.isEmpty(_items) && (
        <>
          <VerticalSeparatorDiv />
          <JoarkBrowser
            mode='view'
            existingItems={_items}
            highContrast={highContrast}
            onRowViewDelete={onRowViewDelete}
            tableId='newsed-view'
          />
        </>
      )}
    </>
  )
}

export default Attachments
