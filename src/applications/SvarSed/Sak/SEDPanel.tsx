import { Close, Edit, Download, Send, Star, Helptext } from '@navikt/ds-icons'
import { Button, Detail, Heading, Loader, Panel } from '@navikt/ds-react'
import { FlexDiv, FlexBaseDiv, HorizontalSeparatorDiv, PileCenterDiv, PileDiv, VerticalSeparatorDiv } from '@navikt/hoykontrast'
import { setCurrentEntry } from 'actions/localStorage'
import {
  clarifyingSed,
  editSed,
  getSedStatus,
  invalidatingSed,
  rejectingSed,
  remindSed,
  replyToSed,
  setReplySed
} from 'actions/svarsed'
import PreviewSED from 'applications/SvarSed/PreviewSED/PreviewSED'
import { findSavedEntry, hasDraft, hasSentStatus } from 'applications/SvarSed/Sak/utils'
import { State } from 'declarations/reducers'
import { ReplySed } from 'declarations/sed'
import { LocalStorageEntry, Sak, Sed, SedAction } from 'declarations/types'
import _ from 'lodash'
import { buttonLogger } from 'metrics/loggers'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from 'store'
import styled from 'styled-components'
import { isPreviewableSed } from 'utils/sed'

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

interface SEDPanelSelector {
  entries: any
  replySed: ReplySed | null | undefined
  sedStatus: {[x: string] : string | null}
}

interface SEDPanelProps {
  currentSak: Sak
  connectedSed: Sed
}

const mapState = (state: State): SEDPanelSelector => ({
  entries: state.localStorage.svarsed.entries,
  replySed: state.svarsed.replySed,
  sedStatus: state.svarsed.sedStatus
})

