import { createSavingAttachmentJob, resetSedAttachments, sendAttachmentToSed } from 'actions/attachments'
import SEDAttachmentSender from 'applications/Vedlegg/SEDAttachmentSender/SEDAttachmentSender'
import { CheckmarkCircleFillIcon } from '@navikt/aksel-icons'
import Modal from 'components/Modal/Modal'
import { AlertstripeDiv } from 'components/StyledComponents'
import * as types from 'constants/actionTypes'
import { IS_TEST } from 'constants/environment'
import {
  JoarkBrowserItem,
  JoarkBrowserItems,
  SavingAttachmentsJob,
  SEDAttachmentPayload,
  SEDAttachmentPayloadWithFile
} from 'declarations/attachments'
import { State } from 'declarations/reducers'
import { ReplySed } from 'declarations/sed'
import { CreateSedResponse } from 'declarations/types'
import _ from 'lodash'
import { Alert, Button, Loader } from '@navikt/ds-react'
import {
  FlexCenterSpacedDiv,
  HorizontalSeparatorDiv,
  PileCenterDiv,
  PileDiv,
  VerticalSeparatorDiv
} from '@navikt/hoykontrast'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAppDispatch, useAppSelector } from 'store'
import styled from 'styled-components'
import {alertReset} from "../../../actions/alert";

const MinimalModalDiv = styled.div`
  min-height: 200px;
  min-width: 600px;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: center;
`
const MinimalContentDiv = styled.div`
  flex: 1;
  width: 100%;
  align-items: center;
  display: flex;
  flex-direction: column;
`
const SectionDiv = styled.div`
  flex: 1;
  align-items: stretch;
  flex-direction: row;
  display: flex;
  justify-content: center;
`
const WrapperDiv = styled.div`
  padding: 1rem;
  background-color: whitesmoke;
`

interface SendSEDSelector {
  alertMessage: JSX.Element | string | undefined
  bannerMessage: JSX.Element | string | undefined
  alertType: string | undefined
  creatingSvarSed: boolean
  updatingSvarSed: boolean
  sedCreatedResponse: CreateSedResponse | null | undefined
  sedSendResponse: any | null | undefined
  sendingSed: boolean,
  savingAttachmentsJob: SavingAttachmentsJob | undefined
}

interface SendSEDModalProps {
  fnr: string
  initialSendingAttachments?: boolean
  onModalClose: () => void
  onSendSedClicked: () => void
  open: boolean
  replySed: ReplySed | null | undefined
}

const mapState = (state: State): SendSEDSelector => ({
  alertMessage: state.alert.stripeMessage,
  bannerMessage: state.alert.bannerMessage,
  alertType: state.alert.type,
  creatingSvarSed: state.loading.creatingSvarSed,
  updatingSvarSed: state.loading.updatingSvarSed,
  sedCreatedResponse: state.svarsed.sedCreatedResponse,
  sedSendResponse: state.svarsed.sedSendResponse,
  sendingSed: state.loading.sendingSed,
  savingAttachmentsJob: state.attachments.savingAttachmentsJob
})

