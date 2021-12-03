import { Download, Sight, BackFilled } from '@navikt/ds-icons'
import { Loader, Button, Link } from '@navikt/ds-react'
import { resetCurrentEntry, saveEntry } from 'actions/localStorage'
import {
  completePdu1,
  getPreviewPdu1,
  resetCompletePdu1,
  resetPreviewFile,
  setReplySed,
  updateReplySed
} from 'actions/pdu1'
import { finishPageStatistic, startPageStatistic } from 'actions/statistics'
import { resetAllValidation, viewValidation } from 'actions/validation'
import SavePDU1Modal from 'applications/PDU1/SavePDU1Modal/SavePDU1Modal'
import PersonManager from 'applications/SvarSed/PersonManager/PersonManager'
import Modal from 'components/Modal/Modal'
import { ReplyPdu1 } from 'declarations/pd'
import { State } from 'declarations/reducers'
import { LocalStorageEntry, Validation } from 'declarations/types'
import FileFC from 'forhandsvisningsfil'
import useGlobalValidation from 'hooks/useGlobalValidation'
import _ from 'lodash'
import { buttonLogger } from 'metrics/loggers'
import {
  FlexCenterDiv,
  FlexCenterSpacedDiv,
  FlexDiv,
  HorizontalSeparatorDiv,
  PaddedDiv,
  PileCenterDiv,
  VerticalSeparatorDiv
} from 'nav-hoykontrast'
import ValidationBox from 'pages/SvarSed/ValidationBox'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { convertToPayloadPdu1 } from 'utils/pdu1'
import { validatePDU1Edit, ValidationPDU1EditProps } from './mainValidation'

export interface PDU1EditSelector {
  completingPdu1: boolean
  gettingPreviewPdu1: boolean
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
  completingPdu1: state.loading.completingPdu1,
  gettingPreviewPdu1: state.loading.gettingPreviewPdu1,
  previewPdu1: state.pdu1.previewPdu1,
  replyPdu1: state.pdu1.replyPdu1,
  completePdu1Response: state.pdu1.completePdu1Response,
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
    completingPdu1,
    gettingPreviewPdu1,
    previewPdu1,
    replyPdu1,
    completePdu1Response,
    view
  }: PDU1EditSelector = useSelector<State, PDU1EditSelector>(mapState)
  const currentEntry = useSelector<State, LocalStorageEntry<ReplyPdu1> | undefined>(
    (state) => state.localStorage.pdu1.currentEntry)

  const [previewModal, setPreviewModal] = useState<boolean>(false)
  const [completeModal, setCompleteModal] = useState<boolean>(false)
  const [viewSavePdu1Modal, setViewSavePdu1Modal] = useState<boolean>(false)
  const performValidation = useGlobalValidation<ValidationPDU1EditProps>(validatePDU1Edit)

  const completePdu1Clicked = (e: any): void => {
    if (replyPdu1) {
      const newReplyPdu1: ReplyPdu1 = _.cloneDeep(replyPdu1)
      const valid = performValidation({
        replyPdu1: newReplyPdu1
      })
      dispatch(viewValidation())
      if (valid) {
        dispatch(completePdu1(convertToPayloadPdu1(newReplyPdu1)))
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

  const resetComplete = () => {
    dispatch(resetCompletePdu1())
    setCompleteModal(false)
  }

  const onPreviewPdu1Clicked = (e: any) => {
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
    if (!completeModal && !_.isNil(completePdu1Response)) {
      setCompleteModal(true)
    }
  }, [completePdu1Response])

  useEffect(() => {
    dispatch(startPageStatistic('pdu1editor'))
    return () => {
      dispatch(finishPageStatistic('pdu1editor'))
    }
  }, [])

  return (
    <PaddedDiv size='0.5'>
      {completePdu1Response && (
        <Modal
          open={completeModal}
          modal={{
            closeButton: true,
            modalTitle: t('message:success-complete-pdu1'),
            modalContent: (
              <FlexCenterDiv style={{ minWidth: '400px', minHeight: '100px' }}>
                <PileCenterDiv style={{ alignItems: 'center', width: '100%' }}>
                  <Link
                    onClick={(e: any) => {
                      e.stopPropagation()
                    }}
                    href={'data:application/octet-stream;base64,' + encodeURIComponent(completePdu1Response.content.base64)}
                    download={completePdu1Response.name}
                  >
                    <FlexDiv>
                      {t('label:last-ned-pdu1')}
                      <HorizontalSeparatorDiv />
                      <Download width={20} />
                    </FlexDiv>
                  </Link>
                </PileCenterDiv>
              </FlexCenterDiv>
            ),
            modalButtons: [{
              main: true,
              text: 'OK',
              onClick: resetComplete
            }]
          }}
          onModalClose={resetComplete}
        />
      )}
      <Modal
        open={previewModal}
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
        replyPdu1={replyPdu1!}
        storageKey={storageKey}
        onModalClose={() => setViewSavePdu1Modal(false)}
      />
      <FlexCenterSpacedDiv>
        <Button
          variant='secondary'
          size='small'
          onClick={onGoBackClick}
        >
          <BackFilled />
          <HorizontalSeparatorDiv size='0.5' />
          {t('label:tilbake')}
        </Button>
      </FlexCenterSpacedDiv>
      <VerticalSeparatorDiv size='2' />
      <PersonManager
        replySed={replyPdu1}
        setReplySed={setReplySed}
        updateReplySed={updateReplySed}
        viewValidation={view}
      />
      <VerticalSeparatorDiv size='2' />
      <Button
        variant='tertiary'
        size='small'
        disabled={gettingPreviewPdu1}
        data-amplitude='pdu1.editor.preview'
        onClick={onPreviewPdu1Clicked}
      >
        <Sight />
        <HorizontalSeparatorDiv size='0.5' />
        {gettingPreviewPdu1 ? t('label:laster-ned-filen') : t('el:button-preview-x', { x: 'PD U1' })}
        {gettingPreviewPdu1 && <Loader />}
      </Button>
      <VerticalSeparatorDiv size='2' />
      <ValidationBox />
      <VerticalSeparatorDiv size='2' />
      <FlexDiv>
        <div>
          <Button
            variant='primary'
            data-amplitude='pdu1.editor.opprett'
            onClick={completePdu1Clicked}
            disabled={completingPdu1 || !_.isEmpty(completePdu1Response)}
          >
            {completingPdu1
              ? t('message:loading-opprette-pdu1')
              : t('label:opprett-pdu1')}
            {completingPdu1 && <Loader />}
          </Button>
          <VerticalSeparatorDiv size='0.5' />
        </div>
        <HorizontalSeparatorDiv />

        <div>
          <Button
            variant='secondary'
            size='small'
            data-amplitude={_.isNil(currentEntry) ? 'pdu1.editor.savedraft' : 'pdu1.editor.updatedraft'}
            onClick={onSavePdu1Click}
          >
            {_.isNil(currentEntry)
              ? t('el:button-save-draft-x', { x: 'PD U1' })
              : t('el:button-update-draft-x', { x: 'PD U1' })}
          </Button>
          <VerticalSeparatorDiv size='0.5' />
        </div>
      </FlexDiv>
      <VerticalSeparatorDiv />
    </PaddedDiv>
  )
}

export default PDU1Edit
