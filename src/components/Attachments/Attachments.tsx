import {
  createSavingAttachmentJob,
  resetSavingAttachmentJob,
  resetSed,
  resetSedAttachments,
  sendAttachmentToSed
} from 'actions/attachments'
import { JoarkBrowser } from 'components/JoarkBrowser/JoarkBrowser'
import SEDAttachmentModal from 'components/SEDAttachmentModal/SEDAttachmentModal'
import SEDAttachmentSender from 'components/SEDAttachmentSender/SEDAttachmentSender'
import { IS_TEST } from 'constants/environment'
import {
  JoarkBrowserItem,
  JoarkBrowserItems,
  SavingAttachmentsJob,
  SEDAttachmentPayloadWithFile
} from 'declarations/attachments'
import _ from 'lodash'
import { HighContrastKnapp, VerticalSeparatorDiv } from 'nav-hoykontrast'
import React, { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import styled from 'styled-components'

export interface AttachmentsProps {
  highContrast: boolean
  initialAttachments?: JoarkBrowserItems
  initialSendingAttachments?: boolean
  onSedCreated: () => void
  sed: any
}

const SEDAttachmentSenderDiv = styled.div`
   margin-top: 1rem;
   margin-bottom: 1rem;
   width: 100%;
`

const Attachments: React.FC<AttachmentsProps> = ({
  initialSendingAttachments = false,
  initialAttachments = [],
  highContrast,
  onSedCreated = () => {},
  sed
}: AttachmentsProps): JSX.Element => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const [_attachmentsSent, setAttachmentsSent] = useState<boolean>(false)
  const [_attachmentsTableVisible, setAttachmentsTableVisible] = useState<boolean>(false)
  const [_sedAttachments, setSedAttachments] = useState<JoarkBrowserItems>(initialAttachments)
  const [_sedSent, setSedSent] = useState<boolean>(false)
  const [_sendingAttachments, setSendingAttachments] = useState<boolean>(initialSendingAttachments)
  const [_items, setItems] = useState<JoarkBrowserItems>([])

  const sedAttachmentSorter = (a: JoarkBrowserItem, b: JoarkBrowserItem): number => {
    if (b.type === 'joark' && a.type === 'sed') return -1
    if (b.type === 'sed' && a.type === 'joark') return 1
    return b.key.localeCompare(a.key)
  }

  const onJoarkAttachmentsChanged = (jbi: JoarkBrowserItems): void => {
    const sedOriginalAttachments: JoarkBrowserItems = _.filter(_items, (att) => att.type !== 'joark')
    const newAttachments = sedOriginalAttachments.concat(jbi).sort(sedAttachmentSorter)
    setItems(newAttachments)
  }

  const onRowViewDelete = (newItems: JoarkBrowserItems): void => {
    setItems(newItems)
  }

  const _sendAttachmentToSed = (params: SEDAttachmentPayloadWithFile, unsentAttachment: JoarkBrowserItem): void => {
    dispatch(sendAttachmentToSed(params, unsentAttachment))
  }

  const _onSaved = (savingAttachmentsJob: SavingAttachmentsJob): void => {
    const newAttachments: JoarkBrowserItems = savingAttachmentsJob.saved
      .concat(savingAttachmentsJob.remaining)
      .sort(sedAttachmentSorter)
    setSedAttachments(newAttachments)
  }

  const _cancelSendAttachmentToSed = (): void => {
    setSendingAttachments(false)
    setAttachmentsSent(false)
    dispatch(resetSavingAttachmentJob())
  }

  const resetJoarkAttachments = useCallback((): void => {
    const newAttachments: JoarkBrowserItems = _.filter(_sedAttachments, (att) => att.type !== 'joark')
      .sort(sedAttachmentSorter)
    setSedAttachments(newAttachments)
  }, [_sedAttachments])

  const _onFinished = useCallback((): void => {
    dispatch(resetSed())
    dispatch(resetSedAttachments())
    resetJoarkAttachments()
    setSedSent(false)
    if (_attachmentsSent) {
      setAttachmentsSent(false)
    }
    setSendingAttachments(false)
    onSedCreated()
  }, [_attachmentsSent, dispatch, onSedCreated, resetJoarkAttachments])

  useEffect(() => {
    if (sed && !_sedSent) {
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
      setAttachmentsTableVisible(false)

      dispatch(createSavingAttachmentJob(joarksToUpload))
    }
  }, [_attachmentsSent, dispatch, _onFinished, _sendingAttachments, _sedAttachments, _sedSent])

  return (
    <>
      <VerticalSeparatorDiv data-size='2' />
      <label className='skjemaelement__label'>
        {t('ui:attachments')}
      </label>
      <VerticalSeparatorDiv />
      <HighContrastKnapp
        onClick={() => setAttachmentsTableVisible(!_attachmentsTableVisible)}
      >
        {t(_attachmentsTableVisible ? 'ui:hideAttachments' : 'ui:showAttachments')}
      </HighContrastKnapp>
      <VerticalSeparatorDiv />
      {_attachmentsTableVisible && (
        <SEDAttachmentModal
          highContrast={highContrast}
          onModalClose={() => setAttachmentsTableVisible(false)}
          onFinishedSelection={onJoarkAttachmentsChanged}
          sedAttachments={_sedAttachments}
          tableId='newsed-modal'
        />
      )}
      {!_.isEmpty(_sedAttachments) && (
        <>
          <VerticalSeparatorDiv />
          <JoarkBrowser
            mode='view'
            existingItems={_sedAttachments}
            highContrast={highContrast}
            onRowViewDelete={onRowViewDelete}
            tableId='newsed-view'
          />
        </>
      )}
      {(_sendingAttachments || _attachmentsSent) && (
        <SEDAttachmentSenderDiv>
          <>
            <SEDAttachmentSender
              attachmentsError={undefined}
              payload={{}}
              onSaved={_onSaved}
              onFinished={_onFinished}
              onCancel={_cancelSendAttachmentToSed}
              sendAttachmentToSed={_sendAttachmentToSed}
            />
            <VerticalSeparatorDiv />
          </>
        </SEDAttachmentSenderDiv>
      )}
    </>
  )
}

export default Attachments
