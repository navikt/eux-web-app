import { setCurrentEntry } from 'actions/localStorage'
import * as localStorageActions from 'actions/localStorage'
import { getSedStatus } from 'actions/svarsed'
import AddRemovePanel from 'components/AddRemovePanel/AddRemovePanel'
import { ChangeModeFunction } from 'components/SlidePage/SlidePage'
import { FlexEtikett } from 'components/StyledComponents'
import WaitingPanel from 'components/WaitingPanel/WaitingPanel'
import { ReplyPdu1 } from 'declarations/pd'
import { State } from 'declarations/reducers'
import { ReplySed } from 'declarations/sed'
import { LocalStorageEntry } from 'declarations/types'
import useAddRemove from 'hooks/useAddRemove'
import _ from 'lodash'
import { buttonLogger, standardLogger } from 'metrics/loggers'
import { Normaltekst, UndertekstBold } from 'nav-frontend-typografi'
import {
  FlexBaseSpacedDiv,
  FlexCenterSpacedDiv,
  FlexDiv,
  HighContrastFlatknapp,
  HighContrastPanel,
  HorizontalSeparatorDiv,
  PileDiv,
  VerticalSeparatorDiv
} from 'nav-hoykontrast'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'
import { LocalStorageNamespaces } from 'reducers/localStorage'

const LoadSaveDiv = styled(FlexDiv)`
  width: 100%;
  min-width: 21rem;
  flex-direction: column;
`

interface LoadSaveProps {
  changeMode: ChangeModeFunction
  storageKey: string
  namespace: LocalStorageNamespaces
  setReplySed: (payload: ReplySed | ReplyPdu1) => void
}

interface LoadSaveSelector {
  entries: Array<LocalStorageEntry<ReplySed | ReplyPdu1>> | null | undefined
  sedStatus: {[k in string]: string | null}
}

