import {Close, Edit, Download, Send, Star, Helptext, Attachment} from '@navikt/ds-icons'
import {Button, Detail, Heading, HelpText, Loader, Panel} from '@navikt/ds-react'
import { FlexDiv, FlexBaseDiv, HorizontalSeparatorDiv, PileCenterDiv, PileDiv, VerticalSeparatorDiv } from '@navikt/hoykontrast'
import { setCurrentEntry } from 'actions/localStorage'
import {
  clarifyingSed,
  deleteSed,
  editSed,
  getSedStatus,
  invalidatingSed,
  rejectingSed,
  remindSed,
  replyToSed,
  setReplySed
} from 'actions/svarsed'
import PreviewSED from 'applications/SvarSed/PreviewSED/PreviewSED'
import { findSavedEntry, hasDraftFor, hasSentStatus } from 'applications/SvarSed/Sak/utils'
import { State } from 'declarations/reducers'
import { ReplySed } from 'declarations/sed'
import {LocalStorageEntry, Sak, Sed, SedAction} from 'declarations/types'
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
    color: var(--navds-color-text-primary) !important;
    background-color: var(--navds-semantic-color-interaction-primary-hover-subtle) !important;
  }
`

const IconDiv = styled(PileCenterDiv)`
  align-items: center;
  margin-left: -1rem;
  margin-top: -1rem;
  margin-bottom: -1rem;
  justify-content: center;
  background-color: var(--navds-semantic-color-component-background-alternate);
  padding: 1rem;
`
const AttachmentButton = styled(Button)`
  padding:0
`

const AttachmentIcon = styled(Attachment)`
  position: relative;
  top: 3px;
`

const MyHelpText = styled(HelpText)`
  position: relative;
  top: 5px;
  left: 5px;
  & svg {
    width: 0.8em
  }
