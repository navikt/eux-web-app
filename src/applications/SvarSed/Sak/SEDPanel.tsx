import { Close, Edit, Download, Send, Star } from '@navikt/ds-icons'
import { Button, Detail, Heading, Loader, Panel } from '@navikt/ds-react'
import { FlexDiv, HorizontalSeparatorDiv, PileCenterDiv, PileDiv, VerticalSeparatorDiv } from '@navikt/hoykontrast'
import { setCurrentEntry } from 'actions/localStorage'
import { editSed, getSedStatus, replyToSed, setReplySed } from 'actions/svarsed'
import { resetAllValidation } from 'actions/validation'
import { canEditSed, findSavedEntry, hasDraft, hasSentStatus } from 'applications/SvarSed/Sak/utils'
import { State } from 'declarations/reducers'
import { ReplySed } from 'declarations/sed'
import { LocalStorageEntry, Sak, Sed } from 'declarations/types'
import _ from 'lodash'
import { buttonLogger } from 'metrics/loggers'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAppDispatch, useAppSelector } from 'store'
import styled from 'styled-components'

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

interface SEDPanelProps {
  currentSak: Sak
  connectedSed: Sed
  changeMode: (mode: string, from: string, callback?: () => void) => void
}

const mapState = (state: State): any => ({
  entries: state.localStorage.svarsed.entries,
  editingSed: state.loading.editingSed,
  replyingToSed: state.loading.replyingToSed,
  replySed: state.svarsed.replySed,
  sedStatus: state.svarsed.sedStatus
})

