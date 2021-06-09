import JoarkBrowser from 'applications/Vedlegg/JoarkBrowser/JoarkBrowser'
import Document from 'assets/icons/Document'
import Modal from 'components/Modal/Modal'
import { JoarkBrowserItems } from 'declarations/attachments'
import NavHighContrast from 'nav-hoykontrast'
import PT from 'prop-types'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

export interface SEDAttachmentModalProps {
  fnr: string
  highContrast: boolean
  onFinishedSelection: (jbi: JoarkBrowserItems) => void
  onModalClose: () => void
  sedAttachments: JoarkBrowserItems
  tableId: string
}

const SEDAttachmentModal: React.FC<SEDAttachmentModalProps> = ({
  fnr, highContrast, onFinishedSelection, onModalClose, sedAttachments, tableId
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

  const onCancelButtonClick = (): void => {
    onModalClose()
  }

  return (
    <NavHighContrast highContrast={highContrast}>
      <Modal
        highContrast={highContrast}
        icon={<Document />}
        modal={{
          closeButton: true,
          modalContent: (
            <>
              <JoarkBrowser
                data-test-id='a-buc-c-sedattachmentmodal__joarkbrowser-id'
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
            text: t('el:button-add-selected-attachments'),
            onClick: onAddAttachmentsButtonClick
          }, {
            text: t('el:button-cancel'),
            onClick: onCancelButtonClick
          }]
        }}
        onModalClose={onModalClose}
      />
    </NavHighContrast>
  )
}

SEDAttachmentModal.propTypes = {
  highContrast: PT.bool.isRequired,
  onFinishedSelection: PT.func.isRequired,
  onModalClose: PT.func.isRequired,
  // sedAttachments: JoarkBrowserItemsFileType.isRequired,
  tableId: PT.string.isRequired
}

export default SEDAttachmentModal
