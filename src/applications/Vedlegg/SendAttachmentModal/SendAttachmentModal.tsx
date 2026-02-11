import React, {useEffect, useState} from "react";
import {useAppDispatch, useAppSelector} from "store";
import {State} from "declarations/reducers";
import {
  JoarkBrowserItem,
  JoarkBrowserItems,
  SavingAttachmentsJob, SEDAttachmentPayload,
  SEDAttachmentPayloadWithFile
} from "declarations/attachments";
import Modal from 'components/Modal/Modal'
import _ from "lodash";
import {IS_TEST} from "../../../constants/environment";
import {createSavingAttachmentJob, resetSedAttachments, sendAttachmentToSed} from "../../../actions/attachments";
import {useTranslation} from "react-i18next";
import {alertReset} from "../../../actions/alert";
import SEDAttachmentSender from "../SEDAttachmentSender/SEDAttachmentSender";
import {Alert, Box, Button, HStack, VStack} from "@navikt/ds-react";
import * as types from "../../../constants/actionTypes";
import {CheckmarkCircleFillIcon} from "@navikt/aksel-icons";

interface SendAttachmentModalProps {
  fnr: string
  initialSendingAttachments?: boolean
  onModalClose: () => void
  open: boolean
}

interface SendAttachmentSelector {
  alertMessage: JSX.Element | string | undefined
  bannerMessage: JSX.Element | string | undefined
  alertType: string | undefined
  savingAttachmentsJob: SavingAttachmentsJob | undefined
  attachments: JoarkBrowserItems
  rinaId: string | undefined
  rinaDokumentId: string | undefined
}


const mapState = (state: State): SendAttachmentSelector => ({
  alertMessage: state.alert.stripeMessage,
  bannerMessage: state.alert.bannerMessage,
  alertType: state.alert.type,
  savingAttachmentsJob: state.attachments.savingAttachmentsJob,
  attachments: state.vedlegg.attachments,
  rinaId: state.vedlegg.rinasaksnummer,
  rinaDokumentId: state.vedlegg.rinadokumentID,
})

const SendAttachmentModal: React.FC<SendAttachmentModalProps> = ({
  fnr,
  initialSendingAttachments = false,
  onModalClose,
  open,
}: SendAttachmentModalProps): JSX.Element => {
  const {
    savingAttachmentsJob,
    attachments,
    rinaId,
    rinaDokumentId,
    alertMessage,
    alertType,
    bannerMessage
  }: SendAttachmentSelector = useAppSelector(mapState)
  const dispatch = useAppDispatch()
  const { t } = useTranslation()
  const [_attachmentsSent, setAttachmentsSent] = useState<boolean>(false)
  const [_sendingAttachments, setSendingAttachments] = useState<boolean>(initialSendingAttachments)
  const [_finished, setFinished] = useState<string | undefined>(undefined)

  const sedAttachmentSorter = (a: JoarkBrowserItem, b: JoarkBrowserItem): number => {
    if (b.type === 'joark' && a.type === 'sed') return -1
    if (b.type === 'sed' && a.type === 'joark') return 1
    return b.key.localeCompare(a.key)
  }

  const _sendAttachmentToSed = (params: SEDAttachmentPayloadWithFile, unsentAttachment: JoarkBrowserItem): void => {
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
    console.log(newAttachments)
    //setSedAttachments(newAttachments)
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
      if (_attachmentsSent) {
        setAttachmentsSent(false)
        dispatch(resetSedAttachments())
      }
      setSendingAttachments(false)
    }
  }

  useEffect(() => {
    dispatch(alertReset())
    if(open){
      const joarksToUpload: JoarkBrowserItems = _.filter(attachments, (att) => att.type === 'joark')
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
  }, [open, attachments])

  useEffect(() => {
    if(!savingAttachmentsJob){
      setSendingAttachments(false)
    }

  }, [savingAttachmentsJob])

  return (
    <Modal
      open={open}
      onModalClose={onModalClose}
      modal={{
        modalTitle: "Sender vedlegg",
        modalContent: (
          <VStack gap="4">
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
            <HStack gap="2" align="center" justify="center">
              {(_sendingAttachments || _attachmentsSent) && (
                <VStack gap="4" align="stretch" justify="center" minHeight="200px" minWidth="600px">
                  <Box padding="4" background="bg-subtle">
                    <SEDAttachmentSender
                      attachmentsError={undefined}
                      payload={{
                        fnr,
                        rinaId: rinaId,
                        rinaDokumentId: rinaDokumentId
                      } as SEDAttachmentPayload}
                      onSaved={_onSaved}
                      onFinished={_onFinished}
                      onCancel={_cancelSendAttachmentToSed}
                      sendAttachmentToSed={_sendAttachmentToSed}
                    />
                  </Box>
                </VStack>
              )}
            </HStack>

            {_finished && (
              <VStack gap="4" align="stretch" justify="center" minHeight="200px" minWidth="600px">
                <HStack gap="2" align="center" justify="center">
                  <CheckmarkCircleFillIcon color='green' />
                  <span>{_finished}</span>
                </HStack>
                <HStack gap="2" align="center" justify="center">
                  <Button
                    variant='secondary'
                    onClick={onModalClose}
                  >
                    {t('el:button-close')}
                  </Button>
                </HStack>
              </VStack>
            )}
          </VStack>
        )
      }}
    />
  )
}

export default SendAttachmentModal

