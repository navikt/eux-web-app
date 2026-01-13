import React, {useCallback, useEffect, useState} from "react";
import Table, {RenderOptions} from "@navikt/tabell";
import {Attachment, AttachmentContext, AttachmentTableItem} from "../../../declarations/types";
import styled from "styled-components";
import {Button, Loader, Checkbox} from "@navikt/ds-react";
import {useTranslation} from "react-i18next";
import _ from "lodash";
import {blobToBase64} from "../../../utils/blob";
import Modal from "../../../components/Modal/Modal";
import {ModalContent} from "../../../declarations/components";
import {useAppDispatch, useAppSelector} from "../../../store";
import {State} from "../../../declarations/reducers";
import {getAttachmentFromRinaPreview, setAttachmentFromRinaPreview} from "../../../actions/attachments";
import { TrashIcon } from '@navikt/aksel-icons';
import {deleteAttachment, setAttachmentSensitive} from "../../../actions/svarsed";
import PDFViewer from "../../../components/PDFViewer/PDFViewer";


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
  settingAttachmentSensitive: boolean
  deletingAttachment: boolean
}

const mapState = /* istanbul ignore next */ (state: State): AttachmentSelector => ({
  previewAttachmentFileRaw: state.attachments.previewAttachmentFileRaw,
  gettingAttachmentFile: state.loading.gettingAttachmentFile,
  settingAttachmentSensitive: state.loading.settingAttachmentSensitive,
  deletingAttachment: state.loading.deletingAttachment
})

export interface AttachmentsFromRinaTableProps {
  sedId: string | undefined
  rinaSakId: string | undefined
  attachmentsFromRina: Array<Attachment> | undefined
  showHeader?: boolean
  hideActions?: boolean
}
const AttachmentsFromRinaTable: React.FC<AttachmentsFromRinaTableProps> = ({
  attachmentsFromRina,
  showHeader,
  hideActions,
  sedId,
  rinaSakId
}: AttachmentsFromRinaTableProps): JSX.Element => {

  const {previewAttachmentFileRaw, gettingAttachmentFile, deletingAttachment, settingAttachmentSensitive}: AttachmentSelector = useAppSelector(mapState)

  const dispatch = useAppDispatch()
  const { t } = useTranslation()

  const [_clickedAttachmentItem, setClickedAttachmentItem] = useState<AttachmentTableItem | undefined>(undefined)
  const [_attachmentModal, setAttachmentModal] = useState<ModalContent | undefined>(undefined)
  const [_previewAttachmentFile, setPreviewAttachmentFile] = useState<any | undefined>(undefined)
  const [_convertingRawToFile, setConvertingRawToFile] = useState<boolean>(false)

  const context: AttachmentContext = {
    gettingAttachmentFile,
    settingAttachmentSensitive,
    deletingAttachment,
    clickedItem: _clickedAttachmentItem,
  }

  const handleModalClose = useCallback(() => {
    setPreviewAttachmentFile(undefined)
    setAttachmentModal(undefined)
    dispatch(setAttachmentFromRinaPreview(undefined))
  }, [dispatch])

  const onPreviewItem = (clickedItem: AttachmentTableItem): void => {
    setPreviewAttachmentFile(undefined)
    setClickedAttachmentItem(clickedItem)
    dispatch(getAttachmentFromRinaPreview(clickedItem, sedId, rinaSakId))
  }

  const onDeleteItem = (clickedItem: AttachmentTableItem): void => {
    setClickedAttachmentItem(clickedItem)
    dispatch(deleteAttachment(rinaSakId, sedId, clickedItem.id))
  }

  const onSetSensitive = (event: any, clickedItem: AttachmentTableItem): void => {
    setClickedAttachmentItem(clickedItem)
    dispatch(setAttachmentSensitive(rinaSakId, sedId, clickedItem.id, event.target.checked))
  }

  const convertFilenameToTitle = (navn: string): string => {
    return navn?.replaceAll("_", " ").split(".")[0]
  }

  const renderTittel = ({ item, value, context }: RenderOptions<AttachmentTableItem, AttachmentContext, string>) => {
    const previewing = context?.gettingAttachmentFile
    const spinner = previewing && _.isEqual(item as AttachmentTableItem, context?.clickedItem)
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

  const renderSensitivt = ({ item }: RenderOptions<AttachmentTableItem, AttachmentContext, string>) => {
    const settingSensitive = context?.settingAttachmentSensitive
    const spinner = settingSensitive && _.isEqual(item as AttachmentTableItem, context?.clickedItem)
    return (
      <ButtonsDiv>
        {spinner && <Loader/>}
        {!spinner &&
          <Checkbox
            id={'tablesorter__sensitivt-checkbox-' + item.key + '-' + item.navn}
            checked={item.sensitivt}
            onChange={(e: any) => onSetSensitive(e, item as AttachmentTableItem)}
          >
            {"Sensitivt"}
          </Checkbox>
        }
      </ButtonsDiv>
    )
  }

  const renderDeleteButton = ({ item, context}: RenderOptions<AttachmentTableItem, AttachmentContext, string>) => {
    const deleting = context?.deletingAttachment
    const spinner = deleting && _.isEqual(item as AttachmentTableItem, context?.clickedItem)
    return (
      <Button
        variant='tertiary'
        size='small'
        data-tip={t('label:delete')}
        disabled={deleting}
        id={'tablesorter__delete-button-' + item.key + '-' + item.navn}
        className='tablesorter__delete-button'
        onClick={() => onDeleteItem(item as AttachmentTableItem)}
      >
        {spinner && <Loader/>}
        {!spinner && <TrashIcon/>}
      </Button>

    )
  }

  useEffect(() => {
    if (_.isUndefined(_previewAttachmentFile) && !_.isUndefined(previewAttachmentFileRaw) && !_convertingRawToFile) {
      if (!_.isNull(previewAttachmentFileRaw)) {
        setConvertingRawToFile(true)

        blobToBase64(previewAttachmentFileRaw).then((base64: any) => {
          const file: any = {
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
        modalContent: (
          <div
            style={{ cursor: 'pointer' }}
          >
            <PDFViewer
              file={_previewAttachmentFile.content.base64!}
              name=""
              size={_previewAttachmentFile.size}
              width={600}
              height={800}
            />
          </div>
        )
      })
    }
  }, [_attachmentModal, _convertingRawToFile, _previewAttachmentFile])

  const columns = [
    {id: 'navn', label: 'Tittel', type: 'string', render: renderTittel}
  ]

  if(!hideActions){
    columns.push({id: 'sensitivt', label: 'Sensitivt', type: 'string', render: renderSensitivt})
    columns.push({id: 'id', label: '', type: 'string', render: renderDeleteButton})
  }

  return (
    <div id='attachmentsFromRina'>
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
        columns={columns}
      />
    </div>
  )
}

export default AttachmentsFromRinaTable
