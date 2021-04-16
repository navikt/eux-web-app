import { clientClear } from 'actions/alert'
import {
  createSavingAttachmentJob,
  resetSedAttachments,
  resetSedResponse,
  sendAttachmentToSed
} from 'actions/attachments'
import CheckCircle from 'assets/icons/CheckCircle'
import Alert from 'components/Alert/Alert'
import Modal from 'components/Modal/Modal'
import SEDAttachmentSender from 'components/SEDAttachmentSender/SEDAttachmentSender'
import { FlexCenterDiv, PileDiv } from 'components/StyledComponents'
import * as types from 'constants/actionTypes'
import { IS_TEST } from 'constants/environment'
import {
  JoarkBrowserItem,
  JoarkBrowserItems,
  SavingAttachmentsJob,
  SEDAttachmentPayload,
  SEDAttachmentPayloadWithFile
} from 'declarations/attachments'
import { AlertStatus } from 'declarations/components'
import { State } from 'declarations/reducers'
import _ from 'lodash'
import NavFrontendSpinner from 'nav-frontend-spinner'
import { Undertittel } from 'nav-frontend-typografi'
import { HighContrastHovedknapp, HorizontalSeparatorDiv, VerticalSeparatorDiv } from 'nav-hoykontrast'
import React, { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'

const AlertstripeDiv = styled.div`
  margin: 0.5rem;
  width: 100%;
`
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
  replySed: state.svarpased.replySed,
  sedCreatedResponse: state.svarpased.sedCreatedResponse
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
    replySed,
    sedCreatedResponse
  }: any = useSelector<State, any>(mapState)
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const [_attachmentsSent, setAttachmentsSent] = useState<boolean>(false)
  const [_sendingAttachments, setSendingAttachments] = useState<boolean>(initialSendingAttachments)
  const [_sedAttachments, setSedAttachments] = useState<JoarkBrowserItems>(attachments)
  const [_sedSent, setSedSent] = useState<boolean>(false)
  const [_finished, setFinished] = useState<boolean>(false)

  const fnr = _.find(replySed?.bruker?.personInfo.pin, p => p.land === 'NO')?.fnr

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
          <MinimalModalDiv>
            <Undertittel>
              {t('el:title-creating-sed')}
            </Undertittel>
            <VerticalSeparatorDiv />
            {alertMessage && alertType && [types.SVARPASED_SED_CREATE_FAILURE].indexOf(alertType) >= 0 && (
              <>
                <AlertstripeDiv>
                  <Alert
                    type='client'
                    fixed={false}
                    message={t(alertMessage)}
                    status={alertStatus as AlertStatus}
                    onClose={() => dispatch(clientClear())}
                  />
                </AlertstripeDiv>
                <VerticalSeparatorDiv />
              </>
            )}
            <MinimalContentDiv>
              <SectionDiv>
                <PileDiv style={{ alignItems: 'flex-start' }}>
                  <div>
                    {creatingSvarPaSed && (
                      <FlexCenterDiv>
                        <NavFrontendSpinner type='XS' />
                        <HorizontalSeparatorDiv data-size='0.5' />
                        <span>{t('message:loading-creatingReplySed')}</span>
                      </FlexCenterDiv>
                    )}
                    {!_.isNil(sedCreatedResponse) && (
                      <FlexCenterDiv>
                        <CheckCircle color='green' />
                        <HorizontalSeparatorDiv data-size='0.5' />
                        <span>{t('message:loading-sedCreated')}</span>
                      </FlexCenterDiv>
                    )}
                  </div>
                  <VerticalSeparatorDiv data-size='0.5' />
                  <div>
                    {_finished && (
                      <FlexCenterDiv>
                        <CheckCircle color='green' />
                        <HorizontalSeparatorDiv data-size='0.5' />
                        <span>{t('message:loading-sedFinished')}</span>
                      </FlexCenterDiv>
                    )}
                    {_sendingAttachments && (
                      <FlexCenterDiv>
                        <NavFrontendSpinner type='XS' />
                        <HorizontalSeparatorDiv data-size='0.5' />
                        <span>{t('message:loading-sendingVedlegg')}</span>
                      </FlexCenterDiv>
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
                          fnr: fnr,
                          rinaId: replySed.saksnummer,
                          rinaDokumentId: sedCreatedResponse.sedId
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
                  <div>
                    <HighContrastHovedknapp
                      mini
                      onClick={() => {
                        dispatch(resetSedResponse())
                        onModalClose()
                      }}
                    >
                      {t('el:button-close')}
                    </HighContrastHovedknapp>
                  </div>
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
