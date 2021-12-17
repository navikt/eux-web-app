import { Download, ErrorFilled, Sight } from '@navikt/ds-icons'
import { Button, Loader } from '@navikt/ds-react'
import { previewPdu1, resetPreviewPdu1 } from 'actions/pdu1'
import Modal from 'components/Modal/Modal'
import { ModalContent } from 'declarations/components'
import { PDU1 } from 'declarations/pd'
import { State } from 'declarations/reducers'
import FileFC, { File } from 'forhandsvisningsfil'
import _ from 'lodash'
import { buttonLogger } from 'metrics/loggers'
import { FlexDiv, HorizontalSeparatorDiv } from 'nav-hoykontrast'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { blobToBase64 } from 'utils/blob'
import { saveAs } from 'file-saver'

export interface PreviewPDU1Selector {
  PDU1: PDU1
  gettingPreviewPdu1: boolean
  previewPdu1: any
}

const mapState = (state: State): any => ({
  PDU1: state.pdu1.PDU1,
  gettingPreviewPdu1: state.loading.gettingPreviewPdu1,
  previewPdu1: state.pdu1.previewPdu1
})

const PreviewPDU1: React.FC = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const {
    PDU1,
    gettingPreviewPdu1,
    previewPdu1
  }: PreviewPDU1Selector = useSelector<State, PreviewPDU1Selector>(mapState)

  const [previewModal, setPreviewModal] = useState<ModalContent | undefined>(undefined)
  const [willOpenModal, setWillOpenModal] = useState<boolean>(false)

  const onResetPdu1Clicked = () => {
    dispatch(resetPreviewPdu1())
  }

  const onPreviewPdu1Clicked = (e: any) => {
    if (_.isNil(previewPdu1)) {
      const newPdu1 = _.cloneDeep(PDU1)
      setWillOpenModal(true)
      dispatch(previewPdu1(newPdu1))
      buttonLogger(e)
    } else {
      showPreviewModal(previewPdu1)
    }
  }

  const onDownloadPdu1Clicked = () => {
    saveAs(previewPdu1, 'PDU1.pdf')
  }

  useEffect(() => {
    if (!previewModal && !_.isNil(previewPdu1) && willOpenModal) {
      showPreviewModal(previewPdu1)
      setWillOpenModal(false)
    }
  }, [previewPdu1, willOpenModal])

  const showPreviewModal = (previewFile: Blob) => {
    blobToBase64(previewFile).then((base64: any) => {
      const file: File = {
        id: '' + new Date().getTime(),
        size: previewFile.size,
        name: '',
        mimetype: 'application/pdf',
        content: {
          base64: base64.replaceAll('octet-stream', 'pdf')
        }
      }

      setPreviewModal({
        closeButton: true,
        modalContent: (
          <div
            style={{ cursor: 'pointer' }}
          >
            <FileFC
              file={{
                ...file,
                mimetype: 'application/pdf'
              }}
              width={600}
              height={800}
              tema='simple'
              viewOnePage={false}
              onContentClick={() => setPreviewModal(undefined)}
            />
          </div>
        )
      })
    })
  }

  return (
    <>
      <Modal
        open={!_.isNil(previewModal)}
        modal={previewModal}
        onModalClose={() => setPreviewModal(undefined)}
      />
      <FlexDiv>
        {PDU1 && (
          <Button
            variant='secondary'
            disabled={gettingPreviewPdu1}
            data-amplitude='pdu1.editor.preview'
            onClick={onPreviewPdu1Clicked}
          >
            <Sight />
            <HorizontalSeparatorDiv size='0.5' />
            {gettingPreviewPdu1
              ? t('label:laster-ned-filen')
              : _.isNil(previewPdu1)
                ? t('el:button-generate-preview-x', { x: 'PD U1' })
                : t('el:button-preview-x', { x: 'PD U1' })}
            {gettingPreviewPdu1 && <Loader />}
          </Button>
        )}
        {PDU1 && previewPdu1 && (
          <>
            <HorizontalSeparatorDiv />
            <Button
              variant='tertiary'
              disabled={gettingPreviewPdu1}
              data-amplitude='pdu1.editor.download'
              onClick={onDownloadPdu1Clicked}
            >
              <Download />
              <HorizontalSeparatorDiv size='0.5' />
              {t('label:last-ned-pdu1')}
            </Button>
            <HorizontalSeparatorDiv />
            <Button
              variant='tertiary'
              disabled={gettingPreviewPdu1}
              data-amplitude='pdu1.editor.reset'
              onClick={onResetPdu1Clicked}
            >
              <ErrorFilled />
              <HorizontalSeparatorDiv size='0.5' />
              {t('label:fjern-pdu1')}
            </Button>
          </>
        )}
      </FlexDiv>
    </>
  )
}

export default PreviewPDU1
