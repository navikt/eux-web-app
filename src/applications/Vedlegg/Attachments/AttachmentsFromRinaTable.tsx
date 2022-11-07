import React, {useCallback, useEffect, useState} from "react";
import Table, {Context, RenderOptions} from "@navikt/tabell";
import {Attachment, AttachmentTableItem} from "../../../declarations/types";
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
  previewFileRaw: Blob | null | undefined
}

const mapState = /* istanbul ignore next */ (state: State): AttachmentSelector => ({
  previewFileRaw: state.attachments.previewFileRaw
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

  const {previewFileRaw}: AttachmentSelector = useAppSelector(mapState)

  const dispatch = useAppDispatch()
  const { t } = useTranslation()

  console.log(sedId)
  console.log(rinaSakId)

  const [_clickedPreviewItem, setClickedPreviewItem] = useState<AttachmentTableItem | undefined>(undefined)
  const [_modal, setModal] = useState<ModalContent | undefined>(undefined)
  const [_previewFile, setPreviewFile] = useState<File | undefined>(undefined)
  const [_convertingRawToFile, setConvertingRawToFile] = useState<boolean>(false)

  console.log(_clickedPreviewItem)

  const handleModalClose = useCallback(() => {
    setPreviewFile(undefined)
    setModal(undefined)
    dispatch(setAttachmentFromRinaPreview(undefined))
  }, [dispatch])

  const onPreviewItem = (clickedItem: AttachmentTableItem): void => {
    setPreviewFile(undefined)
    setClickedPreviewItem(clickedItem)
    dispatch(getAttachmentFromRinaPreview(clickedItem, sedId, rinaSakId))
  }


  const convertFilenameToTitle = (navn: string): string => {
    return navn.replaceAll("_", " ").split(".")[0]
  }

  const renderTittel = ({ item, value }: RenderOptions<AttachmentTableItem, Context, string>) => {
    //const previewing = context?.gettingJoarkFile
    const spinner = false
    return (
      <ButtonsDiv>
        <Button
          variant='tertiary'
          size='small'
          data-tip={t('label:preview')}
          disabled={false}
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
    if (!_modal && !_convertingRawToFile && !_.isNil(_previewFile)) {
      setModal({
        closeButton: true,
        modalContent: (
          <div
            style={{ cursor: 'pointer' }}
          >
            <FileFC
              file={_previewFile}
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
  }, [_modal, _convertingRawToFile, _previewFile])

  return (
    <>
      <Modal
        open={!_.isNil(_modal)}
        modal={_modal}
        onModalClose={handleModalClose}
      />
      <Table
        <AttachmentTableItem, Context>
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
