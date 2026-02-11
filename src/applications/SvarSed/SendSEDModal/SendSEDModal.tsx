import { createSavingAttachmentJob, resetSedAttachments, sendAttachmentToSed } from 'actions/attachments'
import SEDAttachmentSender from 'applications/Vedlegg/SEDAttachmentSender/SEDAttachmentSender'
import { CheckmarkCircleFillIcon } from '@navikt/aksel-icons'
import Modal from 'components/Modal/Modal'
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
import {Alert, Box, Button, HStack, Loader, Spacer, VStack} from '@navikt/ds-react'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAppDispatch, useAppSelector } from 'store'
import {alertReset} from "../../../actions/alert";

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
        setFinished(t('message:success-x-attachments-total-y-saved', summary) as string)
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
          <VStack gap="4" align="stretch" justify="start" minHeight="200px" minWidth="600px">
            {alertMessage && alertType && [types.SVARSED_SED_CREATE_FAILURE, types.SVARSED_SED_UPDATE_FAILURE].indexOf(alertType) >= 0 && (
              <VStack gap="4">
                <Alert variant='error'>{alertMessage}</Alert>
                <HStack>
                  <Spacer/>
                  <Button
                    variant='secondary'
                    onClick={onModalClose}
                  >
                    {t('label:damn-really')}
                  </Button>
                  <Spacer/>
                </HStack>
              </VStack>
            )}
            {alertMessage && alertType && _sendButtonClicked && [types.SVARSED_SED_SEND_SUCCESS, types.SVARSED_SED_SEND_FAILURE].indexOf(alertType) >= 0 && (
              <VStack gap="4">
                <Alert variant={alertType === types.SVARSED_SED_SEND_FAILURE ? 'error' : 'success'}>
                  {alertMessage}
                </Alert>
                <HStack>
                  <Spacer/>
                  <Button
                    variant='tertiary'
                    onClick={() => {
                      _setSendButtonClicked(false)
                      onModalClose()
                    }}
                  >
                    OK
                  </Button>
                  <Spacer/>
                </HStack>
              </VStack>
            )}
            {alertMessage && alertType && [types.ATTACHMENT_SEND_FAILURE].indexOf(alertType) >= 0 && (
              <Alert variant='error'>
                {alertMessage}
              </Alert>
            )}
            {bannerMessage && (

              <Alert variant='error'>
                {bannerMessage}
              </Alert>

            )}
            <VStack align="center" width="100%" gap="4">
              <HStack justify="center" align="stretch">
                <VStack align="start" gap="2">
                  <div>
                    {(creatingSvarSed || updatingSvarSed) && (
                      <HStack gap="2" align="center">
                        <Loader type='xsmall' />
                        <span>{creatingSvarSed ? t('message:loading-opprette-sed') : t('message:loading-oppdatering-sed')}</span>
                      </HStack>
                    )}
                    {!_.isNil(sedCreatedResponse) && (
                      <HStack gap="2" align="center">
                        <CheckmarkCircleFillIcon color='green' />
                        <span>{t('message:loading-sed-lagret')}</span>
                      </HStack>
                    )}
                  </div>
                  <div>
                    {_finished && (
                      <HStack gap="2" align="center">
                        <CheckmarkCircleFillIcon color='green' />
                        <span>{_finished}</span>
                      </HStack>
                    )}
                    {_sendingAttachments && (
                      <HStack gap="2" align="center">
                        <Loader type='xsmall' />
                        <span>{t('message:loading-sending-vedlegg')}</span>
                      </HStack>
                    )}
                  </div>
                  <div>
                    {!_.isNil(sedSendResponse) && _finished && (
                      <HStack gap="2" align="center">
                        <CheckmarkCircleFillIcon color='green' />
                        <span>{t('message:loading-sed-sendt')}</span>
                      </HStack>
                    )}
                    {sendingSed && (
                      <HStack gap="2" align="center">
                        <Loader type='xsmall' />
                        <span>{t('message:loading-sending-sed')}</span>
                      </HStack>
                    )}
                  </div>
                </VStack>
              </HStack>
              <HStack justify="center" align="stretch">
                {(_sendingAttachments || _attachmentsSent) && (
                  <VStack gap="4" align="stretch" justify="center" minHeight="200px" minWidth="600px">
                    <Box padding="4" background="bg-subtle">
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
                    </Box>
                  </VStack>
                )}
                {_finished && (
                  <HStack gap="4" align="center">
                    <Button
                      variant='secondary'
                      onClick={closeModal}
                    >
                      {t('el:button-close')}
                    </Button>
                    <Button
                      variant='primary'
                      title={t('message:help-send-sed')}
                      disabled={sendingSed || _.isEmpty(sedCreatedResponse) || !_.isEmpty(sedSendResponse)}
                      onClick={onSendSedClicked}
                    >
                      {sendingSed ? t('message:loading-sending-sed') : t('el:button-send-sed')}
                    </Button>
                  </HStack>
                )}
              </HStack>
            </VStack>
          </VStack>
        )
      }}
      onModalClose={onModalClose}
    />
  )
}

export default SendSEDModal
