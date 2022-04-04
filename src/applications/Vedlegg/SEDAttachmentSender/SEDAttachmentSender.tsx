import { IS_TEST } from 'constants/environment'
import {
  JoarkBrowserItem,
  SavingAttachmentsJob,
  SEDAttachmentPayload,
  SEDAttachmentPayloadWithFile
} from 'declarations/attachments.d'
import {
  SEDAttachmentPayloadPropType
} from 'declarations/attachments.pt'
import { State } from 'declarations/reducers'
import ProgressBar, { ProgressBarStatus } from '@navikt/fremdriftslinje'
import _ from 'lodash'
import md5 from 'md5'
import { Button } from '@navikt/ds-react'
import { HorizontalSeparatorDiv } from '@navikt/hoykontrast'
import PT from 'prop-types'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import styled from 'styled-components'

const SEDAttachmentSenderDiv = styled.div`
  display: flex;
  align-items: center;
`

export interface SEDAttachmentSenderProps {
  attachmentsError ?: boolean
  className?: string
  initialStatus ?: ProgressBarStatus
  onCancel ?: () => void
  onFinished : (summary: any) => void
  onSaved: (savingAttachmentsJob: SavingAttachmentsJob) => void
  payload: SEDAttachmentPayload
  sendAttachmentToSed : (params: SEDAttachmentPayloadWithFile, unsent: JoarkBrowserItem) => void
}

export interface SEDAttachmentSelector {
  savingAttachmentsJob: SavingAttachmentsJob | undefined
}

const mapState = (state: State): SEDAttachmentSelector => ({
  savingAttachmentsJob: state.attachments.savingAttachmentsJob
})

const SEDAttachmentSender: React.FC<SEDAttachmentSenderProps> = ({
  attachmentsError, className, initialStatus = 'inprogress',
  onCancel, onFinished, onSaved, payload, sendAttachmentToSed
}: SEDAttachmentSenderProps): JSX.Element => {
  const [_status, setStatus] = useState<ProgressBarStatus>(initialStatus)
  const { savingAttachmentsJob }: SEDAttachmentSelector = useSelector<State, SEDAttachmentSelector>(mapState)
  const { t } = useTranslation()

  useEffect(() => {
    if (savingAttachmentsJob) {
      // all attachments are sent - conclude
      if (savingAttachmentsJob.remaining.length === 0) {
        if (!savingAttachmentsJob.saving) {
          /* istanbul ignore next */
          const summary = {
            total: savingAttachmentsJob.total.length,
            saved: savingAttachmentsJob.saved.length
          }
          if (!IS_TEST) {
            console.log('Concluding.' +
              ' Total (' + savingAttachmentsJob.total.length +
              ') saved (' + savingAttachmentsJob.saved.length + ') ' +
              ' saving (' + !!savingAttachmentsJob.saving +
              ') remaining (' + savingAttachmentsJob.remaining.length + ')')
          }
          onSaved(savingAttachmentsJob)
          setStatus('done')
          onFinished(summary)
          return
        }
        return
      // still are attachments to send,
      }

      // one attachment was just saved. Pick another one to save
      if (!savingAttachmentsJob.saving) {
        /* istanbul ignore next */
        if (!IS_TEST) {
          console.log('Picking one to save.' +
            ' Total (' + savingAttachmentsJob.total.length +
            ') saved (' + savingAttachmentsJob.saved.length + ') ' +
            ' saving (' + !!savingAttachmentsJob.saving +
            ') remaining (' + savingAttachmentsJob.remaining.length + ')')
        }
        onSaved(savingAttachmentsJob)
        const unsentAttachment: JoarkBrowserItem = _.first(savingAttachmentsJob.remaining)!
        const params: SEDAttachmentPayloadWithFile = {
          ...payload,
          journalpostId: unsentAttachment.journalpostId,
          dokumentInfoId: unsentAttachment.dokumentInfoId!,
          variantformat: unsentAttachment.variant!.variantformat!,
          filnavn: unsentAttachment.title.replaceAll(' ', '_') ?? 'fil-' + md5('' + new Date().getTime())
        }
        sendAttachmentToSed(params, unsentAttachment)
      } else {
        // one attachment will be saved now. Display as such.
        /* istanbul ignore next */
        if (!IS_TEST) {
          console.log('Saving.' +
            ' Total (' + savingAttachmentsJob.total.length +
            ') saved (' + savingAttachmentsJob.saved.length + ') ' +
            ' saving (' + !!savingAttachmentsJob.saving +
            ') remaining (' + savingAttachmentsJob.remaining.length + ')')
        }
      }
    }
  }, [onSaved, onFinished, payload, sendAttachmentToSed, savingAttachmentsJob])

  useEffect(() => {
    if (attachmentsError && _status !== 'error') {
      setStatus('error')
    }
  }, [attachmentsError, setStatus, _status])

  if (!savingAttachmentsJob) {
    return <div />
  }

  const current: number = (savingAttachmentsJob.saved.length + (savingAttachmentsJob.saving ? 1 : 0))
  const total: number = savingAttachmentsJob.total.length
  const percentage: number = (Math.floor((current * 100) / total))

  return (
    <SEDAttachmentSenderDiv
      data-testid='c-sedAttachmentSender__div-id'
      className={className}
    >
      <ProgressBar
        data-testid='c-sedAttachmentSender__progress-bar-id'
        now={percentage}
        status={_status}
      >
        <>
          {_status === 'inprogress' && t('message:loading-sending-XofY', {
            current: current,
            total: total
          })}
          {_status === 'done' && t('label:vedlegg-sendt')}
          {_status === 'error' && t('message:error-sending-attachments')}
        </>
      </ProgressBar>
      {_status === 'inprogress' && _.isFunction(onCancel) && (
        <>
          <HorizontalSeparatorDiv data-sise='0.35' />
          <Button
            variant='secondary'
            data-testid='c-sedAttachmentSender__cancel-button-id'
            onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
              e.preventDefault()
              e.stopPropagation()
              onCancel()
            }}
          >
            {t('el:button-cancel')}
          </Button>
        </>
      )}
    </SEDAttachmentSenderDiv>
  )
}

SEDAttachmentSender.propTypes = {
  attachmentsError: PT.bool,
  className: PT.string,
  initialStatus: PT.oneOf(['todo', 'inprogress', 'done', 'error']),
  onCancel: PT.func,
  onFinished: PT.func.isRequired,
  onSaved: PT.func.isRequired,
  payload: SEDAttachmentPayloadPropType.isRequired,
  sendAttachmentToSed: PT.func.isRequired
}

export default SEDAttachmentSender