const SEDPanel = ({
  currentSak,
  connectedSed,
  changeMode
}: SEDPanelProps) => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()

  const { entries, editingSed, replyingToSed, replySed, sedStatus }: any = useAppSelector(mapState)
  const [_replySedRequested, _setReplySedRequested] = useState<boolean>(false)
  const [_buttonClickedId, _setButtonClickedId] = useState<string | undefined>(undefined)
  const [_sedStatusRequested, _setSedStatusRequested] = useState<string |undefined>(undefined)

  /** if we have a reply sed, let's go to edit mode */
  useEffect(() => {
    if (!_.isEmpty(replySed) && _replySedRequested) {
      _setReplySedRequested(false)
      _setButtonClickedId('')
      dispatch(resetAllValidation())
      changeMode('B', 'forward')
    }
  }, [replySed])

  /** if we have received SEDS, and we have searched for saksnummer, add it as the currentSak */
  useEffect(() => {
    if (!_.isNil(_sedStatusRequested) && Object.prototype.hasOwnProperty.call(sedStatus, _sedStatusRequested)) {
      const entry: LocalStorageEntry<ReplySed> | undefined = findSavedEntry(_sedStatusRequested, entries)
      if (entry && !hasSentStatus(entry.id, sedStatus)) {
        dispatch(setCurrentEntry('svarsed', entry))
        dispatch(setReplySed(entry.content))
        _setReplySedRequested(true)
      }
      _setSedStatusRequested(undefined)
    }
  }, [_sedStatusRequested, sedStatus])

  /** if we have a saved entry, let's load it */
  useEffect(() => {
    if (!_.isNil(_sedStatusRequested) && Object.prototype.hasOwnProperty.call(sedStatus, _sedStatusRequested)) {
      const entry: LocalStorageEntry<ReplySed> | undefined = findSavedEntry(_sedStatusRequested, entries)
      if (entry && !hasSentStatus(entry.id, sedStatus)) {
        dispatch(setCurrentEntry('svarsed', entry))
        dispatch(setReplySed(entry.content))
        _setReplySedRequested(true)
      }
      _setSedStatusRequested(undefined)
    }
  }, [_sedStatusRequested, sedStatus])

  const loadDraft = (sakId: string, svarsedId: string) => {
    _setSedStatusRequested(svarsedId)
    dispatch(getSedStatus(sakId, svarsedId))
  }

  const onEditSedClick = (sedId: string, sedType: string, saksnummer: string, status: string) => {
    _setReplySedRequested(true)
    dispatch(editSed(sedId, sedType, saksnummer, status))
  }

  const onReplySedClick = (connectedSed: Sed, saksnummer: string, sakUrl: string) => {
    _setReplySedRequested(true)
    dispatch(replyToSed(connectedSed, saksnummer, sakUrl))
  }

  return (
    <MyPanel border>
      <FlexDiv>
        <IconDiv>
          {connectedSed.status === 'received' && <Download width='32' height='32' />}
          {connectedSed.status === 'sent' && <Send width='32' height='32' />}
          {connectedSed.status === 'new' && <Star width='32' height='32' />}
          {connectedSed.status === 'active' && <Edit width='32' height='32' />}
          {connectedSed.status === 'cancelled' && <Close width='32' height='32' />}
          <VerticalSeparatorDiv size='0.35' />
          <Detail>
            {t('app:status-received-' + connectedSed.status.toLowerCase())}
          </Detail>

          <Detail>
            {connectedSed.sistEndretDato}
          </Detail>
        </IconDiv>
        <HorizontalSeparatorDiv />
        <PileDiv>
          <Heading size='small'>
            {connectedSed.sedType} - {connectedSed.sedTittel}
          </Heading>
          <VerticalSeparatorDiv size='0.5' />
          <FlexDiv>
            {connectedSed.lenkeHvisForrigeSedMaaJournalfoeres && (
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
                <VerticalSeparatorDiv size='0.5' />
              </>
            )}
            {hasDraft(connectedSed, entries)
              ? (
                <Button
                  variant='secondary'
                  disabled={_sedStatusRequested === connectedSed.svarsedId || hasSentStatus(connectedSed.svarsedId, sedStatus)}
                  data-amplitude='svarsed.selection.loaddraft'
                  onClick={(e: any) => {
                    buttonLogger(e, {
                      type: connectedSed.svarsedType
                    })
                    _setButtonClickedId('draft-' + connectedSed.sedId)
                    loadDraft(currentSak.sakId, connectedSed.svarsedId)
                  }}
                >
                  <Edit />
                  <HorizontalSeparatorDiv size='0.35' />
                  {(_sedStatusRequested === connectedSed.svarsedId && _buttonClickedId === 'draft-' + connectedSed.sedId)
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
                )
              : (
                <>
                  {connectedSed.status === 'new' && canEditSed(connectedSed.sedType) && (
                    <>
                      <Button
                        variant='secondary'
                        disabled={editingSed}
                        data-amplitude='svarsed.selection.editsed'
                        onClick={(e: any) => {
                          buttonLogger(e, {
                            type: connectedSed.sedType
                          })
                          _setButtonClickedId('edit-' + connectedSed.sedId)
                          onEditSedClick(connectedSed.sedId, connectedSed.sedType, currentSak.sakId, connectedSed.status)
                        }}
                      >
                        {(editingSed && _buttonClickedId === 'edit-' + connectedSed.sedId)
                          ? (
                            <>
                              {t('message:loading-editing')}
                              <Loader />
                            </>
                            )
                          : t('label:edit-sed-x', {
                            x: connectedSed.sedType
                          })}
                      </Button>
                      <VerticalSeparatorDiv size='0.5' />
                    </>
                  )}
                  {connectedSed.svarsedType && (
                    <Button
                      variant='primary'
                      disabled={replyingToSed || connectedSed.lenkeHvisForrigeSedMaaJournalfoeres}
                      data-amplitude='svarsed.selection.replysed'
                      title={connectedSed.lenkeHvisForrigeSedMaaJournalfoeres ? t('message:warning-spørre-sed-not-journalført') : ''}
                      onClick={(e: any) => {
                        buttonLogger(e, {
                          type: connectedSed.svarsedType,
                          parenttype: connectedSed.sedType
                        })
                        _setButtonClickedId('reply-' + connectedSed.sedId)
                        onReplySedClick(connectedSed, currentSak.sakId, currentSak.sakUrl)
                      }}
                    >
                      {(replyingToSed && _buttonClickedId === 'reply-' + connectedSed.sedId)
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
                  )}
                </>
                )}
          </FlexDiv>
        </PileDiv>
      </FlexDiv>
    </MyPanel>
  )
}

export default SEDPanel