`

interface SEDPanelSelector {
  entries: any
  replySed: ReplySed | null | undefined
  sedStatus: {[x: string] : string | null}
  deletedSed: boolean | null | undefined
  featureToggles: FeatureToggles | null | undefined
}

interface SEDPanelProps {
  currentSak: Sak
  sed: Sed
}

const mapState = (state: State): SEDPanelSelector => ({
  entries: state.localStorage.svarsed.entries,
  replySed: state.svarsed.replySed,
  sedStatus: state.svarsed.sedStatus,
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

  const { entries, replySed, sedStatus, deletedSed, featureToggles } = useAppSelector(mapState)

  const [_loadingDraftSed, _setLoadingDraftSed] = useState<boolean>(false)
  const [_editingSed, _setEditingSed] = useState<boolean>(false)
  const [_deletingSed, _setDeletingSed] = useState<boolean>(false)
  const [_updatingSed, _setUpdatingSed] = useState<boolean>(false)
  const [_replyingToSed, _setReplyingToSed] = useState<boolean>(false)
  const [_invalidatingSed, _setInvalidatingSed] = useState<boolean>(false)
  const [_rejectingSed, _setRejectingSed] = useState<boolean>(false)
  const [_clarifyingSed, _setClarifyingSed] = useState<boolean>(false)
  const [_reminderSed, _setReminderSed] = useState<boolean>(false)
  const [_sedStatusRequested, _setSedStatusRequested] = useState<string |undefined>(undefined)
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

  /** if we have received an OK from update on SED Status, and it is on local storage, load it  */
  useEffect(() => {
    if (!_.isUndefined(_sedStatusRequested) && Object.prototype.hasOwnProperty.call(sedStatus, _sedStatusRequested)) {
      const entry: LocalStorageEntry<ReplySed> | undefined = findSavedEntry(_sedStatusRequested, entries)
      if (entry && !hasSentStatus(entry.id, sedStatus)) {
        dispatch(setCurrentEntry('svarsed', entry))
        dispatch(setReplySed(entry.content))
      }
      _setSedStatusRequested(undefined)
    }
  }, [_sedStatusRequested, sedStatus])

  useEffect(() => {
    if(deletedSed && waitingForOperation){
      _setDeletingSed(false)
    }
  }, [deletedSed])

  /** before loading the SED, let's check if the status is OK */
  const loadDraft = (sakId: string, sedId: string) => {
    _setSedStatusRequested(sedId)
    _setLoadingDraftSed(true)
    dispatch(getSedStatus(sakId, sedId))
  }

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
  const showDraftForSvarsedIdButton = hasDraftFor(sed, entries, 'svarsedId')
  const showDraftForSedIdButton = hasDraftFor(sed, entries, 'sedId')
  const showEditButton = !showDraftForSedIdButton && (sed.sedHandlinger && sed.sedHandlinger?.indexOf('Update') >= 0) && sed.status === 'new' && ALLOWED_SED_EDIT_AND_UPDATE.includes(sed.sedType)
  const showUpdateButton = !showDraftForSedIdButton && (sed.sedHandlinger && sed.sedHandlinger?.indexOf('Update') >= 0) && (sed.status === 'sent' || sed.status === 'active') && ALLOWED_SED_EDIT_AND_UPDATE.includes(sed.sedType)
  const showDeleteButton = !showDraftForSedIdButton && (sed.sedHandlinger && sed.sedHandlinger?.indexOf('Delete') >= 0) && sed.status === 'new' && ALLOWED_SED_HANDLINGER.includes("Delete")
  const showReplyToSedButton = !showDraftForSvarsedIdButton && !!sed.svarsedType && sed.svarsedType !== "X010" && (sed.sedHandlinger && sed.sedHandlinger?.indexOf(sed.svarsedType as SedAction) >= 0) && ALLOWED_SED_HANDLINGER.includes(sed.svarsedType)
  const showInvalidateButton = !showDraftForSedIdButton && sed.sedHandlinger && sed.sedHandlinger?.indexOf('X008') >= 0  && ALLOWED_SED_HANDLINGER.includes("X008")
  const showRemindButton = !showDraftForSedIdButton && !hasIkkeJournalfoerteSed && sed.sedHandlinger && sed.sedHandlinger?.indexOf('X010') >= 0 && sed.status === 'received'  && ALLOWED_SED_HANDLINGER.includes("X010")
  const showRejectButton = !showDraftForSedIdButton && sed.sedHandlinger && sed.sedHandlinger?.indexOf('X011') >= 0  && ALLOWED_SED_HANDLINGER.includes("X011")
  const showClarifyButton = !showDraftForSedIdButton && sed.sedHandlinger && sed.sedHandlinger?.indexOf('X012') >= 0  && ALLOWED_SED_HANDLINGER.includes("X012")

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
          {sed.status === 'received' && <Download color='var(--navds-button-color-primary-background)' width='32' height='32' />}
          {sed.status === 'sent' && <Send color='green' width='32' height='32' />}
          {sed.status === 'new' && <Star color='orange' width='32' height='32' />}
          {sed.status === 'active' && <Edit width='32' height='32' />}
          {sed.status === 'cancelled' && <Close color='red' width='32' height='32' />}
          {!sed.status && <Helptext color='black' width='32' height='32' />}
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
            />
            {sed.vedlegg && sed.vedlegg.length > 0 && (
              <>
                <AttachmentButton variant="tertiary" onClick={openAttachmentModal}>
                  <AttachmentIcon/><span>({sed?.vedlegg?.length})</span>
                </AttachmentButton>
              </>
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
            {!!sed.svarsedId && showDraftForSvarsedIdButton && (
              <Button
                variant='secondary'
                disabled={_sedStatusRequested === sed.svarsedId || hasSentStatus(sed.svarsedId, sedStatus)}
                data-amplitude='svarsed.selection.loaddraft'
                onClick={(e: any) => {
                  buttonLogger(e, {
                    type: sed.svarsedType
                  })
                  loadDraft(currentSak.sakId, sed.svarsedId!)
                }}
              >
                <Edit />
                {(_sedStatusRequested === sed.svarsedId)
                  ? (
                    <>
                      {t('message:loading-checking-sed-status')}
                      <Loader />
                    </>
                    )
                  : (hasSentStatus(sed.svarsedId, sedStatus)
                      ? t('label:sed-already-sent', { sed: sed.svarsedType })
                      : t('label:gå-til-draft'))}
              </Button>
            )}
            {showDraftForSedIdButton && (
              <Button
                variant='secondary'
                disabled={_sedStatusRequested === sed.sedId || hasSentStatus(sed.sedId, sedStatus)}
                data-amplitude='svarsed.selection.loaddraft'
                onClick={(e: any) => {
                  buttonLogger(e, {
                    type: sed.sedType
                  })
                  loadDraft(currentSak.sakId, sed.sedId!)
                }}
              >
                <Edit />
                {(_sedStatusRequested === sed.sedId)
                  ? (
                    <>
                      {t('message:loading-checking-sed-status')}
                      <Loader />
                    </>
                    )
                  : (hasSentStatus(sed.sedId, sedStatus)
                      ? t('label:sed-already-sent', { sed: sed.sedType })
                      : t('label:gå-til-draft'))}
              </Button>
            )}
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