const SendSEDModal: React.FC<SendSEDModalProps> = ({
  fnr,
  initialSendingAttachments = false,
  onModalClose,
  onSendSedClicked,
  open,
  replySed
}: SendSEDModalProps): JSX.Element => {
  const {
    alertMessage,
    bannerMessage,
    alertType,
    creatingSvarSed,
    updatingSvarSed,
    sendingSed,
    sedCreatedResponse,
    sedSendResponse,
    savingAttachmentsJob
  }: SendSEDSelector = useAppSelector(mapState)
  const dispatch = useAppDispatch()
  const { t } = useTranslation()
  const [_attachmentsSent, setAttachmentsSent] = useState<boolean>(false)
  const [_sendingAttachments, setSendingAttachments] = useState<boolean>(initialSendingAttachments)
  const [_sedAttachments, setSedAttachments] = useState<JoarkBrowserItems>(replySed?.attachments ?? [])
  const [_sedSent, setSedSent] = useState<boolean>(false)
  const [_finished, setFinished] = useState<string | undefined>(undefined)
  const [_sendButtonClicked, _setSendButtonClicked] = useState<boolean>(false)

  const sedAttachmentSorter = (a: JoarkBrowserItem, b: JoarkBrowserItem): number => {
    if (b.type === 'joark' && a.type === 'sed') return -1
    if (b.type === 'sed' && a.type === 'joark') return 1
    return b.key.localeCompare(a.key)
  }

  const _sendAttachmentToSed = (params: SEDAttachmentPayloadWithFile, unsentAttachment: JoarkBrowserItem): void => {
    if(_sedSent){
      dispatch(alertReset())
    }
    dispatch(sendAttachmentToSed(params, unsentAttachment))
  }

  const _cancelSendAttachmentToSed = (): void => {
    setSendingAttachments(false)
    setAttachmentsSent(false)
    dispatch(resetSedAttachments())
  }

  const _onSaved = (savingAttachmentsJob: SavingAttachmentsJob): void => {
    const newAttachments: JoarkBrowserItems = savingAttachmentsJob.saved
      .concat(savingAttachmentsJob.remaining)
      .sort(sedAttachmentSorter)
    setSedAttachments(newAttachments)
  }

  const _onFinished = (summary: any) => {
    if (!_finished) {
      if (_.isString(summary)) {
        setFinished(summary)
      } else {
        setFinished(t('message:success-x-attachments-total-y-saved', summary))
      }
    }
    if (_sendingAttachments) {
      setSedSent(false)
      if (_attachmentsSent) {
        setAttachmentsSent(false)
        dispatch(resetSedAttachments())
      }
      setSendingAttachments(false)
    }
  }

  const closeModal = () => {
    setFinished(undefined)
    setSedSent(false)
    onModalClose();
  }

  useEffect(() => {
    setSedAttachments(replySed?.attachments ?? [])
  }, [replySed?.attachments])

  useEffect(() => {
    if (sedCreatedResponse) {
      setSedSent(true)
    }
  }, [sedCreatedResponse])

  useEffect(() => {
    dispatch(alertReset())
  }, [open])

  useEffect(() => {
    // if sed is sent, we can start sending attachments
    if (_sedSent && !_sendingAttachments && !_attachmentsSent) {
      const joarksToUpload: JoarkBrowserItems = _.filter(_sedAttachments, (att) => att.type === 'joark')
      if (_.isEmpty(joarksToUpload)) {
        /* istanbul ignore next */
        if (!IS_TEST) {
          console.log('SEDStart: No attachments to send, concluding')
        }
        _onFinished(t('message:success-no-attachments-to-save'))
        return
      }
      // attachments to send -> start a savingAttachmentsJob
      setSendingAttachments(true)
      dispatch(createSavingAttachmentJob(joarksToUpload))
    }
  }, [sedCreatedResponse, _sedSent])

  useEffect(() => {
    if(!savingAttachmentsJob){
      setSendingAttachments(false)
    }

  }, [savingAttachmentsJob])

  return (
    <Modal
      open={open}
      modal={{
        modalTitle: t('label:lagre-sed'),
        modalContent: (
          <MinimalModalDiv>
            {alertMessage && alertType && [types.SVARSED_SED_CREATE_FAILURE, types.SVARSED_SED_UPDATE_FAILURE].indexOf(alertType) >= 0 && (
              <PileCenterDiv>
                <AlertstripeDiv>
                  <Alert variant='error'>{alertMessage}</Alert>
                </AlertstripeDiv>
                <VerticalSeparatorDiv />
                <FlexCenterSpacedDiv>
                  <div />
                  <Button
                    variant='secondary'
                    onClick={onModalClose}
                  >
                    {t('label:damn-really')}
                  </Button>
                  <div />
                </FlexCenterSpacedDiv>
              </PileCenterDiv>
            )}
            {alertMessage && alertType && _sendButtonClicked && [types.SVARSED_SED_SEND_SUCCESS, types.SVARSED_SED_SEND_FAILURE].indexOf(alertType) >= 0 && (
              <>
                <AlertstripeDiv>
                  <Alert variant={alertType === types.SVARSED_SED_SEND_FAILURE ? 'error' : 'success'}>
                    {alertMessage}
                  </Alert>
                  <Button
                    variant='tertiary'
                    onClick={() => {
                      _setSendButtonClicked(false)
                      onModalClose()
                    }}
                  >
                    OK
                  </Button>
                </AlertstripeDiv>
                <VerticalSeparatorDiv />
              </>
            )}
            {alertMessage && alertType && [types.ATTACHMENT_SEND_FAILURE].indexOf(alertType) >= 0 && (
              <>
                <Alert variant='error'>
                  {alertMessage}
                </Alert>
                <VerticalSeparatorDiv size='2' />
              </>
            )}
            {bannerMessage && (
              <>
                <Alert variant='error'>
                  {bannerMessage}
                </Alert>
                <VerticalSeparatorDiv size='2' />
              </>
            )}
            <MinimalContentDiv>
              <SectionDiv>
                <PileDiv style={{ alignItems: 'flex-start' }}>
                  <div>
                    {(creatingSvarSed || updatingSvarSed) && (
                      <FlexCenterSpacedDiv>
                        <Loader type='xsmall' />
                        <HorizontalSeparatorDiv size='0.5' />
                        <span>{creatingSvarSed ? t('message:loading-opprette-sed') : t('message:loading-oppdatering-sed')}</span>
                      </FlexCenterSpacedDiv>
                    )}
                    {!_.isNil(sedCreatedResponse) && (
                      <FlexCenterSpacedDiv>
                        <CheckmarkCircleFillIcon color='green' />
                        <HorizontalSeparatorDiv size='0.5' />
                        <span>{t('message:loading-sed-lagret')}</span>
                      </FlexCenterSpacedDiv>
                    )}
                  </div>
                  <VerticalSeparatorDiv size='0.5' />
                  <div>
                    {_finished && (
                      <FlexCenterSpacedDiv>
                        <CheckmarkCircleFillIcon color='green' />
                        <HorizontalSeparatorDiv size='0.5' />
                        <span>{_finished}</span>
                      </FlexCenterSpacedDiv>
                    )}
                    {_sendingAttachments && (
                      <FlexCenterSpacedDiv>
                        <Loader type='xsmall' />
                        <HorizontalSeparatorDiv size='0.5' />
                        <span>{t('message:loading-sending-vedlegg')}</span>
                      </FlexCenterSpacedDiv>
                    )}
                  </div>
                  <VerticalSeparatorDiv size='0.5' />
                  <div>
                    {!_.isNil(sedSendResponse) && _finished && (
                      <FlexCenterSpacedDiv>
                        <CheckmarkCircleFillIcon color='green' />
                        <HorizontalSeparatorDiv size='0.5' />
                        <span>{t('message:loading-sed-sendt')}</span>
                      </FlexCenterSpacedDiv>
                    )}
                    {sendingSed && (
                      <FlexCenterSpacedDiv>
                        <Loader type='xsmall' />
                        <HorizontalSeparatorDiv size='0.5' />
                        <span>{t('message:loading-sending-sed')}</span>
                      </FlexCenterSpacedDiv>
                    )}
                  </div>
                </PileDiv>
              </SectionDiv>
              <SectionDiv>
                <VerticalSeparatorDiv />
                {(_sendingAttachments || _attachmentsSent) && (
                  <MinimalModalDiv>
                    <WrapperDiv>
                      <SEDAttachmentSender
                        attachmentsError={undefined}
                        payload={{
                          fnr,
                          rinaId: replySed!.sak?.sakId,
                          rinaDokumentId: sedCreatedResponse?.sedId
                        } as SEDAttachmentPayload}
                        onSaved={_onSaved}
                        onFinished={_onFinished}
                        onCancel={_cancelSendAttachmentToSed}
                        sendAttachmentToSed={_sendAttachmentToSed}
                      />
                      <VerticalSeparatorDiv />
                    </WrapperDiv>
                  </MinimalModalDiv>
                )}
                {_finished && (
                  <FlexCenterSpacedDiv>
                    <Button
                      variant='secondary'
                      onClick={closeModal}
                    >
                      {t('el:button-close')}
                    </Button>

                    <HorizontalSeparatorDiv />
                    <Button
                      variant='primary'
                      title={t('message:help-send-sed')}
                      disabled={sendingSed || _.isEmpty(sedCreatedResponse) || !_.isEmpty(sedSendResponse)}
                      onClick={onSendSedClicked}
                    >
                      {sendingSed ? t('message:loading-sending-sed') : t('el:button-send-sed')}
                    </Button>
                  </FlexCenterSpacedDiv>
                )}
              </SectionDiv>
            </MinimalContentDiv>
          </MinimalModalDiv>
        )
      }}
      onModalClose={onModalClose}
    />
  )
}

export default SendSEDModal
