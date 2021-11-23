import { Sight } from '@navikt/ds-icons'
import { clientClear } from 'actions/alert'
import { resetCurrentEntry, saveEntry } from 'actions/localStorage'
import { completePdu1, getPreviewPdu1, setReplySed, updateReplySed } from 'actions/pdu1'
import { finishPageStatistic, startPageStatistic } from 'actions/statistics'
import { resetPreviewFile } from 'actions/svarsed'
import { resetAllValidation, viewValidation } from 'actions/validation'
import SavePDU1Modal from 'applications/PDU1/SavePDU1Modal/SavePDU1Modal'
import PersonManager from 'applications/SvarSed/PersonManager/PersonManager'
import Alert from 'components/Alert/Alert'
import Modal from 'components/Modal/Modal'
import { AlertstripeDiv } from 'components/StyledComponents'
import * as types from 'constants/actionTypes'
import { ReplyPdu1 } from 'declarations/pd'
import { State } from 'declarations/reducers'
import { LocalStorageEntry, Validation } from 'declarations/types'
import FileFC from 'forhandsvisningsfil'
import useGlobalValidation from 'hooks/useGlobalValidation'
import _ from 'lodash'
import { buttonLogger } from 'metrics/loggers'
import { VenstreChevron } from 'nav-frontend-chevron'
import {
  FlexCenterSpacedDiv,
  FlexDiv,
  HighContrastFlatknapp,
  HighContrastHovedknapp,
  HighContrastKnapp,
  HorizontalSeparatorDiv,
  PaddedDiv,
  VerticalSeparatorDiv
} from 'nav-hoykontrast'
import ValidationBox from 'pages/SvarSed/ValidationBox'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { validatePDU1Edit, ValidationPDU1EditProps } from './mainValidation'

export interface PDU1EditSelector {
  alertType: string | undefined
  alertMessage: JSX.Element | string | undefined
  completingPdu1: boolean
  gettingPreviewPdu1: boolean
  highContrast: boolean
  previewPdu1: any,
  replyPdu1: ReplyPdu1 | null | undefined
  savingPdu1: boolean
  completePdu1Response: any
  validation: Validation
  view: boolean
}

export interface PDU1EditProps {
  changeMode: (mode: string, from: string, callback?: () => void) => void
  storageKey: string
}

const mapState = (state: State): any => ({
  alertType: state.alert.type,
  alertMessage: state.alert.stripeMessage,
  completingPdu1: state.loading.completingPdu1,
  gettingPreviewPdu1: state.loading.gettingPreviewPdu1,
  previewPdu1: state.pdu1.previewPdu1,
  replyPdu1: state.pdu1.replyPdu1,
  completePdu1Response: state.pdu1.completePdu1Response,
  highContrast: state.ui.highContrast,
  validation: state.validation.status,
  view: state.validation.view
})

