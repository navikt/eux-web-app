import {XMarkIcon, PencilIcon, DownloadIcon, PaperplaneIcon, StarIcon, QuestionmarkDiamondIcon, PaperclipIcon} from '@navikt/aksel-icons'
import {Button, Detail, Heading, HelpText, Loader, Panel} from '@navikt/ds-react'
import { FlexDiv, FlexBaseDiv, HorizontalSeparatorDiv, PileCenterDiv, PileDiv, VerticalSeparatorDiv } from '@navikt/hoykontrast'
import {
  clarifyingSed,
  deleteSed,
  editSed,
  invalidatingSed,
  rejectingSed,
  remindSed,
  replyToSed,
} from 'actions/svarsed'
import PreviewSED from 'applications/SvarSed/PreviewSED/PreviewSED'
import { State } from 'declarations/reducers'
import { ReplySed } from 'declarations/sed'
import {Sak, Sed, SedAction} from 'declarations/types'
import _ from 'lodash'
import { buttonLogger } from 'metrics/loggers'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from 'store'
import styled from 'styled-components'
import {getAllowed} from "utils/allowedFeatures";
import {FeatureToggles} from "../../../declarations/app";
import Modal from "../../../components/Modal/Modal";
import {ModalContent} from "../../../declarations/components";
import AttachmentsFromRinaTable from "../../Vedlegg/Attachments/AttachmentsFromRinaTable";

const MyPanel = styled(Panel)`
  transition: all 0.15s ease-in-out;
  &:hover {
    color: var(--a-text-default) !important;
    background-color: var(--a-surface-action-subtle-hover) !important;
  }
`

const IconDiv = styled(PileCenterDiv)`
  align-items: center;
  margin-left: -1rem;
  margin-top: -1rem;
  margin-bottom: -1rem;
  justify-content: center;
  background-color: var(--a-surface-subtle);
  padding: 1rem;
`
const AttachmentButton = styled(Button)`
  padding:0
`

const AttachmentIcon = styled(PaperclipIcon)`
  position: relative;
  top: 3px;
`

const AttachmentDiv = styled.div`
  position: relative;
  top: -5px;
`

const MyHelpText = styled(HelpText)`
  & svg {
    width: 0.7em
  }
`

interface SEDPanelSelector {
  replySed: ReplySed | null | undefined
  deletedSed: boolean | null | undefined
  featureToggles: FeatureToggles | null | undefined
}

interface SEDPanelProps {
  currentSak: Sak
  sed: Sed
}

const mapState = (state: State): SEDPanelSelector => ({
  replySed: state.svarsed.replySed,
  deletedSed: state.svarsed.deletedSed,
  featureToggles: state.app.featureToggles
})

