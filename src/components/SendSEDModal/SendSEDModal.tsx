import { clientClear } from 'actions/alert'
import { createSavingAttachmentJob, resetSedResponse, resetSedAttachments, sendAttachmentToSed } from 'actions/attachments'
import Alert from 'components/Alert/Alert'
import Modal from 'components/Modal/Modal'
import * as types from 'constants/actionTypes'
import { IS_TEST } from 'constants/environment'
import {
  JoarkBrowserItem,
  JoarkBrowserItems,
  SavingAttachmentsJob, SEDAttachmentPayload,
  SEDAttachmentPayloadWithFile
} from 'declarations/attachments'
import { AlertStatus } from 'declarations/components'
import { State } from 'declarations/reducers'
import _ from 'lodash'
import Alertstripe from 'nav-frontend-alertstriper'
import { HighContrastHovedknapp, VerticalSeparatorDiv } from 'nav-hoykontrast'
import React, { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'
import { FullWidthDiv } from 'components/StyledComponents'
import SEDAttachmentSender from 'components/SEDAttachmentSender/SEDAttachmentSender'

const AlertstripeDiv = styled.div`
  margin: 0.5rem;
  margin-top: 1.5rem;
  margin-bottom: 1.5rem;
  width: 50%;
`
const MinimalContentDiv = styled.div`
  min-height: 200px;
  min-width: 600px;
`
interface SendSEDModalProps {
  highContrast: boolean
  attachments?: JoarkBrowserItems
  initialSendingAttachments?: boolean
  onModalClose: () => void
}

const mapState = (state: State): any => ({
  alertStatus: state.alert.clientErrorStatus,
  alertMessage: state.alert.clientErrorMessage,
  alertType: state.alert.type,
  creatingSvarPaSed: state.loading.creatingSvarPaSed,
  sedCreatedResponse: state.svarpased.sedCreatedResponse,
})
const SendSEDModal: React.FC<SendSEDModalProps> = ({
  highContrast,
  attachments = [],
  initialSendingAttachments = false,
  onModalClose
}: SendSEDModalProps): JSX.Element => {

  const {
    alertStatus,
    alertMessage,
    alertType,
    creatingSvarPaSed,
    sedCreatedResponse
  }: any = useSelector<State, any>(mapState)
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const [_attachmentsSent, setAttachmentsSent] = useState<boolean>(false)
  const [_sendingAttachments, setSendingAttachments] = useState<boolean>(initialSendingAttachments)
  const [_sedAttachments, setSedAttachments] = useState<JoarkBrowserItems>(attachments)
  const [_sedSent, setSedSent] = useState<boolean>(false)
  const [_finished, setFinished] = useState<boolean>(false)

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
    setSedAttachments(newAttachments)
  }

  const _onFinished = useCallback((): void => {
    setFinished(true)
    dispatch(resetSedAttachments())
    setSedSent(false)
    if (_attachmentsSent) {
      setAttachmentsSent(false)
    }
    setSendingAttachments(false)
  }, [_attachmentsSent, dispatch])

  useEffect(() => {
    if (sedCreatedResponse && !_sedSent) {
      setSedSent(true)
    }
    // if sed is sent, we can start sending attachments
    if (_sedSent && !_sendingAttachments && !_attachmentsSent) {
      const joarksToUpload: JoarkBrowserItems = _.filter(_sedAttachments, (att) => att.type === 'joark')

      if (_.isEmpty(joarksToUpload)) {
        /* istanbul ignore next */
        if (!IS_TEST) {
           console.log('SEDStart: No attachments to send, concluding')
         }
         _onFinished()
         return
       }

       // attachments to send -> start a savingAttachmentsJob
       setSendingAttachments(true)
       dispatch(createSavingAttachmentJob(joarksToUpload))
     }
   }, [_attachmentsSent, dispatch, _onFinished, sedCreatedResponse, _sendingAttachments, _sedAttachments, _sedSent])


  return (
    <Modal
      highContrast={highContrast}
      modal={{
        closeButton: false,
        modalContent: (
          <MinimalContentDiv>
            {creatingSvarPaSed && (
              <span>{t('message:loading-creatingReplySed')}</span>
            )}
            {alertMessage && alertType && [types.SVARPASED_SED_CREATE_FAILURE].indexOf(alertType) >= 0 && (
              <AlertstripeDiv>
                <Alert
                  type='client'
                  fixed={false}
                  message={t(alertMessage)}
                  status={alertStatus as AlertStatus}
                  onClose={() => dispatch(clientClear())}
                />
              </AlertstripeDiv>
            )}
            {!_.isNil(sedCreatedResponse) && (
              <>
                <span>{t('message:sed created')}</span>

              </>
            )}
            {_finished && (
              <>
              <span>{t('message:finished')}</span>

                <Alertstripe type='suksess'>
                  {sedCreatedResponse.message}
                </Alertstripe>
                <HighContrastHovedknapp
                  mini
                  onClick={() => {
                    dispatch(resetSedResponse())
                    onModalClose()
                  }}
                >
                  {t('label:close')}
                </HighContrastHovedknapp>
              </>
            )}
            {(_sendingAttachments || _attachmentsSent) && (
              <FullWidthDiv>
                <>
                  <SEDAttachmentSender
                    attachmentsError={undefined}
                    payload={{
                      fnr: '10000000001',
                      rinaId: sedCreatedResponse.rinssaksnummer,
                      rinaDokumentId: '456'
                    } as SEDAttachmentPayload}
                    onSaved={_onSaved}
                    onFinished={_onFinished}
                    onCancel={_cancelSendAttachmentToSed}
                    sendAttachmentToSed={_sendAttachmentToSed}
                  />
                  <VerticalSeparatorDiv />
                </>
              </FullWidthDiv>
            )}


          </MinimalContentDiv>
        )
      }}
      onModalClose={onModalClose}
    />
  )

}

export default SendSEDModal