const PDU1Edit: React.FC<PDU1EditProps> = ({
  changeMode,
  storageKey
}: PDU1EditProps): JSX.Element => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const {
    alertType,
    alertMessage,
    completingPdu1,
    gettingPreviewPdu1,
    previewPdu1,
    replyPdu1,
    completePdu1Response,
    highContrast,
    view
  }: PDU1EditSelector = useSelector<State, PDU1EditSelector>(mapState)
  const currentEntry = useSelector<State, LocalStorageEntry<ReplyPdu1> | undefined>(
    (state) => state.localStorage.pdu1.currentEntry)

  const [previewModal, setPreviewModal] = useState<boolean>(false)
  const [viewSavePdu1Modal, setViewSavePdu1Modal] = useState<boolean>(false)
  const performValidation = useGlobalValidation<ValidationPDU1EditProps>(validatePDU1Edit)

  const completePdu1Clicked = (e: React.ChangeEvent<HTMLButtonElement>): void => {
    if (replyPdu1) {
      const newReplyPdu1: ReplyPdu1 = _.cloneDeep(replyPdu1)
      const valid = performValidation({
        replyPdu1: newReplyPdu1
      })
      dispatch(viewValidation())
      if (valid) {
        dispatch(completePdu1(newReplyPdu1))
        dispatch(resetAllValidation())
        buttonLogger(e)
      }
    }
  }

  const onSavePdu1Click = () => {
    if (_.isNil(currentEntry)) {
      setViewSavePdu1Modal(true)
    } else {
      const newCurrentEntry: LocalStorageEntry<ReplyPdu1> = _.cloneDeep(currentEntry)
      newCurrentEntry.content = _.cloneDeep(replyPdu1!)
      dispatch(saveEntry('pdu1', storageKey, newCurrentEntry))
    }
  }

  const resetPreview = () => {
    dispatch(resetPreviewFile())
    setPreviewModal(false)
  }

  const onPreviewPdu1Clicked = (e: React.ChangeEvent<HTMLButtonElement>) => {
    if (replyPdu1) {
      const newReplyPdu1 = _.cloneDeep(replyPdu1)
      dispatch(getPreviewPdu1(newReplyPdu1))
      buttonLogger(e)
    }
  }

  const onGoBackClick = () => {
    changeMode('A', 'back')
    dispatch(resetCurrentEntry('pdu1'))
    document.dispatchEvent(new CustomEvent('tilbake', { detail: {} }))
  }

  useEffect(() => {
    if (!previewModal && !_.isNil(previewPdu1)) {
      setPreviewModal(true)
    }
  }, [previewPdu1])

  useEffect(() => {
    dispatch(startPageStatistic('pdu1editor'))
    return () => {
      dispatch(finishPageStatistic('pdu1editor'))
    }
  }, [])

  return (
    <PaddedDiv size='0.5'>
      <Modal
        open={previewModal}
        highContrast={highContrast}
        modal={{
          closeButton: true,
          modalContent: (
            <div
              style={{ cursor: 'pointer' }}
            >
              <FileFC
                file={previewPdu1}
                width={600}
                height={800}
                tema='simple'
                viewOnePage={false}
                onContentClick={resetPreview}
              />
            </div>
          )
        }}
        onModalClose={resetPreview}
      />
      <SavePDU1Modal
        open={viewSavePdu1Modal}
        highContrast={highContrast}
        replyPdu1={replyPdu1!}
        storageKey={storageKey}
        onModalClose={() => setViewSavePdu1Modal(false)}
      />
      <FlexCenterSpacedDiv>
        <HighContrastKnapp
          kompakt
          onClick={onGoBackClick}
        >
          <VenstreChevron />
          <HorizontalSeparatorDiv size='0.5' />
          {t('label:tilbake')}
        </HighContrastKnapp>
      </FlexCenterSpacedDiv>
      <VerticalSeparatorDiv size='2' />
      <PersonManager
        replySed={replyPdu1}
        setReplySed={setReplySed}
        updateReplySed={updateReplySed}
        viewValidation={view}
      />
      <VerticalSeparatorDiv size='2' />
      <HighContrastFlatknapp
        mini
        kompakt
        disabled={gettingPreviewPdu1}
        spinner={gettingPreviewPdu1}
        data-amplitude='pdu1.editor.preview'
        onClick={onPreviewPdu1Clicked}
      >
        <Sight />
        <HorizontalSeparatorDiv size='0.5' />
        {gettingPreviewPdu1 ? t('label:laster-ned-filen') : t('el:button-preview-x', { x: 'PD U1' })}
      </HighContrastFlatknapp>
      <VerticalSeparatorDiv size='2' />
      <ValidationBox />
      <VerticalSeparatorDiv size='2' />
      <FlexDiv>
        <div>
          <HighContrastHovedknapp
            mini
            data-amplitude='pdu1.editor.opprett'
            onClick={completePdu1Clicked}
            disabled={completingPdu1 || !_.isEmpty(completePdu1Response)}
            spinner={completingPdu1}
          >
            {completingPdu1
              ? t('message:loading-opprette-pdu1')
              : t('label:opprett-pdu1')}
          </HighContrastHovedknapp>
          <VerticalSeparatorDiv size='0.5' />
        </div>
        <HorizontalSeparatorDiv />

        <div>
          <HighContrastKnapp
            data-amplitude={_.isNil(currentEntry) ? 'pdu1.editor.savedraft' : 'pdu1.editor.updatedraft'}
            mini
            onClick={onSavePdu1Click}
          >
            {_.isNil(currentEntry)
              ? t('el:button-save-draft-x', { x: t('label:replySed') })
              : t('el:button-update-draft-x', { x: t('label:replySed') })}
          </HighContrastKnapp>
          <VerticalSeparatorDiv size='0.5' />
        </div>
      </FlexDiv>
      <VerticalSeparatorDiv />
      {alertMessage && alertType === types.LOCALSTORAGE_ENTRY_SAVE && (
        <>
          <FlexDiv>
            <AlertstripeDiv>
              <Alert status='OK' message={alertMessage!} onClose={() => dispatch(clientClear())} />
            </AlertstripeDiv>
            <div />
          </FlexDiv>
          <VerticalSeparatorDiv />
        </>
      )}
    </PaddedDiv>
  )
}

export default PDU1Edit
