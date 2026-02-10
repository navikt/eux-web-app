import { EyeWithPupilIcon } from '@navikt/aksel-icons'
import { Button } from '@navikt/ds-react'
import { getPreviewFile, previewSed, resetPreviewSvarSed } from 'actions/svarsed'
import Modal from 'components/Modal/Modal'
import { ModalContent } from 'declarations/components'
import { State } from 'declarations/reducers'
import { ReplySed } from 'declarations/sed'
import _ from 'lodash'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAppDispatch, useAppSelector } from 'store'
import { blobToBase64 } from 'utils/blob'
import { cleanReplySed } from 'utils/sed'
import PDFViewer from "components/PDFViewer/PDFViewer";

export interface PreviewSedProps {
  rinaSakId?: string | undefined
  sedId?: string | undefined
  replySed?: ReplySed | null | undefined
  short ?: boolean
  size ?: 'medium' | 'small' | 'xsmall' | undefined
  disabled?: boolean
}

export interface PreviewSedSelector {
  gettingPreviewFile: boolean
  gettingPreviewSed: boolean
  previewFile: Blob | undefined
}

const mapState = (state: State): any => ({
  gettingPreviewFile: state.loading.gettingPreviewFile,
  gettingPreviewSed: state.loading.gettingPreviewSed,
  previewFile: state.svarsed.previewFile,
})

const PreviewSED: React.FC<PreviewSedProps> = ({
  rinaSakId,
  sedId,
  replySed,
  short = false,
  size = 'medium',
  disabled = false
}: PreviewSedProps) => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const {
    gettingPreviewFile,
    gettingPreviewSed,
    previewFile,
  }: PreviewSedSelector = useAppSelector(mapState)

  const [previewModal, setPreviewModal] = useState<ModalContent | undefined>(undefined)
  const [requestPreview, setRequestPreview] = useState<boolean>(false)

  useEffect(() => {
    if (requestPreview && !previewModal && !_.isNil(previewFile)) {
      setRequestPreview(false)
      showPreviewModal(previewFile)
    }
  }, [previewFile])

  const showPreviewModal = (previewFile: Blob) => {
    blobToBase64(previewFile).then((base64: any) => {
      setPreviewModal({
        closeButton: true,
        modalContent: (
          <div
            style={{ cursor: 'pointer' }}
          >
            <PDFViewer
              file={base64.replaceAll('octet-stream', 'pdf')}
              name=""
              size={previewFile.size}
              width={600}
              height={1200}
            />
          </div>
        )
      })
    })
  }

  const handleModalClose = () => {
    dispatch(resetPreviewSvarSed())
    setPreviewModal(undefined)
  }

  const onPreviewSedClicked = (e: any) => {
    /* two modes:
       1) I am alrady editing a SED, so I can use all info from replySed
       2) I am choosing a SED, get PDF from RINA
     */
    if (replySed) {
      const newReplySed = _.cloneDeep(replySed)
      cleanReplySed(newReplySed)
      const rinaSakId = newReplySed.sak!.sakId
      delete newReplySed.sak
      delete newReplySed.sed
      delete newReplySed.attachments
      dispatch(getPreviewFile(rinaSakId!, newReplySed))
    } else {
      if (sedId && rinaSakId) {
        dispatch(previewSed(sedId, rinaSakId))
      }
    }
    setRequestPreview(true)
  }

  return (
    <>
      <Modal
        open={!_.isNil(previewModal)}
        modal={previewModal}
        onModalClose={handleModalClose}
      />
      <Button
        variant='tertiary'
        size={size}
        disabled={disabled}
        onClick={onPreviewSedClicked}
        loading={requestPreview && (gettingPreviewFile || gettingPreviewSed)}
        icon={<EyeWithPupilIcon />}
      >
        {!short && (
          <>
            {gettingPreviewFile ? t('label:laster-ned-filen') : t('el:button-preview-x', { x: 'SED' })}
          </>
        )}
      </Button>

    </>
  )
}

export default PreviewSED