const LoadSave: React.FC<LoadSaveProps> = ({
  changeMode,
  storageKey,
  namespace,
  setReplySed
}: LoadSaveProps) => {
  const dispatch = useDispatch()
  const { entries, sedStatus }: LoadSaveSelector =
    useSelector<State, LoadSaveSelector>((state: State): LoadSaveSelector => ({
      entries: state.localStorage[namespace].entries,
      sedStatus: state.svarsed.sedStatus
    }))
  const [loadingSavedItems, setLoadingSavedItems] = useState<boolean>(false)
  const [addToDeletion, removeFromDeletion, isInDeletion] = useAddRemove<LocalStorageEntry<ReplySed | ReplyPdu1>>(
    (entry: LocalStorageEntry<ReplySed | ReplyPdu1>): string => entry.id)
  const [_sedStatusRequested, setSedStatusRequested] = useState<string | undefined>(undefined)

  const { t } = useTranslation()

  const onRemove = (entry: LocalStorageEntry<ReplySed | ReplyPdu1>) => {
    standardLogger(namespace + '.sidebar.removedraft', {})
    dispatch(localStorageActions.removeEntry(namespace, storageKey, entry))
  }

  const onRemoveAll = (e: React.ChangeEvent<HTMLButtonElement>) => {
    buttonLogger(e)
    if (window.confirm(t('label:er-du-sikker'))) {
      dispatch(localStorageActions.removeAll(namespace, storageKey))
    }
  }

  const handleLoadDraft = (e: React.ChangeEvent<HTMLButtonElement>, savedEntry: LocalStorageEntry<ReplySed | ReplyPdu1>) => {
    if ((savedEntry.content as ReplySed).sedType) {
      buttonLogger(e, { type: (savedEntry.content as ReplySed).sedType })
      setSedStatusRequested(savedEntry.id)
      dispatch(getSedStatus((savedEntry.content as ReplySed).saksnummer!, savedEntry.id))
    } else {
      // no need to chevk for status on PDU1 for now
      buttonLogger(e, { type: (savedEntry.content as ReplyPdu1).type })
      const entry: LocalStorageEntry<ReplySed | ReplyPdu1> | undefined = findSavedEntry(savedEntry.id)
      if (entry && !hasSentStatus(entry.id)) {
        dispatch(setCurrentEntry(namespace, entry))
        dispatch(setReplySed(entry.content))
        changeMode('B', 'forward')
      }
      setSedStatusRequested(undefined)
    }
  }

  const findSavedEntry = (svarsedId: string): LocalStorageEntry<ReplySed | ReplyPdu1> | undefined => (
    _.find(entries, (e: LocalStorageEntry<ReplySed | ReplyPdu1>) => e.id === svarsedId)
  )

  const hasSentStatus = (svarsedId: string): boolean => {
    if (!Object.prototype.hasOwnProperty.call(sedStatus, svarsedId)) {
      return false
    }
    return sedStatus[svarsedId] === 'sent'
  }

  useEffect(() => {
    if (!_.isNil(_sedStatusRequested) && Object.prototype.hasOwnProperty.call(sedStatus, _sedStatusRequested)) {
      const entry: LocalStorageEntry<ReplySed | ReplyPdu1> | undefined = findSavedEntry(_sedStatusRequested)
      if (entry && !hasSentStatus(entry.id)) {
        dispatch(setCurrentEntry(namespace, entry))
        dispatch(setReplySed(entry.content))
        changeMode('B', 'forward')
      }
      setSedStatusRequested(undefined)
    }
  }, [_sedStatusRequested, sedStatus])

  useEffect(() => {
    if (!loadingSavedItems && entries === undefined) {
      setLoadingSavedItems(true)
      dispatch(localStorageActions.loadEntries(namespace, storageKey))
    }
  }, [entries, loadingSavedItems])

  useEffect(() => {
    if (loadingSavedItems && entries !== undefined) {
      setLoadingSavedItems(false)
    }
  }, [entries, loadingSavedItems])

  return (
    <HighContrastPanel border style={{ margin: '0.1rem' }}>
      <LoadSaveDiv>
        {loadingSavedItems && (<WaitingPanel />)}
        {entries === null || _.isEmpty(entries)
          ? (
            <Normaltekst>
              {t('label:ingen-lagrede-seds')}
            </Normaltekst>
            )
          : (
            <Normaltekst>
              {t('label:lagrede-seds')}
            </Normaltekst>
            )}
        {entries?.map((savedEntry: LocalStorageEntry<ReplySed | ReplyPdu1>) => (
          <div key={savedEntry.id}>
            <FlexEtikett>
              <PileDiv flex='1'>
                <FlexCenterSpacedDiv>
                  <FlexBaseSpacedDiv>
                    <UndertekstBold>
                      {t('label:navn') + ': '}
                    </UndertekstBold>
                    <HorizontalSeparatorDiv size='0.5' />
                    <Normaltekst>
                      {savedEntry.name}
                    </Normaltekst>
                  </FlexBaseSpacedDiv>
                  <HorizontalSeparatorDiv />
                  <FlexBaseSpacedDiv>
                    <UndertekstBold>
                      {t('label:dato') + ': '}
                    </UndertekstBold>
                    <HorizontalSeparatorDiv size='0.5' />
                    <Normaltekst>
                      {savedEntry.date}
                    </Normaltekst>
                  </FlexBaseSpacedDiv>
                </FlexCenterSpacedDiv>
                <FlexCenterSpacedDiv>
                  <FlexBaseSpacedDiv>
                    <UndertekstBold>
                      {t('label:saksnummer') + ': '}
                    </UndertekstBold>
                    <HorizontalSeparatorDiv size='0.5' />
                    <Normaltekst>
                      {(savedEntry.content as any).saksnummer}
                    </Normaltekst>
                  </FlexBaseSpacedDiv>
                  <HorizontalSeparatorDiv />
                  <FlexBaseSpacedDiv>
                    <UndertekstBold>
                      {t('label:type') + ': '}
                    </UndertekstBold>
                    <HorizontalSeparatorDiv size='0.5' />
                    <Normaltekst>
                      {(savedEntry.content as any).sedType}
                    </Normaltekst>
                  </FlexBaseSpacedDiv>
                </FlexCenterSpacedDiv>
                <VerticalSeparatorDiv size='0.5' />
                <FlexBaseSpacedDiv>
                  <HighContrastFlatknapp
                    mini
                    kompakt
                    disabled={_sedStatusRequested === savedEntry.id || hasSentStatus(savedEntry.id)}
                    spinner={_sedStatusRequested === savedEntry.id}
                    data-amplitude={namespace + '.sidebar.loaddraft'}
                    onClick={(e: any) => handleLoadDraft(e, savedEntry)}
                  >
                    {_sedStatusRequested === savedEntry.id
                      ? t('message:loading-checking-sed-status')
                      : (hasSentStatus(savedEntry.id)
                          ? t('label:sendt')
                          : t('el:button-load'))}
                  </HighContrastFlatknapp>
                  <AddRemovePanel
                    existingItem
                    candidateForDeletion={isInDeletion(savedEntry)}
                    onBeginRemove={() => addToDeletion(savedEntry)}
                    onConfirmRemove={() => onRemove(savedEntry)}
                    onCancelRemove={() => removeFromDeletion(savedEntry)}
                  />
                </FlexBaseSpacedDiv>
              </PileDiv>
            </FlexEtikett>
            <VerticalSeparatorDiv />
          </div>
        ))}
        {!_.isEmpty(entries) && (
          <>
            <VerticalSeparatorDiv />
            <HighContrastFlatknapp
              mini
              kompakt
              data-amplitude={namespace + '.sidebar.removeall'}
              onClick={onRemoveAll}
            >
              {t('el:button-remove-all')}
            </HighContrastFlatknapp>
          </>
        )}
      </LoadSaveDiv>
    </HighContrastPanel>
  )
}

export default LoadSave