const SEDPanel = ({
  currentSak,
  connectedSed
}: SEDPanelProps) => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const { entries, replySed, sedStatus } = useAppSelector(mapState)

  const [_editingSed, _setEditingSed] = useState<boolean>(false)
  const [_updatingSed, _setUpdatingSed] = useState<boolean>(false)
  const [_replyingToSed, _setReplyingToSed] = useState<boolean>(false)
  const [_invalidatingSed, _setInvalidatingSed] = useState<boolean>(false)
  const [_rejectingSed, _setRejectingSed] = useState<boolean>(false)
  const [_clarifyingSed, _setClarifyingSed] = useState<boolean>(false)
  const [_reminderSed, _setReminderSed] = useState<boolean>(false)
  const [_sedStatusRequested, _setSedStatusRequested] = useState<string |undefined>(undefined)

  const waitingForOperation = _editingSed || _updatingSed || _replyingToSed || _invalidatingSed || _rejectingSed || _clarifyingSed || _reminderSed

  /** if we have a reply sed, after clicking to replyToSed, let's go to edit mode */
  useEffect(() => {
    if (!_.isEmpty(replySed) && !_.isEmpty(replySed!.sak) && waitingForOperation) {
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

  /** before loading the SED, let's check if the status is OK */
  const loadDraft = (sakId: string, svarsedId: string) => {
    _setSedStatusRequested(svarsedId)
    dispatch(getSedStatus(sakId, svarsedId))
  }

  const onEditingSedClick = (connectedSed: Sed, sak: Sak) => {
    _setEditingSed(true)
    dispatch(editSed(connectedSed, sak))
  }

  const onUpdatingSedClick = (connectedSed: Sed, sak: Sak) => {
    _setUpdatingSed(true)
    dispatch(editSed(connectedSed, sak))
  }

  const onInvalidatingSedClick = (connectedSed: Sed, sak: Sak) => {
    _setInvalidatingSed(true)
    dispatch(invalidatingSed(connectedSed, sak))
  }

  const onRejectingSedClick = (connectedSed: Sed, sak: Sak) => {
    _setRejectingSed(true)
    dispatch(rejectingSed(connectedSed, sak))
  }

  const onClarifyingSedClick = (connectedSed: Sed, sak: Sak) => {
    _setClarifyingSed(true)
    dispatch(clarifyingSed(connectedSed, sak))
  }

  const onRemindSedClick = (connectedSed: Sed, sak: Sak) => {
    _setReminderSed(true)
    dispatch(remindSed(connectedSed, sak))
  }

  const onReplySedClick = (connectedSed: Sed, sak: Sak) => {
    _setReplyingToSed(true)
    dispatch(replyToSed(connectedSed, sak))
  }

  const showJournalforingButton = connectedSed.lenkeHvisForrigeSedMaaJournalfoeres
  const showDraftButton = hasDraft(connectedSed, entries)
  const showEditButton = !showDraftButton && (connectedSed.sedHandlinger.indexOf('Update') >= 0) && connectedSed.status === 'new'
  const showUpdateButton = !showDraftButton && (connectedSed.sedHandlinger.indexOf('Update') >= 0) && (connectedSed.status === 'sent' || connectedSed.status === 'active')
  const showReplyToSedButton = !showDraftButton && !!connectedSed.svarsedType && (connectedSed.sedHandlinger.indexOf(connectedSed.svarsedType as SedAction) >= 0)
  const showInvalidateButton = !showDraftButton && connectedSed.sedHandlinger.indexOf('X008') >= 0
  const showRemindButton = !showDraftButton && !showJournalforingButton && connectedSed.sedHandlinger.indexOf('X010') >= 0 && connectedSed.status === 'received'
  const showRejectButton = !showDraftButton && connectedSed.sedHandlinger.indexOf('X011') >= 0
  const showClarifyButton = !showDraftButton && connectedSed.sedHandlinger.indexOf('X012') >= 0

  return (
    <MyPanel border>
      <FlexDiv>
        <IconDiv>
          {connectedSed.status === 'received' && <Download color='var(--navds-button-color-primary-background)' width='32' height='32' />}
          {connectedSed.status === 'sent' && <Send color='green' width='32' height='32' />}
          {connectedSed.status === 'new' && <Star color='orange' width='32' height='32' />}
          {connectedSed.status === 'active' && <Edit width='32' height='32' />}
          {connectedSed.status === 'cancelled' && <Close color='red' width='32' height='32' />}
          {!connectedSed.status && <Helptext color='black' width='32' height='32' />}
          <VerticalSeparatorDiv size='0.35' />
          <Detail>
            {t('app:status-received-' + (connectedSed.status?.toLowerCase() ?? 'unknown'))}
          </Detail>
          <Detail>
            {connectedSed.sistEndretDato}
          </Detail>
        </IconDiv>
        <HorizontalSeparatorDiv />
        <PileDiv>
          <FlexBaseDiv>
            <Heading size='small'>
              {connectedSed.sedType} - {connectedSed.sedTittel}
            </Heading>
            {isPreviewableSed(connectedSed.sedType) && (
              <PreviewSED
                short
                size='small'
                rinaSakId={currentSak.sakId}
                sedId={connectedSed.sedId}
              />
            )}
          </FlexBaseDiv>
          <VerticalSeparatorDiv size='0.5' />
          <FlexDiv>
            {showJournalforingButton && (
              <>
                <Button
                  variant='secondary'
                  data-amplitude='svarsed.selection.journalforing'
                  onClick={(e: any) => {
                    buttonLogger(e, {
                      type: connectedSed.sedType
                    })
                    window.open(connectedSed.lenkeHvisForrigeSedMaaJournalfoeres, 'rina')
                  }}
                >
                  {t('label:journalforing', {
                    sedtype: connectedSed.sedType
                  })}
                </Button>
                <HorizontalSeparatorDiv size='0.5' />
              </>
            )}
            {!!connectedSed.svarsedId && showDraftButton && (
              <Button
                variant='secondary'
                disabled={_sedStatusRequested === connectedSed.svarsedId || hasSentStatus(connectedSed.svarsedId, sedStatus)}
                data-amplitude='svarsed.selection.loaddraft'
                onClick={(e: any) => {
                  buttonLogger(e, {
                    type: connectedSed.svarsedType
                  })
                  loadDraft(currentSak.sakId, connectedSed.svarsedId!)
                }}
              >
                <Edit />
                {(_sedStatusRequested === connectedSed.svarsedId)
                  ? (
                    <>
                      {t('message:loading-checking-sed-status')}
                      <Loader />
                    </>
                    )
                  : (hasSentStatus(connectedSed.svarsedId, sedStatus)
                      ? t('label:sed-already-sent', { sed: connectedSed.svarsedType })
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
                      type: connectedSed.sedType
                    })
                    onEditingSedClick(connectedSed, currentSak)
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
                      type: connectedSed.sedType
                    })
                    onUpdatingSedClick(connectedSed, currentSak)
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
            {showInvalidateButton && (
              <>
                <Button
                  variant='secondary'
                  disabled={_invalidatingSed}
                  data-amplitude='svarsed.selection.invalidatesed'
                  onClick={(e: any) => {
                    buttonLogger(e, {
                      type: connectedSed.sedType
                    })
                    onInvalidatingSedClick(connectedSed, currentSak)
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
                      type: connectedSed.sedType
                    })
                    onRejectingSedClick(connectedSed, currentSak)
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
                      type: connectedSed.sedType
                    })
                    onClarifyingSedClick(connectedSed, currentSak)
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
                  variant='secondary'
                  disabled={_reminderSed}
                  data-amplitude='svarsed.selection.remindsed'
                  onClick={(e: any) => {
                    buttonLogger(e, {
                      type: connectedSed.sedType
                    })
                    onRemindSedClick(connectedSed, currentSak)
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
                  disabled={_replyingToSed || !!connectedSed.lenkeHvisForrigeSedMaaJournalfoeres}
                  data-amplitude='svarsed.selection.replysed'
                  title={connectedSed.lenkeHvisForrigeSedMaaJournalfoeres ? t('message:warning-spørre-sed-not-journalført') : ''}
                  onClick={(e: any) => {
                    buttonLogger(e, {
                      type: connectedSed.svarsedType,
                      parenttype: connectedSed.sedType
                    })
                    onReplySedClick(connectedSed, currentSak)
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
                      sedtype: connectedSed.svarsedType
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
