import { Sight } from '@navikt/ds-icons'
import { Button, Loader } from '@navikt/ds-react'
import FileFC, { File } from '@navikt/forhandsvisningsfil'
import { HorizontalSeparatorDiv } from '@navikt/hoykontrast'
import { getPreviewFile, resetPreviewSvarSed } from 'actions/svarsed'
import Modal from 'components/Modal/Modal'
import { ModalContent } from 'declarations/components'
import { State } from 'declarations/reducers'
import { ReplySed } from 'declarations/sed'
import _ from 'lodash'
import { buttonLogger } from 'metrics/loggers'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAppDispatch, useAppSelector } from 'store'
import { blobToBase64 } from 'utils/blob'
import { cleanReplySed } from 'utils/sed'

export interface PreviewSedProps {
  replySed: ReplySed | null | undefined
}

export interface PreviewSedSelector {
  gettingPreviewFile: boolean
  previewFile: any
}

const mapState = (state: State): any => ({
  gettingPreviewFile: state.loading.gettingPreviewFile,
  previewFile: state.svarsed.previewFile
})

const PreviewSED: React.FC<PreviewSedProps> = ({
  replySed
}: PreviewSedProps) => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const {
    gettingPreviewFile,
    previewFile
  }: PreviewSedSelector = useAppSelector(mapState)

  const [previewModal, setPreviewModal] = useState<ModalContent | undefined>(undefined)
  // const [quickReplySed, setQuickReplySed] = useState<ReplySed | undefined>(undefined)

  useEffect(() => {
    if (!previewModal && !_.isNil(previewFile)) {
      showPreviewModal(previewFile)
    }
  }, [previewFile])

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
              height={1200}
              tema='simple'
              viewOnePage={false}
              onContentClick={resetPreview}
            />
          </div>
        )
      })
    })
  }

  const resetPreview = () => {
    dispatch(resetPreviewSvarSed())
    setPreviewModal(undefined)
  }

  const onPreviewSedClicked = (e: any) => {
    if (replySed) {
      const newReplySed = _.cloneDeep(replySed)
      cleanReplySed(newReplySed)
      const rinaSakId = newReplySed.sak!.sakId
      delete newReplySed.sak
      delete newReplySed.sed
      delete newReplySed.attachments
      dispatch(getPreviewFile(rinaSakId!, newReplySed))
      buttonLogger(e)
    }
  }

  return (
    <>
      <Modal
        open={!_.isNil(previewModal)}
        modal={previewModal}
        onModalClose={() => setPreviewModal(undefined)}
      />
      <Button
        variant='tertiary'
        disabled={gettingPreviewFile}
        data-amplitude='svarsed.editor.preview'
        onClick={onPreviewSedClicked}
      >
        <Sight />
        <HorizontalSeparatorDiv size='0.5' />
        {gettingPreviewFile ? t('label:laster-ned-filen') : t('el:button-preview-x', { x: 'SED' })}
        {gettingPreviewFile && <Loader />}
      </Button>

    </>
  )
}

export default PreviewSED
