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
import {FlexCenterSpacedDiv, HorizontalSeparatorDiv, VerticalSeparatorDiv} from "@navikt/hoykontrast";
import SEDAttachmentSender from "../SEDAttachmentSender/SEDAttachmentSender";
import {Alert, Button} from "@navikt/ds-react";
import styled from "styled-components";
import * as types from "../../../constants/actionTypes";
import {CheckmarkCircleFillIcon} from "@navikt/aksel-icons";

const MinimalModalDiv = styled.div`
  min-height: 200px;
  min-width: 600px;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: center;
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
        setFinished(t('message:success-x-attachments-total-y-saved', summary))
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
          <>
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
            <SectionDiv>
              <VerticalSeparatorDiv />
              {(_sendingAttachments || _attachmentsSent) && (
                <MinimalModalDiv>
                  <WrapperDiv>
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
                    <VerticalSeparatorDiv />
                  </WrapperDiv>
                </MinimalModalDiv>
              )}
            </SectionDiv>

            {_finished && (
              <>
                <SectionDiv>
                  <FlexCenterSpacedDiv>
                    <CheckmarkCircleFillIcon color='green' />
                    <HorizontalSeparatorDiv size='0.5' />
                    <span>{_finished}</span>
                  </FlexCenterSpacedDiv>
                </SectionDiv>
                <SectionDiv>
                  <FlexCenterSpacedDiv>
                    <Button
                      variant='secondary'
                      onClick={onModalClose}
                    >
                      {t('el:button-close')}
                    </Button>
                  </FlexCenterSpacedDiv>
                </SectionDiv>
              </>
            )}
          </>
        )
      }}
    />
  )
}

export default SendAttachmentModal

