import { createSavingAttachmentJob, resetSedAttachments, sendAttachmentToSed } from 'actions/attachments'
import { sendSedInRina } from 'actions/svarpased'
import SEDAttachmentSender from 'applications/Vedlegg/SEDAttachmentSender/SEDAttachmentSender'
import GreenCircle from 'assets/icons/GreenCircle'
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
import { buttonLogger, standardLogger } from 'metrics/loggers'
import AlertStripe from 'nav-frontend-alertstriper'
import NavFrontendSpinner from 'nav-frontend-spinner'
import { Undertittel } from 'nav-frontend-typografi'
import {
  FlexCenterSpacedDiv,
  HighContrastHovedknapp,
  HighContrastKnapp,
  HorizontalSeparatorDiv,
  PileDiv,
  VerticalSeparatorDiv
} from 'nav-hoykontrast'
import React, { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'

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
  alertMessage: string | undefined
  alertType: string | undefined
  creatingSvarPaSed: boolean
  replySed: ReplySed | null | undefined
  sedCreatedResponse: CreateSedResponse | null | undefined
  sedSendResponse: any | null | undefined
  sendingSed: boolean
}

interface SendSEDModalProps {
  fnr: string
  goToRinaUrl: string | undefined
  highContrast: boolean
  attachments?: JoarkBrowserItems
  initialSendingAttachments?: boolean
  onModalClose: () => void
}

const mapState = (state: State): SendSEDSelector => ({
  alertMessage: state.alert.clientErrorMessage,
  alertType: state.alert.type,
  creatingSvarPaSed: state.loading.creatingSvarPaSed,
  replySed: state.svarpased.replySed,
  sedCreatedResponse: state.svarpased.sedCreatedResponse,
  sedSendResponse: state.svarpased.sedSendResponse,
  sendingSed: state.loading.sendingSed
})

const SendSEDModal: React.FC<SendSEDModalProps> = ({
  fnr,
  goToRinaUrl,
  highContrast,
  attachments = [],
  initialSendingAttachments = false,
  onModalClose
}: SendSEDModalProps): JSX.Element => {
  const {
    alertMessage,
    alertType,
    creatingSvarPaSed,
    sendingSed,
    replySed,
    sedCreatedResponse,
    sedSendResponse
  }: SendSEDSelector = useSelector<State, SendSEDSelector>(mapState)
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

  const onSendSedClick = () => {
    dispatch(sendSedInRina(replySed?.saksnummer, sedCreatedResponse?.sedId))
    standardLogger('svarsed.editor.sendsvarsed.button', { type: 'modal' })
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
              {_.isEmpty(sedCreatedResponse) ? t('label:opprette-ny-sed') : t('label:oppdatere-svarsed')}
            </Undertittel>
            <VerticalSeparatorDiv />
            {alertMessage && alertType && [types.SVARPASED_SED_CREATE_FAILURE].indexOf(alertType) >= 0 && (
              <>
                <AlertstripeDiv>
                  <AlertStripe type='advarsel'>
                    {t(alertMessage)}
                  </AlertStripe>
                </AlertstripeDiv>
                <VerticalSeparatorDiv />
              </>
            )}
            <MinimalContentDiv>
              <SectionDiv>
                <PileDiv style={{ alignItems: 'flex-start' }}>
                  <div>
                    {creatingSvarPaSed && (
                      <FlexCenterSpacedDiv>
                        <NavFrontendSpinner type='XS' />
                        <HorizontalSeparatorDiv size='0.5' />
                        <span>{_.isEmpty(sedCreatedResponse) ? t('message:loading-opprette-svarsed') : t('message:loading-oppdatering-svarsed')}</span>
                      </FlexCenterSpacedDiv>
                    )}
                    {!_.isNil(sedCreatedResponse) && (
                      <FlexCenterSpacedDiv>
                        <GreenCircle />
                        <HorizontalSeparatorDiv size='0.5' />
                        <span>{t('message:loading-sed-created-updated')}</span>
                      </FlexCenterSpacedDiv>
                    )}
                  </div>
                  <VerticalSeparatorDiv size='0.5' />
                  <div>
                    {_finished && (
                      <FlexCenterSpacedDiv>
                        <GreenCircle />
                        <HorizontalSeparatorDiv size='0.5' />
                        <span>{t('message:loading-sed-ferdig')}</span>
                      </FlexCenterSpacedDiv>
                    )}
                    {_sendingAttachments && (
                      <FlexCenterSpacedDiv>
                        <NavFrontendSpinner type='XS' />
                        <HorizontalSeparatorDiv size='0.5' />
                        <span>{t('message:loading-sending-vedlegg')}</span>
                      </FlexCenterSpacedDiv>
                    )}
                  </div>
                  <VerticalSeparatorDiv size='0.5' />
                  <div>
                    {!_.isNil(sedSendResponse) && (
                      <FlexCenterSpacedDiv>
                        <GreenCircle />
                        <HorizontalSeparatorDiv size='0.5' />
                        <span>{t('message:loading-sed-sendt')}</span>
                      </FlexCenterSpacedDiv>
                    )}
                    {sendingSed && (
                      <FlexCenterSpacedDiv>
                        <NavFrontendSpinner type='XS' />
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
                          fnr: fnr,
                          rinaId: replySed!.saksnummer,
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
                    <HighContrastKnapp
                      mini
                      ampliutude
                      onClick={onModalClose}
                    >
                      {t('el:button-close')}
                    </HighContrastKnapp>

                    {!_.isEmpty(sedCreatedResponse) && (
                      <>
                        <HorizontalSeparatorDiv />
                        <HighContrastHovedknapp
                          // amplitude is dealt on SendSedClick
                          mini
                          title={t('message:help-send-sed')}
                          disabled={sendingSed || !_.isNil(sedSendResponse)}
                          onClick={onSendSedClick}
                        >
                          {sendingSed ? t('message:loading-sending-sed') : t('el:button-send-sed')}
                        </HighContrastHovedknapp>
                      </>
                    )}
                    <HorizontalSeparatorDiv />
                    {goToRinaUrl && (
                      <HighContrastHovedknapp
                        mini
                        data-amplitude='svarsed.editor.editinrina.button'
                        onClick={(e: React.ChangeEvent<HTMLButtonElement>) => {
                          buttonLogger(e)
                          window.open(goToRinaUrl, 'rina')
                        }}
                      >
                        {t('label:rediger-sed-i-rina')}
                      </HighContrastHovedknapp>
                    )}
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
