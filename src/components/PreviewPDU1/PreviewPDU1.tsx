import { Download, ErrorFilled, Sight } from '@navikt/ds-icons'
import { Button, Loader } from '@navikt/ds-react'
import CountryData from '@navikt/land-verktoy'
import { previewPdu1, resetPreviewPdu1 } from 'actions/pdu1'
import { resetAllValidation, viewValidation } from 'actions/validation'
import Modal from 'components/Modal/Modal'
import { ModalContent } from 'declarations/components'
import { PDU1 } from 'declarations/pd'
import { State } from 'declarations/reducers'
import { saveAs } from 'file-saver'
import useGlobalValidation from 'hooks/useGlobalValidation'
import _ from 'lodash'
import { buttonLogger } from 'metrics/loggers'
import moment from 'moment'
import { FlexDiv, HorizontalSeparatorDiv } from '@navikt/hoykontrast'
import { validatePDU1Edit, ValidationPDU1EditProps } from 'pages/PDU1/mainValidation'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'

export interface PreviewPDU1Selector {
  pdu1: PDU1
  gettingPreviewPdu1: boolean
  previewPdu1file: any
}

const mapState = (state: State): any => ({
  pdu1: state.pdu1.pdu1,
  gettingPreviewPdu1: state.loading.gettingPreviewPdu1,
  previewPdu1file: state.pdu1.previewPdu1
})

const PreviewPDU1: React.FC = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const {
    pdu1,
    gettingPreviewPdu1,
    previewPdu1file
  }: PreviewPDU1Selector = useSelector<State, PreviewPDU1Selector>(mapState)

  const [previewModal, setPreviewModal] = useState<ModalContent | undefined>(undefined)
  const performValidation = useGlobalValidation<ValidationPDU1EditProps>(validatePDU1Edit)
  const countryData = CountryData.getCountryInstance('nb')

  const onResetPdu1Clicked = () => {
    dispatch(resetPreviewPdu1())
  }

  const onPreviewPdu1Clicked = (e: any) => {
    if (pdu1) {
      const newPdu1: PDU1 = _.cloneDeep(pdu1)
      const valid = performValidation({
        pdu1: newPdu1
      })
      dispatch(viewValidation())
      if (valid) {
        if (!_.isEmpty(newPdu1.andreMottatteUtbetalinger)) {
          delete newPdu1.andreMottatteUtbetalinger._utbetalingEtterEndtArbeidsforholdCheckbox
          delete newPdu1.andreMottatteUtbetalinger._kompensasjonForEndtArbeidsforholdCheckbox
          delete newPdu1.andreMottatteUtbetalinger._kompensasjonForFeriedagerCheckbox
          delete newPdu1.andreMottatteUtbetalinger._avkallKompensasjonBegrunnelseCheckbox
          delete newPdu1.andreMottatteUtbetalinger._andreYtelserSomMottasForTidenCheckbox
        }
        // yes it should be always Norway, but don't really want to hard-code it
        if (!_.isEmpty(newPdu1.bruker?.adresse?.land)) {
          newPdu1.bruker.adresse.land = countryData.findByValue(newPdu1.bruker.adresse.land).label
        }

        dispatch(previewPdu1(newPdu1))
        dispatch(resetAllValidation())
        buttonLogger(e)
      }
    }
  }

  const onDownloadPdu1Clicked = () => {
    saveAs(previewPdu1file, 'PDU1-' + moment().format('DD.MM.YYYY') + '.pdf')
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
            variant='secondary'
            disabled={gettingPreviewPdu1 || !_.isNil(previewPdu1file)}
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
        {pdu1 && previewPdu1file && (
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
