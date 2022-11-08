import React, {useCallback, useEffect, useState} from "react";
import Table, {RenderOptions} from "@navikt/tabell";
import {Attachment, AttachmentContext, AttachmentTableItem} from "../../../declarations/types";
import styled from "styled-components";
import {Button, Loader} from "@navikt/ds-react";
import {useTranslation} from "react-i18next";
import _ from "lodash";
import {blobToBase64} from "../../../utils/blob";
import FileFC, {File} from "@navikt/forhandsvisningsfil";
import Modal from "../../../components/Modal/Modal";
import {ModalContent} from "../../../declarations/components";
import {useAppDispatch, useAppSelector} from "../../../store";
import {State} from "../../../declarations/reducers";
import {getAttachmentFromRinaPreview, setAttachmentFromRinaPreview} from "../../../actions/attachments";


const ButtonsDiv = styled.div`
  display: flex;
  align-items: flex-start;
  padding-top: 0.25rem;
  justify-content: space-between;
  align-items: center;
  flex-wrap: nowrap;
`

export interface AttachmentSelector {
  previewAttachmentFileRaw: Blob | null | undefined
  gettingAttachmentFile: boolean
}

const mapState = /* istanbul ignore next */ (state: State): AttachmentSelector => ({
  previewAttachmentFileRaw: state.attachments.previewAttachmentFileRaw,
  gettingAttachmentFile: state.loading.gettingAttachmentFile
})

export interface AttachmentsFromRinaTableProps {
  sedId: string | undefined
  rinaSakId: string | undefined
  attachmentsFromRina: Array<Attachment> | undefined
  showHeader?: boolean
}
const AttachmentsFromRinaTable: React.FC<AttachmentsFromRinaTableProps> = ({
  attachmentsFromRina,
  showHeader,
  sedId,
  rinaSakId
}: AttachmentsFromRinaTableProps): JSX.Element => {

  const {previewAttachmentFileRaw, gettingAttachmentFile}: AttachmentSelector = useAppSelector(mapState)

  const dispatch = useAppDispatch()
  const { t } = useTranslation()

  const [_clickedAttachmentPreviewItem, setClickedAttachmentPreviewItem] = useState<AttachmentTableItem | undefined>(undefined)
  const [_attachmentModal, setAttachmentModal] = useState<ModalContent | undefined>(undefined)
  const [_previewAttachmentFile, setPreviewAttachmentFile] = useState<File | undefined>(undefined)
  const [_convertingRawToFile, setConvertingRawToFile] = useState<boolean>(false)

  const context: AttachmentContext = {
    gettingAttachmentFile,
    clickedPreviewItem: _clickedAttachmentPreviewItem,
  }

  const handleModalClose = useCallback(() => {
    setPreviewAttachmentFile(undefined)
    setAttachmentModal(undefined)
    dispatch(setAttachmentFromRinaPreview(undefined))
  }, [dispatch])

  const onPreviewItem = (clickedItem: AttachmentTableItem): void => {
    setPreviewAttachmentFile(undefined)
    setClickedAttachmentPreviewItem(clickedItem)
    dispatch(getAttachmentFromRinaPreview(clickedItem, sedId, rinaSakId))
  }


  const convertFilenameToTitle = (navn: string): string => {
    return navn.replaceAll("_", " ").split(".")[0]
  }

  const renderTittel = ({ item, value, context }: RenderOptions<AttachmentTableItem, AttachmentContext, string>) => {
    const previewing = context?.gettingAttachmentFile
    const spinner = previewing && _.isEqual(item as AttachmentTableItem, context?.clickedPreviewItem)
    return (
      <ButtonsDiv>
        <Button
          variant='tertiary'
          size='small'
          data-tip={t('label:preview')}
          disabled={previewing}
          id={'tablesorter__preview-button-' + item.key + '-' + item.navn}
          className='tablesorter__preview-button'
          onClick={() => onPreviewItem(item as AttachmentTableItem)}
        >
          {value}
          {spinner && <Loader />}
        </Button>
      </ButtonsDiv>
    )
  }

  useEffect(() => {
    if (_.isUndefined(_previewAttachmentFile) && !_.isUndefined(previewAttachmentFileRaw) && !_convertingRawToFile) {
      if (!_.isNull(previewAttachmentFileRaw)) {
        setConvertingRawToFile(true)

        blobToBase64(previewAttachmentFileRaw).then((base64: any) => {
          const file: File = {
            id: '' + new Date().getTime(),
            size: previewAttachmentFileRaw.size,
            name: '',
            mimetype: 'application/pdf',
            content: {
              base64: base64.replaceAll('octet-stream', 'pdf')
            }
          }
          setPreviewAttachmentFile(file)
          setConvertingRawToFile(false)
        })
      }
    }
  }, [_previewAttachmentFile, previewAttachmentFileRaw, _convertingRawToFile])

  useEffect(() => {
    if (!_attachmentModal && !_convertingRawToFile && !_.isNil(_previewAttachmentFile)) {
      setAttachmentModal({
        closeButton: true,
        modalContent: (
          <div
            style={{ cursor: 'pointer' }}
          >
            <FileFC
              file={_previewAttachmentFile}
              width={600}
              height={800}
              tema='simple'
              viewOnePage={false}
              onContentClick={handleModalClose}
            />
          </div>
        )
      })
    }
  }, [_attachmentModal, _convertingRawToFile, _previewAttachmentFile])

  return (
    <>
      <Modal
        open={!_.isNil(_attachmentModal)}
        modal={_attachmentModal}
        onModalClose={handleModalClose}
      />
      <Table
        <AttachmentTableItem, AttachmentContext>
        context={context}
        searchable={true}
        selectable={false}
        sortable={true}
        summary={false}
        showHeader={showHeader ? showHeader : false}
        striped={false}
        items={attachmentsFromRina ? attachmentsFromRina.map((a)=>{
          return {
            ...a,
            navn: convertFilenameToTitle(a.navn),
            key: a.id,
          }
        }) : []}
        columns={[{id: 'navn', label: 'Tittel', type: 'string', render: renderTittel}]}
      />
    </>
  )
}

export default AttachmentsFromRinaTable
