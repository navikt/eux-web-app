import { EyeWithPupilIcon } from '@navikt/aksel-icons'
import { Button } from '@navikt/ds-react'
import FileFC, { File } from '@navikt/forhandsvisningsfil'
import { HorizontalSeparatorDiv } from '@navikt/hoykontrast'
import { getPreviewFile, previewSed, resetPreviewSvarSed } from 'actions/svarsed'
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
      buttonLogger(e)
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
        onModalClose={() => setPreviewModal(undefined)}
      />
      <Button
        variant='tertiary'
        size={size}
        disabled={gettingPreviewFile || gettingPreviewSed || disabled}
        data-amplitude='svarsed.editor.preview'
        onClick={onPreviewSedClicked}
        loading={(short && (gettingPreviewFile || gettingPreviewSed)) || (!short && gettingPreviewFile)}
        icon={<EyeWithPupilIcon />}
      >
        {!short && (
          <>
            <HorizontalSeparatorDiv size='0.5' />
            {gettingPreviewFile ? t('label:laster-ned-filen') : t('el:button-preview-x', { x: 'SED' })}
          </>
        )}
      </Button>

    </>
  )
}

export default PreviewSED
