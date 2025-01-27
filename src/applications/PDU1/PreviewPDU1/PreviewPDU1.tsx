import { DownloadIcon, XMarkOctagonFillIcon, EyeWithPupilIcon } from '@navikt/aksel-icons'
import { Button, Loader } from '@navikt/ds-react'
import { previewPdu1, resetPreviewPdu1 } from 'actions/pdu1'
import { setValidation } from 'actions/validation'
import Modal from 'components/Modal/Modal'
import { ModalContent } from 'declarations/components'
import { PDU1 } from 'declarations/pd'
import { State } from 'declarations/reducers'
import { Validation } from 'declarations/types'
import { saveAs } from 'file-saver'
import performValidation from 'utils/performValidation'
import _ from 'lodash'
import { buttonLogger } from 'metrics/loggers'
import moment from 'moment'
import { FlexDiv, HorizontalSeparatorDiv } from '@navikt/hoykontrast'
import { validatePDU1Edit, ValidationPDU1EditProps } from 'pages/PDU1/mainValidation'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAppDispatch, useAppSelector } from 'store'

export interface PreviewPDU1Props {
  validation: Validation
  namespace: string
}

export interface PreviewPDU1Selector {
  pdu1: PDU1
  gettingPreviewDraftPdu1: boolean
  previewPdu1file: Blob | undefined
}

const mapState = (state: State): any => ({
  pdu1: state.pdu1.pdu1,
  gettingPreviewDraftPdu1: state.loading.gettingPreviewDraftPdu1,
  previewPdu1file: state.pdu1.previewDraftPdu1
})

const PreviewPDU1: React.FC<PreviewPDU1Props> = ({ validation, namespace }: PreviewPDU1Props) => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const {
    pdu1,
    gettingPreviewDraftPdu1,
    previewPdu1file
  }: PreviewPDU1Selector = useAppSelector(mapState)

  const [previewModal, setPreviewModal] = useState<ModalContent | undefined>(undefined)

  const onResetPdu1Clicked = () => {
    dispatch(resetPreviewPdu1())
  }

  const onPreviewPdu1Clicked = (e: any) => {
    if (pdu1) {
      const newPdu1: PDU1 = _.cloneDeep(pdu1)
      const clonedvalidation = _.cloneDeep(validation)
      const hasErrors = performValidation<ValidationPDU1EditProps>(clonedvalidation, namespace, validatePDU1Edit, {
        pdu1: newPdu1
      })
      dispatch(setValidation(clonedvalidation))
      if (!hasErrors) {
        if (!_.isEmpty(newPdu1.etterbetalinger)) {
          delete newPdu1.etterbetalinger._utbetalingEtterEndtArbeidsforholdCheckbox
          delete newPdu1.etterbetalinger._kompensasjonForEndtArbeidsforholdCheckbox
          delete newPdu1.etterbetalinger._kompensasjonForFeriedagerCheckbox
          delete newPdu1.etterbetalinger._avkallKompensasjonBegrunnelseCheckbox
          delete newPdu1.etterbetalinger._andreYtelserSomMottasForTidenCheckbox
        }

        dispatch(previewPdu1(newPdu1))
        buttonLogger(e)
      }
    }
  }

  const onDownloadPdu1Clicked = () => {
    saveAs(previewPdu1file!, 'PDU1-' + moment().format('DD.MM.YYYY') + '.pdf')
  }

  return (
    <>
      <Modal
        open={!_.isNil(previewModal)}
        modal={previewModal}
        onModalClose={() => setPreviewModal(undefined)}
      />
      <FlexDiv>
        {pdu1 && (
          <Button
            variant='tertiary'
            disabled={gettingPreviewDraftPdu1 || !_.isNil(previewPdu1file)}
            data-amplitude='pdu1.editor.preview'
            onClick={onPreviewPdu1Clicked}
            icon={<EyeWithPupilIcon/>}
          >
            {gettingPreviewDraftPdu1
              ? t('label:laster-ned-filen')
              : _.isNil(previewPdu1)
                ? t('el:button-generate-preview-x', { x: 'PD U1' })
                : t('el:button-preview-x', { x: 'PD U1' })}
            {gettingPreviewDraftPdu1 && <Loader />}
          </Button>
        )}
        {pdu1 && previewPdu1file && (
          <>
            <HorizontalSeparatorDiv />
            <Button
              variant='tertiary'
              disabled={gettingPreviewDraftPdu1}
              data-amplitude='pdu1.editor.download'
              onClick={onDownloadPdu1Clicked}
              icon={<DownloadIcon/>}
            >
              {t('label:last-ned-pdu1')}
            </Button>
            <HorizontalSeparatorDiv />
            <Button
              variant='tertiary'
              disabled={gettingPreviewDraftPdu1}
              data-amplitude='pdu1.editor.reset'
              onClick={onResetPdu1Clicked}
              icon={<XMarkOctagonFillIcon/>}
            >
              {t('label:fjern-pdu1')}
            </Button>
          </>
        )}
      </FlexDiv>
    </>
  )
}

export default PreviewPDU1
