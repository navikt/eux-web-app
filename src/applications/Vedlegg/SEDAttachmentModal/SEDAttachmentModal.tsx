import JoarkBrowser from 'applications/Vedlegg/JoarkBrowser/JoarkBrowser'
import Modal from 'components/Modal/Modal'
import { JoarkBrowserItems } from 'declarations/attachments'
import PT from 'prop-types'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

export interface SEDAttachmentModalProps {
  open: boolean
  fnr: string
  onFinishedSelection: (jbi: JoarkBrowserItems) => void
  onModalClose: () => void
  sedAttachments: JoarkBrowserItems
  tableId: string
}

const SEDAttachmentModal: React.FC<SEDAttachmentModalProps> = ({
  fnr, open, onFinishedSelection, onModalClose, sedAttachments, tableId
}: SEDAttachmentModalProps): JSX.Element => {
  const { t } = useTranslation()
  const [_items, setItems] = useState<JoarkBrowserItems>(sedAttachments)

  const onRowSelectChange = (items: JoarkBrowserItems): void => {
    setItems(items)
  }

  const onAddAttachmentsButtonClick = (): void => {
    onFinishedSelection(_items)
    onModalClose()
  }


  return (
    <Modal
      open={open}
      modal={{
        modalTitle: t('label:velg-vedlegg-til-sed'),
        modalContent: (
          <>
            <JoarkBrowser
              data-testid='c-sedattachmentmodal__joarkbrowser-id'
              existingItems={sedAttachments}
              fnr={fnr}
              mode='select'
              onRowSelectChange={onRowSelectChange}
              tableId={tableId}
            />
          </>
        ),
        modalButtons: [{
          main: true,
          text: t('el:button-close-attachments'),
          onClick: onAddAttachmentsButtonClick
        }]
      }}
      onModalClose={onModalClose}
    />

  )
}

SEDAttachmentModal.propTypes = {
  onFinishedSelection: PT.func.isRequired,
  onModalClose: PT.func.isRequired,
  // sedAttachments: JoarkBrowserItemsFileType.isRequired,
  tableId: PT.string.isRequired
}

export default SEDAttachmentModal
