import JoarkBrowser from 'applications/Vedlegg/JoarkBrowser/JoarkBrowser'
import Modal from 'components/Modal/Modal'
import { JoarkBrowserItems } from 'declarations/attachments'
import { setJoarkItemPreview } from 'actions/attachments'
import PT from 'prop-types'
import React, {useEffect, useState} from 'react'
import { useTranslation } from 'react-i18next'
import {State} from "../../../declarations/reducers";
import {useDispatch, useSelector} from "react-redux";
import FileFC, {File} from "@navikt/forhandsvisningsfil";
import _ from "lodash";
import {blobToBase64} from "utils/blob";

export interface SEDAttachmentModalProps {
  open: boolean
  fnr: string
  onFinishedSelection: (jbi: JoarkBrowserItems) => void
  onModalClose: () => void
  sedAttachments: JoarkBrowserItems
  tableId: string
}

export interface SEDAttachmentModalSelector {
  previewFileRaw: Blob | null | undefined
}

const mapState = (state: State): SEDAttachmentModalSelector => ({
  previewFileRaw: state.attachments.previewFileRaw
})

const SEDAttachmentModal: React.FC<SEDAttachmentModalProps> = ({
  fnr, open, onFinishedSelection, onModalClose, sedAttachments, tableId
}: SEDAttachmentModalProps): JSX.Element => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const { previewFileRaw } = useSelector<State, SEDAttachmentModalSelector>(mapState)
  const [_items, setItems] = useState<JoarkBrowserItems>(sedAttachments)
  const [_preview, setPreview] = useState<any | undefined>(undefined)
  const [_previewFile, setPreviewFile] = useState<File | undefined>(undefined)
  const [_convertingRawToFile, setConvertingRawToFile] = useState<boolean>(false)

  const onRowSelectChange = (items: JoarkBrowserItems): void => {
    setItems(items)
  }

  const onAddAttachmentsButtonClick = (): void => {
    onFinishedSelection(_items)
    resetPreviewAndReturnTrue()
    onModalClose()
  }

  const resetPreviewAndReturnTrue = (): boolean => {
    resetPreview()
    return true
  }

  const resetPreview = (): boolean => {
    dispatch(setJoarkItemPreview(undefined))
    return false
  }

  useEffect(() => {
    if(!previewFileRaw){
      return setPreviewFile(undefined)
    }
    if (_.isUndefined(_previewFile) && !_.isUndefined(previewFileRaw) && !_convertingRawToFile) {
      if (!_.isNull(previewFileRaw)) {
        setConvertingRawToFile(true)

        blobToBase64(previewFileRaw).then((base64: any) => {
          const file: File = {
            id: '' + new Date().getTime(),
            size: previewFileRaw.size,
            name: '',
            mimetype: 'application/pdf',
            content: {
              base64: base64.replaceAll('octet-stream', 'pdf')
            }
          }
          setPreviewFile(file)
          setConvertingRawToFile(false)
        })
      }
    }
  }, [_previewFile, previewFileRaw, _convertingRawToFile])

  useEffect(() => {
    if (!_previewFile) {
      return setPreview(undefined)
    }
    setPreview(
      <div
        style={{ cursor: 'pointer'}}
      >
        <FileFC
          file={_previewFile}
          width={600}
          height={800}
          tema='simple'
          viewOnePage={false}
          onContentClick={resetPreview}
        />
      </div>
    )

  }, [_previewFile])

  return (
    <Modal
      open={open}
      modal={{
        modalTitle: t('label:velg-vedlegg-til-sed'),
        modalContent: (
          _preview ? _preview :
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
        modalButtons: !_preview ? [{
          main: true,
          text: t('el:button-close-attachments'),
          onClick: onAddAttachmentsButtonClick
        }] : []
      }}
      onModalClose={onModalClose}
      onBeforeClose={_preview ? resetPreview : resetPreviewAndReturnTrue}
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