const SEDPanel = ({
  currentSak,
  sed
}: SEDPanelProps) => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const { replySed, deletedSed, featureToggles } = useAppSelector(mapState)

  const [_loadingDraftSed, _setLoadingDraftSed] = useState<boolean>(false)
  const [_editingSed, _setEditingSed] = useState<boolean>(false)
  const [_deletingSed, _setDeletingSed] = useState<boolean>(false)
  const [_updatingSed, _setUpdatingSed] = useState<boolean>(false)
  const [_replyingToSed, _setReplyingToSed] = useState<boolean>(false)
  const [_invalidatingSed, _setInvalidatingSed] = useState<boolean>(false)
  const [_rejectingSed, _setRejectingSed] = useState<boolean>(false)
  const [_clarifyingSed, _setClarifyingSed] = useState<boolean>(false)
  const [_reminderSed, _setReminderSed] = useState<boolean>(false)
  const [attachmentModal, setAttachmentModal] = useState<ModalContent | undefined>(undefined)

  const ALLOWED_SED_HANDLINGER = getAllowed("ALLOWED_SED_HANDLINGER", !!featureToggles?.featureAdmin)
  const ALLOWED_SED_EDIT_AND_UPDATE = getAllowed("ALLOWED_SED_EDIT_AND_UPDATE", !!featureToggles?.featureAdmin)

  const waitingForOperation = _loadingDraftSed || _editingSed || _updatingSed || _replyingToSed || _invalidatingSed || _rejectingSed || _clarifyingSed || _reminderSed || _deletingSed

  /** if we have a reply sed, after clicking to replyToSed, let's go to edit mode */
  useEffect(() => {
    if (!_.isEmpty(replySed) && !_.isEmpty(replySed!.sak) && waitingForOperation) {
      _setLoadingDraftSed(false)
      _setReplyingToSed(false)
      _setUpdatingSed(false)
      _setEditingSed(false)
      _setInvalidatingSed(false)
      _setRejectingSed(false)
      _setClarifyingSed(false)
      _setReminderSed(false)

      navigate({
        pathname: '/svarsed/edit/sak/' + replySed!.sak!.sakId + '/sed/' + (replySed!.sed?.sedId ?? 'new'),
        search: window.location.search
      })
    }
  }, [replySed])

  useEffect(() => {
    if(deletedSed && waitingForOperation){
      _setDeletingSed(false)
    }
  }, [deletedSed])


  const onEditingSedClick = (sed: Sed, sak: Sak) => {
    _setEditingSed(true)
    dispatch(editSed(sed, sak))
  }

  const onUpdatingSedClick = (sed: Sed, sak: Sak) => {
    _setUpdatingSed(true)
    dispatch(editSed(sed, sak))
  }
  const onDeleteSedClick = (sakId: string, sedId: string) => {
    _setDeletingSed(true)
    dispatch(deleteSed(sakId, sedId))
  }

  const onInvalidatingSedClick = (sed: Sed, sak: Sak) => {
    _setInvalidatingSed(true)
    dispatch(invalidatingSed(sed, sak))
  }

  const onRejectingSedClick = (sed: Sed, sak: Sak) => {
    _setRejectingSed(true)
    dispatch(rejectingSed(sed, sak))
  }

  const onClarifyingSedClick = (sed: Sed, sak: Sak) => {
    _setClarifyingSed(true)
    dispatch(clarifyingSed(sed, sak))
  }

  const onRemindSedClick = (sed: Sed, sak: Sak) => {
    _setReminderSed(true)
    dispatch(remindSed(sed, sak))
  }

  const onReplySedClick = (sed: Sed, sak: Sak) => {
    _setReplyingToSed(true)
    dispatch(replyToSed(sed, sak))
  }

  const openAttachmentModal = () => {
    setAttachmentModal({
      closeButton: true,
      modalContent: (
        <div style={{ cursor: 'pointer' }}>
          <AttachmentsFromRinaTable sedId={sed.sedId} rinaSakId={currentSak.sakId} attachmentsFromRina={sed.vedlegg} showHeader={true} hideActions={true}/>
        </div>
      )
    })
  }

  const hasIkkeJournalfoerteSed = !!currentSak.ikkeJournalfoerteSed?.length || currentSak.ikkeJournalfoerteSedListFailed
  const showEditButton = (sed.sedHandlinger && sed.sedHandlinger?.indexOf('Update') >= 0) && sed.status === 'new' && ALLOWED_SED_EDIT_AND_UPDATE.includes(sed.sedType)
  const showUpdateButton = (sed.sedHandlinger && sed.sedHandlinger?.indexOf('Update') >= 0) && (sed.status === 'sent' || sed.status === 'active') && ALLOWED_SED_EDIT_AND_UPDATE.includes(sed.sedType)
  const showDeleteButton = (sed.sedHandlinger && sed.sedHandlinger?.indexOf('Delete') >= 0) && sed.status === 'new' && ALLOWED_SED_HANDLINGER.includes("Delete")
  const showReplyToSedButton = !!sed.svarsedType && sed.svarsedType !== "X010" && (sed.sedHandlinger && sed.sedHandlinger?.indexOf(sed.svarsedType as SedAction) >= 0) && ALLOWED_SED_HANDLINGER.includes(sed.svarsedType)
  const showInvalidateButton = sed.sedHandlinger && sed.sedHandlinger?.indexOf('X008') >= 0  && ALLOWED_SED_HANDLINGER.includes("X008")
  const showRemindButton = !hasIkkeJournalfoerteSed && sed.sedHandlinger && sed.sedHandlinger?.indexOf('X010') >= 0 && sed.status === 'received'  && ALLOWED_SED_HANDLINGER.includes("X010")
  const showRejectButton = sed.sedHandlinger && sed.sedHandlinger?.indexOf('X011') >= 0  && ALLOWED_SED_HANDLINGER.includes("X011")
  const showClarifyButton = sed.sedHandlinger && sed.sedHandlinger?.indexOf('X012') >= 0  && ALLOWED_SED_HANDLINGER.includes("X012")

  const hasSedHandlinger = sed.sedHandlinger && sed.sedHandlinger.length > 0
  const sedHandlingerRINA = sed.sedHandlinger?.filter((h) => !ALLOWED_SED_HANDLINGER.includes(h))

  return (
    <MyPanel border>
      <Modal
        open={!_.isNil(attachmentModal)}
        modal={attachmentModal}
        onModalClose={() => setAttachmentModal(undefined)}
      />
      <FlexDiv>
        <IconDiv>
          {sed.status === 'received' && <DownloadIcon color='var(--a-surface-action)' width='32' height='32' />}
          {sed.status === 'sent' && <PaperplaneIcon color='green' width='32' height='32' />}
          {sed.status === 'new' && <StarIcon color='orange' width='32' height='32' />}
          {sed.status === 'active' && <PencilIcon width='32' height='32' />}
          {sed.status === 'cancelled' && <XMarkIcon color='red' width='32' height='32' />}
          {!sed.status && <QuestionmarkDiamondIcon color='black' width='32' height='32' />}
          <VerticalSeparatorDiv size='0.35' />
          <Detail>
            {t('app:status-received-' + (sed.status?.toLowerCase() ?? 'unknown'))}
          </Detail>
          <Detail>
            {sed.sistEndretDato}
          </Detail>
        </IconDiv>
        <HorizontalSeparatorDiv />
        <PileDiv>
          <FlexBaseDiv>
            <Heading size='small'>
              {sed.sedType} - {sed.sedTittel}
            </Heading>
            <PreviewSED
              short
              size='small'
              rinaSakId={currentSak.sakId}
              sedId={sed.sedId}
              disabled={!hasSedHandlinger}
            />
            {sed.vedlegg && sed.vedlegg.length > 0 && (
              <AttachmentDiv>
                <AttachmentButton variant="tertiary" onClick={openAttachmentModal} disabled={!hasSedHandlinger}>
                  <AttachmentIcon/><span>({sed?.vedlegg?.length})</span>
                </AttachmentButton>
              </AttachmentDiv>
            )}
            {sedHandlingerRINA && sedHandlingerRINA.length > 0 &&
              <MyHelpText title="Handlinger tilgjengelig i RINA" placement={"right"}>
                <Heading size="xsmall">Handlinger tilgjengelig i RINA</Heading>
                <ul>
                  {sedHandlingerRINA.map((sedhandling) => {
                    return (
                      <li>{t('sedhandlinger:' + sedhandling, t('sedhandlinger:besvar-med', {SED: sedhandling}))}</li>
                    )
                  })}
                </ul>
              </MyHelpText>
            }
          </FlexBaseDiv>
          <VerticalSeparatorDiv size='0.5' />
          <FlexDiv>
            {showEditButton && (
              <>
                <Button
                  variant='secondary'
                  disabled={_editingSed}
                  data-amplitude='svarsed.selection.editsed'
                  onClick={(e: any) => {
                    buttonLogger(e, {
                      type: sed.sedType
                    })
                    onEditingSedClick(sed, currentSak)
                  }}
                >
                  {_editingSed
                    ? (
                      <>
                        {t('message:loading-editing')}
                        <Loader />
                      </>
                      )
                    : t('label:edit-sed')}
                </Button>
                <HorizontalSeparatorDiv size='0.5' />
              </>
            )}
            {showUpdateButton && (
              <>
                <Button
                  variant='secondary'
                  disabled={_updatingSed}
                  data-amplitude='svarsed.selection.updatesed'
                  onClick={(e: any) => {
                    buttonLogger(e, {
                      type: sed.sedType
                    })
                    onUpdatingSedClick(sed, currentSak)
                  }}
                >
                  {_updatingSed
                    ? (
                      <>
                        {t('message:loading-updating')}
                        <Loader />
                      </>
                      )
                    : t('label:oppdater-sed')}
                </Button>
                <HorizontalSeparatorDiv size='0.5' />
              </>
            )}
            {showDeleteButton && (
              <>
                <Button
                  variant='secondary'
                  disabled={_deletingSed}
                  data-amplitude='svarsed.selection.deletesed'
                  onClick={(e: any) => {
                    buttonLogger(e, {
                      type: sed.sedType
                    })
                    onDeleteSedClick(currentSak.sakId, sed.sedId)
                  }}
                >
                  {_deletingSed
                    ? (
                      <>
                        {t('message:loading-deleting')}
                        <Loader />
                      </>
                    )
                    : t('label:slett-sed')}
                </Button>
                <HorizontalSeparatorDiv size='0.5' />
              </>
            )}
            {showInvalidateButton && (
              <>
                <Button
                  variant='secondary'
                  disabled={_invalidatingSed}
                  data-amplitude='svarsed.selection.invalidatesed'
                  onClick={(e: any) => {
                    buttonLogger(e, {
                      type: sed.sedType
                    })
                    onInvalidatingSedClick(sed, currentSak)
                  }}
                >
                  {_invalidatingSed
                    ? (
                      <>
                        {t('message:loading-invalidating')}
                        <Loader />
                      </>
                      )
                    : t('label:invalidate-sed')}
                </Button>
                <HorizontalSeparatorDiv size='0.5' />
              </>
            )}
            {showRejectButton && (
              <>
                <Button
                  variant='secondary'
                  disabled={_rejectingSed}
                  data-amplitude='svarsed.selection.rejectsed'
                  onClick={(e: any) => {
                    buttonLogger(e, {
                      type: sed.sedType
                    })
                    onRejectingSedClick(sed, currentSak)
                  }}
                >
                  {_rejectingSed
                    ? (
                      <>
                        {t('message:loading-rejecting')}
                        <Loader />
                      </>
                      )
                    : t('label:reject-sed')}
                </Button>
                <HorizontalSeparatorDiv size='0.5' />
              </>
            )}
            {showClarifyButton && (
              <>
                <Button
                  variant='secondary'
                  disabled={_clarifyingSed}
                  data-amplitude='svarsed.selection.clarifysed'
                  onClick={(e: any) => {
                    buttonLogger(e, {
                      type: sed.sedType
                    })
                    onClarifyingSedClick(sed, currentSak)
                  }}
                >
                  {_clarifyingSed
                    ? (
                      <>
                        {t('message:loading-clarifying')}
                        <Loader />
                      </>
                      )
                    : t('label:klarkjør-sed')}
                </Button>
                <HorizontalSeparatorDiv size='0.5' />
              </>
            )}
            {showRemindButton && (
              <>
                <Button
                  variant='primary'
                  disabled={_reminderSed}
                  data-amplitude='svarsed.selection.remindsed'
                  onClick={(e: any) => {
                    buttonLogger(e, {
                      type: sed.sedType
                    })
                    onRemindSedClick(sed, currentSak)
                  }}
                >
                  {_reminderSed
                    ? (
                      <>
                        {t('message:loading-remind')}
                        <Loader />
                      </>
                      )
                    : t('label:svar-på-påminnelse')}
                </Button>
                <HorizontalSeparatorDiv size='0.5' />
              </>
            )}
            {showReplyToSedButton && (
              <>
                <Button
                  variant='primary'
                  disabled={_replyingToSed || !!currentSak.ikkeJournalfoerteSed?.length || currentSak.ikkeJournalfoerteSedListFailed}
                  data-amplitude='svarsed.selection.replysed'
                  title={!!currentSak.ikkeJournalfoerteSed?.length ? t('message:warning-spørre-sed-not-journalført') : ''}
                  onClick={(e: any) => {
                    buttonLogger(e, {
                      type: sed.svarsedType,
                      parenttype: sed.sedType
                    })
                    onReplySedClick(sed, currentSak)
                  }}
                >
                  {_replyingToSed
                    ? (
                      <>
                        {t('message:loading-replying')}
                        <Loader />
                      </>
                      )
                    : t('label:besvar-med', {
                      sedtype: sed.svarsedType
                    })}
                </Button>
                <HorizontalSeparatorDiv size='0.5' />
              </>
            )}
          </FlexDiv>
        </PileDiv>
      </FlexDiv>
    </MyPanel>
  )
}

export default SEDPanel
